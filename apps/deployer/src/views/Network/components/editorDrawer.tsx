import { Button, Drawer, Form, Input, InputNumber, Select, Space, Switch } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      title={initialValues ? t('deployer.network.editPortRules') : t('deployer.network.addPortRules')}
      open={open}
      width={400}
      onClose={onClose}
      destroyOnClose
      extra={
        <Space>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button type='primary' onClick={() => form.submit()}>
            {t('common.save')}
          </Button>
        </Space>
      }
    >
      <Form form={form} layout='vertical' onFinish={handleFinish} initialValues={{ enabled: true, proto: 'tcp' }}>
        <Form.Item label={t('deployer.network.enabled')} name='enabled' valuePropName='checked'>
          <Switch checkedChildren={t('common.enabled')} unCheckedChildren={t('common.disabled')} />
        </Form.Item>

        <Form.Item
          label={t('deployer.network.proto')}
          name='proto'
          rules={[{ required: true, message: t('deployer.network.protoRequired') }]}
        >
          <Select options={protoOptions} />
        </Form.Item>

        <Form.Item
          label={t('deployer.network.srcPort')}
          name='src_port'
          rules={[{ required: true, message: t('deployer.network.srcPortRequired') }]}
        >
          <InputNumber min={1} max={65535} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('deployer.network.destIp')}
          name='dest_ip'
          rules={[
            { required: true, message: t('deployer.network.destIpRequired') },
            {
              pattern: /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
              message: t('deployer.network.destIpInvalid'),
            },
          ]}
        >
          <Input placeholder={t('deployer.network.such') + '：192.168.1.150'} />
        </Form.Item>

        <Form.Item
          label={t('deployer.network.destPort')}
          name='dest_port'
          rules={[{ required: true, message: t('deployer.network.destPortRequired') }]}
        >
          <InputNumber min={1} max={65535} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label={t('deployer.network.name')}
          name='name'
          rules={[{ required: true, message: t('deployer.network.nameRequired') }]}
        >
          <Input placeholder={t('deployer.network.nameRequired')} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default PortRuleDrawer;
