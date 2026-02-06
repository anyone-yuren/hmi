import {
  Collapse,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Switch,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useParkingRuleStore } from '../store/useParkingRuleStore';
import { useVehicleModelStore } from '../store/useVehicleModelStore';

const ParkingRuleModal = () => {
  const { isEditing, currentRule, cancelEditing, addRule, updateRule } =
    useParkingRuleStore();
  const { models } = useVehicleModelStore();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditing) {
      if (currentRule) {
        form.setFieldsValue({
          ...currentRule,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          enabled: true,
          priority: 1,
          parkingPoint: {
            anchor: 'CENTER',
            offsetX: 0.6,
            offsetY: 0,
            direction: 'FORWARD',
            angle: 0,
          },
          safety: { visualDetection: false },
        });
      }
    }
  }, [isEditing, currentRule, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

      if (currentRule) {
        updateRule(currentRule.id, { ...values, updateTime: now });
        message.success('规则更新成功');
      } else {
        addRule({
          id: `PR${Date.now()}`,
          ...values,
          updateTime: now,
        });
        message.success('规则创建成功');
      }
      cancelEditing();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const collapseItems = [
    {
      key: 'basic',
      label: '基础信息',
      children: (
        <>
          <Form.Item
            name='name'
            label='规则名称'
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder='请输入规则名称' />
          </Form.Item>
          <Form.Item name='vehicleModelIds' label='适用车型'>
            <Select mode='multiple' placeholder='选择车型'>
              {models.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name='stationType'
            label='Station 类型'
            rules={[{ required: true, message: '请输入 Station 类型' }]}
          >
            <Input placeholder='输入 Station 类型' />
          </Form.Item>
          <Form.Item name='priority' label='优先级'>
            <InputNumber min={0} className='w-full' />
          </Form.Item>
          <Form.Item name='enabled' label='是否启用' valuePropName='checked'>
            <Switch />
          </Form.Item>
          <Form.Item name='description' label='说明'>
            <Input.TextArea placeholder='规则说明' />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'parkingPoint',
      label: '停车点生成规则',
      children: (
        <>
          <Form.Item name={['parkingPoint', 'anchor']} label='Anchor 参考点'>
            <Select>
              <Select.Option value='CENTER'>Center</Select.Option>
              <Select.Option value='REAR_AXLE'>Rear Axle</Select.Option>
              <Select.Option value='FRONT_AXLE'>Front Axle</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={['parkingPoint', 'offsetX']} label='偏移量 X'>
            <InputNumber className='w-full' />
          </Form.Item>
          <Form.Item name={['parkingPoint', 'offsetY']} label='偏移量 Y'>
            <InputNumber className='w-full' />
          </Form.Item>
          <Form.Item name={['parkingPoint', 'direction']} label='停车点方向'>
            <Select>
              <Select.Option value='FORWARD'>Forward</Select.Option>
              <Select.Option value='BACKWARD'>Backward</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name={['parkingPoint', 'angle']} label='停车角度'>
            <InputNumber className='w-full' />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'safety',
      label: '安全约束',
      children: (
        <>
          {/* <Form.Item
            name={['safety', 'visualDetection']}
            label='是否开启视觉检测'
            valuePropName='checked'
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name={['safety', 'obstacleAvoidanceScheme']}
            label='关联的避障方案'
          >
            <Input placeholder='输入避障方案名称' />
          </Form.Item> */}
        </>
      ),
    },
  ];

  return (
    <Modal
      title={currentRule ? '编辑停车规则' : '新增停车规则'}
      open={isEditing}
      onOk={handleOk}
      onCancel={cancelEditing}
      width={800}
      maskClosable={false}
      forceRender
      zIndex={1001}
    >
      <Form form={form} layout='horizontal' size='small' labelCol={{ span: 6 }}>
        <Collapse
          defaultActiveKey={['basic', 'parkingPoint', 'safety']}
          items={collapseItems}
        />
      </Form>
    </Modal>
  );
};

export default ParkingRuleModal;
