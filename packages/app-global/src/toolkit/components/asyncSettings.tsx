import { Checkbox, Form, Modal, Radio } from 'antd';
import { useEffect, useState } from 'react';

const AsyncSettings = ({ open, onCancel, onOk }: { open: boolean; onCancel?: () => void; onOk?: () => void }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(open);
  // 监听 syncTo 的值（1=分组，2=车辆）
  const syncTo = Form.useWatch('syncTo', form);
  useEffect(() => {
    setVisible(open);
  }, [open]);
  const handleOk = () => {
    if (onOk) {
      onOk();
    }
    setVisible(false);
  };
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setVisible(false);
  };
  return (
    <Modal title='同步数据' open={visible} onCancel={handleCancel} onOk={handleOk}>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout='horizontal'
        initialValues={{ size: 'default' }}
        form={form}
      >
        <Form.Item label='同步至' name='syncTo'>
          <Radio.Group>
            <Radio value={1}>分组</Radio>
            <Radio value={2}>车辆</Radio>
          </Radio.Group>
        </Form.Item>
        {syncTo === 1 && (
          <Form.Item label='分组' name='group'>
            {/* 你自己的分组组件 / Select */}
            <Checkbox.Group>
              <Checkbox value='group1'>分组1</Checkbox>
              <Checkbox value='group2'>分组2</Checkbox>
              <Checkbox value='group3'>分组3</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        )}

        {syncTo === 2 && (
          <Form.Item label='车辆' name='vehicle'>
            {/* 你自己的车辆组件 / Select */}
            <Checkbox.Group>
              <Checkbox value='vehicle1'>车辆1</Checkbox>
              <Checkbox value='vehicle2'>车辆2</Checkbox>
              <Checkbox value='vehicle3'>车辆3</Checkbox>
            </Checkbox.Group>
          </Form.Item>
        )}
        <Form.Item label='配置' name='config'>
          {/* 你自己的配置组件 / Select */}
          <Checkbox.Group>
            <Checkbox value='config1'>程序</Checkbox>
            <Checkbox value='config2'>库</Checkbox>
            <Checkbox value='config3'>配置</Checkbox>
            <Checkbox value='config4'>定位数据</Checkbox>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default AsyncSettings;
