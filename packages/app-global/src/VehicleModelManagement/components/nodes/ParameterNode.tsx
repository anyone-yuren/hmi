import { Handle, Position } from '@xyflow/react';
import { Card, Form, Input, InputNumber, Select, Switch } from 'antd';
import { memo, useEffect } from 'react';
import {
  PARAMETER_GROUPS,
  REFERENCE_POINTS,
  STEERING_TYPES,
  TRAY_MODELS,
} from '../../types';

interface ParameterNodeProps {
  data: {
    group: string;
    values?: any; // Initial values for the form
  };
}

const ParameterNode = memo(({ data }: ParameterNodeProps) => {
  const [form] = Form.useForm();

  // Use Chinese label from PARAMETER_GROUPS if available
  const groupInfo = PARAMETER_GROUPS.find((g) => g.key === data.group);

  let title = data.group;
  if (groupInfo) {
    title = groupInfo.label;
  } else if (data.group.startsWith('tray_')) {
    const trayId = data.group.replace('tray_', '');
    const tray = TRAY_MODELS.find((t) => t.value === trayId);
    title = `托盘配置: ${tray ? tray.label : trayId}`;
  }

  useEffect(() => {
    if (data.values) {
      form.setFieldsValue(data.values);
    }
  }, [data.values, form]);

  const renderFormItems = () => {
    if (data.group.startsWith('tray_')) {
      return (
        <>
          <div className='grid grid-cols-2 gap-2'>
            <Form.Item label='X 偏移' name='x_offset' className='mb-2'>
              <InputNumber size='small' className='w-full' />
            </Form.Item>
            <Form.Item label='Y 偏移' name='y_offset' className='mb-2'>
              <InputNumber size='small' className='w-full' />
            </Form.Item>
          </div>
          <Form.Item label='角度偏移' name='angle_offset' className='mb-2'>
            <InputNumber size='small' className='w-full' addonAfter='°' />
          </Form.Item>
        </>
      );
    }

    switch (data.group) {
      case 'basic_id':
        return (
          <>
            <Form.Item
              label='ID (唯一标识)'
              name='id'
              className='mb-2'
              required
            >
              <Input size='small' placeholder='系统唯一ID' />
            </Form.Item>
            <Form.Item label='名称' name='name' className='mb-2'>
              <Input size='small' placeholder='显示名称' />
            </Form.Item>
            <Form.Item label='描述' name='description' className='mb-2'>
              <Input.TextArea
                size='small'
                placeholder='运维描述信息'
                rows={2}
              />
            </Form.Item>
          </>
        );
      case 'physical':
        return (
          <>
            <div className='grid grid-cols-3 gap-2 nodrag'>
              <Form.Item label='长(L)' name='length' className='mb-2'>
                <InputNumber
                  size='small'
                  className='w-full'
                  placeholder='长度'
                />
              </Form.Item>
              <Form.Item label='宽(W)' name='width' className='mb-2'>
                <InputNumber
                  size='small'
                  className='w-full'
                  placeholder='宽度'
                />
              </Form.Item>
              <Form.Item label='高(H)' name='height' className='mb-2'>
                <InputNumber
                  size='small'
                  className='w-full'
                  placeholder='高度'
                />
              </Form.Item>
            </div>
            <Form.Item
              label='占地轮廓 (多边形)'
              name='polygon'
              className='mb-2'
            >
              <Input.TextArea
                size='small'
                placeholder='JSON格式: {"type": "polygon", "points": [[x,y]...]}'
                rows={3}
              />
            </Form.Item>
            <Form.Item label='参考点' name='ref_point' className='mb-2 nodrag'>
              <Select
                size='small'
                className='nodrag'
                options={REFERENCE_POINTS}
                placeholder='选择锚点'
              />
            </Form.Item>
          </>
        );
      case 'kinematics':
        return (
          <>
            <div className='grid grid-cols-2 gap-2'>
              <Form.Item label='最大速度' name='max_speed' className='mb-2'>
                <InputNumber size='small' className='w-full' />
              </Form.Item>
              <Form.Item
                label='最大角速度'
                name='max_angular_speed'
                className='mb-2'
              >
                <InputNumber size='small' className='w-full' />
              </Form.Item>
            </div>
            <Form.Item
              label='最小转弯半径'
              name='min_turn_radius'
              className='mb-2'
              tooltip='对于边缘曲率约束至关重要'
            >
              <InputNumber size='small' className='w-full' />
            </Form.Item>
            <div className='grid grid-cols-2 gap-2'>
              <Form.Item label='加速度' name='acceleration' className='mb-2'>
                <InputNumber size='small' className='w-full' />
              </Form.Item>
              <Form.Item label='减速度' name='deceleration' className='mb-2'>
                <InputNumber size='small' className='w-full' />
              </Form.Item>
            </div>
          </>
        );
      case 'behavior':
        return (
          <>
            <Form.Item label='转向类型' name='steering_type' className='mb-2'>
              <Select
                size='small'
                className='nodrag'
                options={STEERING_TYPES}
                placeholder='选择转向类型'
              />
            </Form.Item>
            <div className='flex justify-between mb-2'>
              <span>允许倒车</span>
              <Form.Item
                className='mb-0'
                name='allow_reverse'
                valuePropName='checked'
              >
                <Switch size='small' />
              </Form.Item>
            </div>
            <div className='flex justify-between mb-2'>
              <span>原地旋转</span>
              <Form.Item
                className='mb-0'
                name='allow_rotate'
                valuePropName='checked'
              >
                <Switch size='small' />
              </Form.Item>
            </div>
          </>
        );
      case 'safety':
        return (
          <Form.Item label='停车距离' name='stop_distance' className='mb-2'>
            <InputNumber size='small' className='w-full' addonAfter='米' />
          </Form.Item>
        );
      case 'planning':
        return (
          <>
            <Form.Item label='首选切入角度' name='entry_angle' className='mb-2'>
              <InputNumber size='small' className='w-full' addonAfter='度' />
            </Form.Item>
            <Form.Item
              label='约束模板'
              name='constraint_template'
              className='mb-2'
            >
              <Select
                size='small'
                className='nodrag'
                placeholder='选择模板'
                options={[
                  { label: '通用模板', value: 'universal' },
                  { label: '重载模板', value: 'heavy' },
                ]}
              />
            </Form.Item>
          </>
        );
      default:
        return <div className='text-xs text-gray-400'>未知分组</div>;
    }
  };

  const isLeft =
    data.group.startsWith('tray_') ||
    PARAMETER_GROUPS.findIndex((g) => g.key === data.group) % 2 === 0;

  return (
    <Card
      title={title}
      size='small'
      className='w-72 shadow-md nodrag' // Added nodrag class here
      style={{ borderLeft: '4px solid #00d1d1' }}
      headStyle={{ fontSize: '14px', minHeight: '36px' }}
      bodyStyle={{ padding: '12px' }}
    >
      <Handle
        type='target'
        position={Position.Right}
        id='right'
        style={{ background: '#00d1d1', opacity: isLeft ? 1 : 0 }}
      />
      <Handle
        type='target'
        position={Position.Left}
        id='left'
        style={{ background: '#00d1d1', opacity: isLeft ? 0 : 1 }}
      />
      <Form layout='vertical' className='nodrag' form={form}>
        {renderFormItems()}
      </Form>
    </Card>
  );
});

export default ParameterNode;
