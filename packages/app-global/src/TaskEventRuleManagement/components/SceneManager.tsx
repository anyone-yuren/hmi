import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
} from 'antd';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useTaskRuleStore } from '../store/useTaskRuleStore';
import { TaskType, VehicleModel } from '../types';

const TASK_TYPES: { label: string; value: TaskType }[] = [
  { label: '取货', value: 'PICKUP' },
  { label: '放货', value: 'DELIVER' },
  { label: '充电', value: 'CHARGE' },
  { label: '回待命点', value: 'RETURN_TO_STANDBY' },
];

const VEHICLE_MODELS: { label: string; value: VehicleModel }[] = [
  { label: 'X20', value: 'X20' },
  { label: 'X20S', value: 'X20S' },
  { label: 'K16', value: 'K16' },
  { label: 'O20', value: 'O20' },
  { label: 'R16', value: 'R16' },
  { label: 'SE15', value: 'SE15' },
];

export const SceneManager = () => {
  const {
    scenes,
    addScene,
    updateScene,
    deleteScene,
    relations,
    eventFlows,
    updateSceneFlowRelations,
    exportScenes,
  } = useTaskRuleStore();
  const [form] = Form.useForm();
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<{
    success: boolean;
    msg: string;
    details?: string;
  } | null>(null);

  // Form handling
  const handleSelectScene = (sceneId: string) => {
    setSelectedSceneId(sceneId);
    form.resetFields();
    const scene = scenes.find((s) => s.id === sceneId);
    if (scene) {
      // Also get linked flow
      const rels = relations
        .filter((r) => r.sceneId === sceneId)
        .map((r) => r.eventFlowId);

      form.setFieldsValue({
        name: scene.name,
        taskType: scene.taskType,
        conditions: scene.conditions,
        linkedFlowIds: rels,
      });
    }
    setSimulationResult(null);
  };

  const handleCreateScene = () => {
    setSelectedSceneId(null);
    form.resetFields();
    form.setFieldsValue({
      conditions: {
        vehicleModels: { mode: 'ALL', values: [] },
        vehicles: { mode: 'ALL', values: [] },
        locations: { mode: 'ALL', values: [] },
        heightRanges: [],
        palletTypes: { mode: 'ALL', values: [] },
      },
    });
    setSimulationResult(null);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const sceneData = {
        name: values.name,
        taskType: values.taskType,
        conditions: values.conditions,
      };

      let currentId = selectedSceneId;
      if (selectedSceneId) {
        updateScene(selectedSceneId, sceneData);
        message.success('更新成功');
      } else {
        currentId = nanoid();
        addScene({
          id: currentId,
          ...sceneData,
        });
        message.success('创建成功');
        setSelectedSceneId(currentId);
      }

      // Link flow
      if (currentId) {
        updateSceneFlowRelations(currentId, values.linkedFlowIds || []);
      }
    });
  };

  const handleDelete = () => {
    if (selectedSceneId) {
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除该场景吗？',
        onOk: () => {
          deleteScene(selectedSceneId);
          setSelectedSceneId(null);
          form.resetFields();
        },
      });
    }
  };

  // Simulation Logic
  const handleSimulation = () => {
    const testValues = form.getFieldsValue([
      'testVehicleModel',
      'testLocation',
      'testHeight',
      'testTaskType',
    ]);

    // 1. Find matched scenes
    const matchedScenes = scenes.filter((scene) => {
      // Check Task Type
      if (testValues.testTaskType && scene.taskType !== testValues.testTaskType)
        return false;

      // Check Vehicle Model
      if (testValues.testVehicleModel) {
        const { mode, values } = scene.conditions.vehicleModels;
        if (mode === 'INCLUDE' && !values.includes(testValues.testVehicleModel))
          return false;
        if (mode === 'EXCLUDE' && values.includes(testValues.testVehicleModel))
          return false;
      }

      // Check Height (Simple number check)
      if (testValues.testHeight) {
        const height = Number(testValues.testHeight);
        if (!isNaN(height) && scene.conditions.heightRanges.length > 0) {
          const inRange = scene.conditions.heightRanges.some(
            (r) => height >= r.min && height <= r.max
          );
          if (!inRange) return false;
        }
      }

      // Location check (Mock logic for now, real implementation needs spatial index)
      // if (testValues.testLocation) ...

      return true;
    });

    if (matchedScenes.length === 0) {
      setSimulationResult({ success: false, msg: '未匹配到任何场景' });
      return;
    }

    if (matchedScenes.length > 1) {
      setSimulationResult({
        success: false,
        msg: `匹配到多个场景: ${matchedScenes.map((s) => s.name).join(', ')}`,
        details: '请检查场景条件是否存在重叠',
      });
      return;
    }

    const matchedScene = matchedScenes[0];
    const rel = relations.find((r) => r.sceneId === matchedScene.id);

    if (!rel) {
      setSimulationResult({
        success: false,
        msg: `匹配到场景 [${matchedScene.name}]，但该场景未关联事件流`,
      });
      return;
    }

    const flow = eventFlows.find((f) => f.id === rel.eventFlowId);
    if (!flow) {
      setSimulationResult({ success: false, msg: '关联的事件流不存在' });
      return;
    }

    // Simulate Flow Execution (Mock)
    // Check if flow has valid start/end and connected path
    // Simple check: start -> ... -> end
    const startNode = flow.nodes.find((n) => n.data.isStart);
    const endNode = flow.nodes.find((n) => n.data.isEnd);

    if (!startNode || !endNode) {
      setSimulationResult({
        success: false,
        msg: `流程 [${flow.name}] 结构不完整 (缺少开始或结束节点)`,
      });
      return;
    }

    // Mock success
    setSimulationResult({
      success: true,
      msg: `匹配成功！执行场景: [${matchedScene.name}] -> 流程: [${flow.name}]`,
      details: '流程节点校验通过',
    });
  };

  return (
    <div className='h-full flex gap-4'>
      {/* Left: Scene List */}
      <div className='w-1/4 min-w-[250px] flex flex-col border-r border-white/10 pr-4'>
        <div className='mb-4 flex justify-between items-center'>
          <span className='font-bold text-lg text-white'>场景列表</span>
          <div className='space-x-2'>
            <Button size='small' onClick={exportScenes}>
              导出
            </Button>
            <Button type='primary' size='small' onClick={handleCreateScene}>
              新建
            </Button>
          </div>
        </div>
        <div className='flex-1 overflow-y-auto space-y-2'>
          {scenes.map((s) => (
            <Card
              key={s.id}
              size='small'
              hoverable
              className={`cursor-pointer bg-white/5 border-white/10 ${
                selectedSceneId === s.id
                  ? '!border-blue-500 !bg-blue-500/20'
                  : ''
              }`}
              onClick={() => handleSelectScene(s.id)}
            >
              <div className='font-medium text-white'>{s.name}</div>
              <div className='text-xs text-white/60 mt-1'>
                {TASK_TYPES.find((t) => t.value === s.taskType)?.label}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Right: Scene Editor */}
      <div className='flex-1 overflow-y-auto pl-4'>
        <Form form={form} layout='vertical'>
          <div className='flex justify-between items-center mb-4'>
            <span className='text-white text-lg font-bold'>
              {selectedSceneId ? '编辑场景' : '新建场景'}
            </span>
            <div className='space-x-2'>
              <Button type='primary' onClick={handleSave}>
                保存
              </Button>
              {selectedSceneId && (
                <Button danger onClick={handleDelete}>
                  删除
                </Button>
              )}
            </div>
          </div>

          <Card
            title={<span className='text-white'>基础信息</span>}
            className='mb-4 bg-white/5 border-white/10'
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label={<span className='text-white'>场景名称</span>}
                  name='name'
                  rules={[{ required: true }]}
                >
                  <Input placeholder='请输入场景名称' />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={<span className='text-white'>任务类型</span>}
                  name='taskType'
                  rules={[{ required: true }]}
                >
                  <Select options={TASK_TYPES} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={<span className='text-white'>关联事件流</span>}
                  name='linkedFlowIds'
                >
                  <Select
                    mode='multiple'
                    placeholder='选择要执行的流程'
                    options={eventFlows
                      .filter(
                        (f) =>
                          !form.getFieldValue('taskType') ||
                          f.taskType === form.getFieldValue('taskType')
                      )
                      .map((f) => ({ label: f.name, value: f.id }))}
                    allowClear
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card
            title={<span className='text-white'>条件配置区</span>}
            className='mb-4 bg-white/5 border-white/10'
          >
            {/* Vehicle Model */}
            <div className='mb-4 p-4 bg-white/5 rounded border border-white/10'>
              <div className='font-medium mb-2 text-white'>车型限制</div>
              <Form.Item
                name={['conditions', 'vehicleModels', 'mode']}
                initialValue='ALL'
              >
                <Radio.Group>
                  <Radio value='ALL' className='text-white'>
                    所有车型
                  </Radio>
                  <Radio value='INCLUDE' className='text-white'>
                    包含指定
                  </Radio>
                  <Radio value='EXCLUDE' className='text-white'>
                    排除指定
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev.conditions?.vehicleModels?.mode !==
                  curr.conditions?.vehicleModels?.mode
                }
              >
                {({ getFieldValue }) => {
                  const mode = getFieldValue([
                    'conditions',
                    'vehicleModels',
                    'mode',
                  ]);
                  return mode !== 'ALL' ? (
                    <Form.Item name={['conditions', 'vehicleModels', 'values']}>
                      <Select
                        mode='multiple'
                        placeholder='请选择车型'
                        options={VEHICLE_MODELS}
                      />
                    </Form.Item>
                  ) : null;
                }}
              </Form.Item>
            </div>

            {/* Location */}
            <div className='mb-4 p-4 bg-white/5 rounded border border-white/10'>
              <div className='font-medium mb-2 text-white'>库位点限制</div>
              <Form.Item
                name={['conditions', 'locations', 'mode']}
                initialValue='ALL'
              >
                <Radio.Group>
                  <Radio value='ALL' className='text-white'>
                    所有库位
                  </Radio>
                  <Radio value='POINTS' className='text-white'>
                    指定点号
                  </Radio>
                  <Radio value='REGION' className='text-white'>
                    地图区域
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prev, curr) =>
                  prev.conditions?.locations?.mode !==
                  curr.conditions?.locations?.mode
                }
              >
                {({ getFieldValue }) => {
                  const mode = getFieldValue([
                    'conditions',
                    'locations',
                    'mode',
                  ]);
                  if (mode === 'POINTS') {
                    return (
                      <Form.Item name={['conditions', 'locations', 'values']}>
                        <Select mode='tags' placeholder='输入点ID' />
                      </Form.Item>
                    );
                  }
                  if (mode === 'REGION') {
                    return (
                      <div className='text-white/60'>
                        地图区域选择器 (待集成)
                      </div>
                    );
                  }
                  return null;
                }}
              </Form.Item>
            </div>

            {/* Height */}
            <div className='mb-4 p-4 bg-white/5 rounded border border-white/10'>
              <div className='font-medium mb-2 text-white'>高度区间 (米)</div>
              <Form.List name={['conditions', 'heightRanges']}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div key={key} className='flex gap-2 items-center mb-2'>
                        <Form.Item {...restField} name={[name, 'min']} noStyle>
                          <InputNumber placeholder='Min' />
                        </Form.Item>
                        <span className='text-white'>-</span>
                        <Form.Item {...restField} name={[name, 'max']} noStyle>
                          <InputNumber placeholder='Max' />
                        </Form.Item>
                        <Button type='link' danger onClick={() => remove(name)}>
                          删除
                        </Button>
                      </div>
                    ))}
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      block
                      className='text-white border-white/20 hover:border-blue-500 hover:text-blue-500'
                    >
                      + 添加区间
                    </Button>
                  </>
                )}
              </Form.List>
            </div>
          </Card>

          <Card
            title={<span className='text-white'>匹配模拟器</span>}
            className='mb-4 bg-blue-900/10 border-blue-900/20'
          >
            <div className='flex gap-4 items-end'>
              <div className='flex-1 grid grid-cols-4 gap-2'>
                <Form.Item
                  name='testTaskType'
                  label={<span className='text-white'>任务类型</span>}
                  className='mb-0'
                >
                  <Select options={TASK_TYPES} allowClear />
                </Form.Item>
                <Form.Item
                  name='testVehicleModel'
                  label={<span className='text-white'>车型</span>}
                  className='mb-0'
                >
                  <Select options={VEHICLE_MODELS} allowClear />
                </Form.Item>
                <Form.Item
                  name='testLocation'
                  label={<span className='text-white'>库位点</span>}
                  className='mb-0'
                >
                  <Input placeholder='输入点ID' />
                </Form.Item>
                <Form.Item
                  name='testHeight'
                  label={<span className='text-white'>高度</span>}
                  className='mb-0'
                >
                  <InputNumber placeholder='输入高度' className='w-full' />
                </Form.Item>
              </div>
              <Button type='primary' onClick={handleSimulation}>
                模拟匹配
              </Button>
            </div>

            {simulationResult && (
              <div
                className={`mt-4 p-3 rounded border ${
                  simulationResult.success
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div
                  className={`font-bold ${
                    simulationResult.success ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {simulationResult.success ? '✅ 匹配成功' : '❌ 匹配失败'}
                </div>
                <div className='text-white mt-1'>{simulationResult.msg}</div>
                {simulationResult.details && (
                  <div className='text-white/60 text-sm mt-1'>
                    {simulationResult.details}
                  </div>
                )}
              </div>
            )}
          </Card>
        </Form>
      </div>
    </div>
  );
};
