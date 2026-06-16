import { Checkbox, Collapse, Form, Input, InputNumber, Select } from 'antd';
import { useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { useShallow } from 'zustand/react/shallow';
import { useAreaStore } from '../../drawArea/store/areaStore';

const BatchGenerateDialog = ({ boundsRef, contextMenuPosition, setShowAreaParamsDialog }) => {
  const [form] = Form.useForm();
  const { showBatchGenerateDialog, setShowBatchGenerateDialog, selectedIds, areas } = useAreaStore(
    useShallow((store) => ({
      showBatchGenerateDialog: store.showBatchGenerateDialog,
      setShowBatchGenerateDialog: store.setShowBatchGenerateDialog,
      selectedIds: store.selectedIds,
      areas: store.areas,
    })),
  );

  /* ------------------- 同步选中线段数据 ------------------- */
  useEffect(() => {
    if (!selectedIds.length) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      areaId: selectedIds[0],
    });
    return () => {
      form.resetFields();
    };
  }, [selectedIds]);
  if (!showBatchGenerateDialog) {
    return null;
  }

  return (
    <Rnd
      default={{
        x: contextMenuPosition?.x ?? 200 + 20,
        y: contextMenuPosition?.y ?? 100 + 20,
        width: 360,
        height: 240,
      }}
      minWidth={240}
      minHeight={180}
      bounds={boundsRef.current!}
      className='bg-[#1e1e1e] rounded-md shadow-lg'
      style={{ zIndex: 1000 }}
    >
      <div className='flex flex-col h-full text-white'>
        {/* 标题栏 */}
        <div className='h-10 px-3 flex items-center justify-between border-b border-[#333] cursor-move'>
          <span>批量生成库位</span>
          <span
            className='cursor-pointer'
            onClick={() => {
              setShowBatchGenerateDialog(false);
              // setShowAreaParamsDialog(!showAreaParamsDialog);
            }}
          >
            ✕
          </span>
        </div>

        {/* 内容区 */}
        <div className='flex-1 p-1 overflow-auto'>
          <div className='flex-1 rounded-sm p-2 overflow-auto'>
            <Form form={form} layout='horizontal' labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete='off'>
              <Collapse defaultActiveKey={['1']}>
                {/* ---------------- 通用属性 ---------------- */}
                <Collapse.Panel header='库位属性' key='1'>
                  <Form.Item name='name' label='名称规则'>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item name='direction' label='方向' tooltip='库位的朝向，基于库位点的位置'>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item name='offset' label='偏移量' tooltip='库位的偏移量，基于库位点的位置'>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item name='layer' label='层数'>
                    <InputNumber size='small' className='w-full' />
                  </Form.Item>
                  <Form.Item name='areaId' label='所属区域'>
                    <Select size='small' options={areas.map((area) => ({ label: area.name, value: area.id }))} />
                  </Form.Item>
                  <Form.Item name='floorId' label='所属楼层'>
                    <Select
                      size='small'
                      options={[
                        { label: '1', value: '1' },
                        { label: '2', value: '2' },
                      ]}
                    />
                  </Form.Item>
                </Collapse.Panel>

                {/* ---------------- 高级属性 ---------------- */}
                <Collapse.Panel header='高级属性' key='2'>
                  <Form.Item label='线路编号' name='lineId' rules={[{ required: true, message: '请输入线路编号' }]}>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item label='起始点' name='startPoint' rules={[{ required: true, message: '请输入起始点' }]}>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item label='终止点' name='endPoint' rules={[{ required: true, message: '请输入终止点' }]}>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item label='进入角度' name='enterAngle' rules={[{ required: true, message: '请输入进入角度' }]}>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item label='离开角度' name='leaveAngle' rules={[{ required: true, message: '请输入离开角度' }]}>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item label='速度比例' name='speedRatio' rules={[{ required: true, message: '请输入速度比例' }]}>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item label='速度' name='speed' rules={[{ required: true, message: '请输入速度' }]}>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item label='线路长度' name='lineLength' rules={[{ required: true, message: '请输入线路长度' }]}>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item label='起始比例' name='startRatio' rules={[{ required: true, message: '请输入起始比例' }]}>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item label='终止比例' name='endRatio' rules={[{ required: true, message: '请输入终止比例' }]}>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item label='方向' name='direction' rules={[{ required: true, message: '请选择方向' }]}>
                    <Select
                      size='small'
                      options={[
                        { label: '顺时针', value: 'clockwise' },
                        { label: '逆时针', value: 'counterclockwise' },
                        { label: '优弧', value: 'optimalArc' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item label='航向角' name='headingAngle' rules={[{ required: true, message: '请输入航向角' }]}>
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item
                    label='附加权重'
                    name='additionalWeight'
                    rules={[{ required: true, message: '请输入附加权重' }]}
                  >
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item name='flexiblePath' valuePropName='checked' label={'柔性路径'}>
                    <Checkbox></Checkbox>
                  </Form.Item>
                  <Form.Item name='autoOnline' valuePropName='checked' label={'自动上线'}>
                    <Checkbox></Checkbox>
                  </Form.Item>
                  <Form.Item name='virtualFloorLine' valuePropName='checked' label={'楼层虚拟线'}>
                    <Checkbox></Checkbox>
                  </Form.Item>
                  <Form.Item
                    label='左侧绕障距离'
                    name='leftObstacleDistance'
                    rules={[{ required: true, message: '请输入左侧绕障距离' }]}
                  >
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item
                    label='右侧绕障距离'
                    name='rightObstacleDistance'
                    rules={[{ required: true, message: '请输入右侧绕障距离' }]}
                  >
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item
                    label='逻辑值1'
                    name='logicalValue1'
                    rules={[{ required: true, message: '请输入逻辑值1' }]}
                  >
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item
                    label='逻辑值2'
                    name='logicalValue2'
                    rules={[{ required: true, message: '请输入逻辑值2' }]}
                  >
                    <Input size='small' />
                  </Form.Item>
                  <Form.Item
                    label='逻辑值3'
                    name='logicalValue3'
                    rules={[{ required: true, message: '请输入逻辑值3' }]}
                  >
                    <Input size='small' />
                  </Form.Item>
                </Collapse.Panel>
              </Collapse>
            </Form>
          </div>
        </div>
      </div>
    </Rnd>
  );
};

export default BatchGenerateDialog;
