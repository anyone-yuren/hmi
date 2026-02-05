import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button, Card, Form, Input, Select, Switch } from 'antd';
import { useVehicleModelStore } from '../store/useVehicleModelStore';
import { PARAMETER_GROUPS, VEHICLE_TYPES, VehicleType } from '../types';
import { nodeTypes } from './nodes';

const ModelDetail = () => {
  const {
    cancelEditing,
    currentModel,
    selectedVehicleType,
    setVehicleType,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    activeGroups,
    toggleGroup,
  } = useVehicleModelStore();

  const [form] = Form.useForm();

  const handleSave = () => {
    // Save logic here
    cancelEditing();
  };

  return (
    <div className='flex flex-col h-full bg-white/5'>
      {/* Header */}
      <div className='flex justify-between items-center p-4 bg-white/10 shadow-sm'>
        <div className='flex items-center gap-4'>
          <Button icon={<ArrowLeftOutlined />} onClick={cancelEditing} />
          <div className='text-lg font-bold'>
            {currentModel ? `编辑车型: ${currentModel.name}` : '新建车型'}
          </div>
        </div>
        <Button type='primary' icon={<SaveOutlined />} onClick={handleSave}>
          保存
        </Button>
      </div>

      <div className='flex flex-1 overflow-hidden'>
        {/* Left Sidebar: Basic Info & Switches */}
        <div className='w-80 bg-white/5  overflow-y-auto p-4 flex flex-col gap-6'>
          <Card size='small' title='基础信息'>
            <Form
              form={form}
              layout='vertical'
              initialValues={currentModel || {}}
            >
              <Form.Item label='车型名称' name='name' required>
                <Input placeholder='请输入车型名称' />
              </Form.Item>
              <Form.Item label='车辆类型' required>
                <Select
                  value={selectedVehicleType}
                  onChange={(val) => setVehicleType(val as VehicleType)}
                  placeholder='选择基础车型'
                >
                  {VEHICLE_TYPES.map((type) => (
                    <Select.Option key={type} value={type}>
                      {type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Card>

          {selectedVehicleType && (
            <Card size='small' title='参数配置开关'>
              <div className='flex flex-col gap-4'>
                {PARAMETER_GROUPS.map((group) => (
                  <div
                    key={group.key}
                    className='flex justify-between items-center'
                  >
                    <span>{group.label}</span>
                    <Switch
                      checked={activeGroups[group.key]}
                      onChange={(checked) => toggleGroup(group.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Center: React Flow Canvas */}
        <div className='flex-1 h-full relative'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            colorMode='dark'
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default ModelDetail;
