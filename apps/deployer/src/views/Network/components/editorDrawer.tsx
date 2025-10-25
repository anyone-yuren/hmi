import { Button, Drawer, Form, Input, InputNumber, Select, Space, Switch } from 'antd';
import React, { useEffect } from 'react';

export interface PortRule {
  enabled: boolean;
  proto: 'tcp' | 'udp' | 'tcp udp';
  src_port: number;
  dest_ip: string;
  dest_port: number;
  name: string;
}

interface PortRuleDrawerProps {
  open: boolean; // 是否显示抽屉
  onClose: () => void; // 关闭回调
  onSubmit: (values: PortRule) => void; // 保存回调
  initialValues?: Partial<PortRule>; // 编辑模式的初始值
}

const protoOptions = [
  { label: 'TCP', value: 'tcp' },
  { label: 'UDP', value: 'udp' },
  { label: 'TCP + UDP', value: 'tcp udp' },
];

const PortRuleDrawer: React.FC<PortRuleDrawerProps> = ({ open, onClose, onSubmit, initialValues }) => {
  const [form] = Form.useForm<PortRule>();

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.setFieldsValue({ enabled: true, proto: 'tcp' });
      }
    }
  }, [open, initialValues, form]);

  const handleFinish = (values: PortRule) => {
    onSubmit({ ...initialValues, ...values });
    onClose();
  };

  return (
    <Drawer
      title={initialValues ? '编辑端口规则' : '新增端口规则'}
      open={open}
      width={400}
      onClose={onClose}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type='primary' onClick={() => form.submit()}>
            保存
          </Button>
        </Space>
      }
    >
      <Form form={form} layout='vertical' onFinish={handleFinish} initialValues={{ enabled: true, proto: 'tcp' }}>
        <Form.Item label='是否启用' name='enabled' valuePropName='checked'>
          <Switch checkedChildren='启用' unCheckedChildren='禁用' />
        </Form.Item>

        <Form.Item label='协议' name='proto' rules={[{ required: true, message: '请选择协议类型' }]}>
          <Select options={protoOptions} />
        </Form.Item>

        <Form.Item label='源端口' name='src_port' rules={[{ required: true, message: '请输入源端口' }]}>
          <InputNumber min={1} max={65535} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label='目标 IP'
          name='dest_ip'
          rules={[
            { required: true, message: '请输入目标 IP' },
            {
              pattern: /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
              message: '请输入合法的 IP 地址',
            },
          ]}
        >
          <Input placeholder='例如：192.168.1.150' />
        </Form.Item>

        <Form.Item label='目标端口' name='dest_port' rules={[{ required: true, message: '请输入目标端口' }]}>
          <InputNumber min={1} max={65535} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label='备注名称' name='name' rules={[{ required: true, message: '请输入名称' }]}>
          <Input placeholder='请输入备注名称' />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default PortRuleDrawer;
