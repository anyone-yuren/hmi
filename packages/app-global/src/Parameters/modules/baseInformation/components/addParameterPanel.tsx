import { Button, Form, Input, Select } from 'antd';
import React from 'react';
import { Rnd } from 'react-rnd';
import { useShallow } from 'zustand/react/shallow';
import { useParameterMenuStore } from '../../../store';
import type { DeviceParameter } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DeviceParameter) => void;
  boundsRef: React.RefObject<Element>;
}

const AddParameterPanel: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
  boundsRef,
}) => {
  const [form] = Form.useForm();

  const { contextMenuPosition } = useParameterMenuStore(
    useShallow((state) => {
      return {
        contextMenuPosition: state.contextMenuPosition,
      };
    }),
  );
  if (!open || !boundsRef?.current) return null;

  const handleFinish = (values: any) => {
    onSubmit({
      key: Date.now().toString(),
      ...values,
    });
    form.resetFields();
    onClose();
  };

  return (
    <Rnd
      default={{
        x: contextMenuPosition?.x ?? 200 + 20,
        y: contextMenuPosition?.y ?? 100 + 20,
        width: 300,
        height: 200,
      }}
      minWidth={260}
      minHeight={120}
      bounds={boundsRef.current!}
      className='bg-white/5 rounded-md  shadow-custom-box shadow-cyan-400'
      style={{ zIndex: 1000 }}
    >
      <div className='flex flex-col h-full text-white'>
        {/* 标题栏 */}
        <div className='h-10 px-3 flex items-center justify-between border-b border-[#333] cursor-move'>
          <span>区域属性</span>
          <span
            className='cursor-pointer'
            onClick={() => {
              onClose();
            }}
          >
            ✕
          </span>
        </div>

        {/* 内容区 */}
        <div className='flex-1 p-3 overflow-auto'>
          <Form
            size='small'
            form={form}
            layout='horizontal'
            labelAlign='right'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={handleFinish}
          >
            <Form.Item
              label='参数标识'
              name='parameter'
              rules={[{ required: true }]}
            >
              <Input placeholder='如：max_speed' />
            </Form.Item>

            <Form.Item
              label='参数名称'
              name='name'
              rules={[{ required: true }]}
            >
              <Input placeholder='最大速度' />
            </Form.Item>

            <Form.Item label='类型' name='type' rules={[{ required: true }]}>
              <Select
                options={[
                  { label: 'String', value: 'String' },
                  { label: 'Number', value: 'Number' },
                  { label: 'Boolean', value: 'Boolean' },
                ]}
              />
            </Form.Item>

            <Form.Item label='参数值' name='value' rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <div className='flex justify-end gap-2'>
              <Button onClick={onClose}>取消</Button>
              <Button type='primary' htmlType='submit'>
                新增
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </Rnd>
  );
};

export default AddParameterPanel;
