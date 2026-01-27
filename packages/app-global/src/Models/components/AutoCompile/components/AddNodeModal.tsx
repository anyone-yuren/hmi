import { Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useAutoCompileStore } from '../store';

const AddNodeModal = () => {
  const visible = useAutoCompileStore((state) => state.addNodeModalVisible);
  const setVisible = useAutoCompileStore(
    (state) => state.setAddNodeModalVisible
  );
  const addNewNode = useAutoCompileStore((state) => state.addNewNode);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      addNewNode(values.layerId, values.name, values.dataSource);
      setVisible(false);
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      title='添加新节点'
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Form form={form} layout='horizontal'>
        <Form.Item
          name='layerId'
          label='所属层级'
          rules={[{ required: true, message: '请选择层级' }]}
        >
          <Select
            options={[
              { label: '依赖库', value: 'dependency' },
              { label: '基础层', value: 'base' },
              { label: '应用层', value: 'application' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name='name'
          label='节点名称'
          rules={[{ required: true, message: '请输入节点名称' }]}
        >
          <Input placeholder='例如: mwrobot_new_module' />
        </Form.Item>
        <Form.Item
          name='dataSource'
          label='数据来源'
          rules={[{ required: true, message: '请输入数据来源' }]}
        >
          <Input placeholder='请输入数据来源' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNodeModal;
