import { Form, Input, InputNumber, Modal } from 'antd';
import React from 'react';
import { FilterStrategy } from '../types/sensor';

interface FilterStrategyModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<FilterStrategy, 'id'>) => void;
  sensorName: string;
}

export const FilterStrategyModal: React.FC<FilterStrategyModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  sensorName,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      title={
        <span className='text-zinc-200 font-bold'>
          为 [{sensorName}] 标定滤波网络参数
        </span>
      }
      open={visible}
      onCancel={onCancel}
      onOk={async () => {
        const values = await form.validateFields();
        onSubmit(values);
        form.resetFields();
      }}
      destroyOnClose
      okText='确认添加'
      cancelText='取消'
      width={460}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          height: 0,
          angle: 0,
          verticalDist: 0,
          horizontalDist: 0,
        }}
        className='mt-4'
      >
        <Form.Item
          name='name'
          label='滤波策略名'
          rules={[{ required: true, message: '请输入策略名称' }]}
        >
          <Input
            className='bg-zinc-800 border-zinc-700 text-zinc-200'
            placeholder='如: 货架高架防噪点'
          />
        </Form.Item>
        <div className='grid grid-cols-2 gap-4'>
          <Form.Item name='height' label='过滤高度 (Height)'>
            <InputNumber className='w-full' addonAfter='m' step={0.1} />
          </Form.Item>
          <Form.Item name='angle' label='角度范围 (Angle)'>
            <InputNumber className='w-full' addonAfter='°' step={1} />
          </Form.Item>
          <Form.Item name='verticalDist' label='纵向切除距离 (Vertical)'>
            <InputNumber className='w-full' addonAfter='m' step={0.5} />
          </Form.Item>
          <Form.Item name='horizontalDist' label='横向切除距离 (Horizontal)'>
            <InputNumber className='w-full' addonAfter='m' step={0.5} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
