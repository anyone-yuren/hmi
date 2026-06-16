import { SearchOutlined } from '@ant-design/icons';
import { Affix, Checkbox, Collapse, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../store/editorStore';

const Radar2dPanel = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { selected } = useEditorStore(
    useShallow((store) => {
      return {
        selected: store.selected,
      };
    }),
  );

  const [form] = Form.useForm();

  useEffect(() => {
    if (!selected) return;
    form.setFieldsValue({
      id: selected.id,
      type: selected.type,
      name: selected.name,
      visible: selected.visible,
      x: selected?.position?.x,
      y: selected?.position?.y,
      z: selected?.position?.z,
      roll: selected?.rotation?.x,
      pitch: selected?.rotation?.y,
      yaw: selected?.rotation?.z,
    });
  }, [selected]);

  const items = [
    {
      key: '1',
      label: '通用属性',
      children: (
        <>
          <Form.Item label='设备ID' name='id' rules={[{ required: true, message: 'Please input your deviceId!' }]}>
            <Input size='small' />
          </Form.Item>

          <Form.Item
            label='设备类型'
            name='deviceType'
            rules={[{ required: true, message: 'Please input your deviceType!' }]}
          >
            <Input size='small' />
          </Form.Item>

          <Form.Item label='设备型号' name='type' rules={[{ required: true }]}>
            <Select size='small' options={[{ label: 'Livox mid 60', value: 'Livox mid 60' }]} />
          </Form.Item>

          <Form.Item label='设备中文名称' name='name' rules={[{ required: true }]}>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='设备英文名称' name='deviceEnglishName' rules={[{ required: true }]}>
            <Input size='small' />
          </Form.Item>

          <Form.Item name='visible' valuePropName='checked'>
            <Checkbox>是否启用</Checkbox>
          </Form.Item>
        </>
      ),
    },

    {
      key: '2',
      label: '网络',
      children: (
        <>
          <Form.Item label='IP地址' name='ip' rules={[{ required: true }]}>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='端口号' name='port' rules={[{ required: true }]}>
            <Input size='small' />
          </Form.Item>
        </>
      ),
    },
    {
      key: '5',
      label: '位置位姿',
      children: (
        <>
          <Form.Item label='X' name='x'>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='Y' name='y'>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='Z' name='z'>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='横滚角' name='roll'>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='俯仰角' name='pitch'>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='偏航角' name='yaw'>
            <Input size='small' />
          </Form.Item>
        </>
      ),
    },

    {
      key: '3',
      label: '裁剪',
      children: (
        <>
          <Form.Item label='前探测距离' name='frontDistance'>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='后探测距离' name='backDistance'>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='左探测距离' name='leftDistance'>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='右探测距离' name='rightDistance'>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='上探测距离' name='topDistance'>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='下探测距离' name='bottomDistance'>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='水平起始角度' name='horizontalStartAngle'>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='水平结束角度' name='horizontalEndAngle'>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='垂直起始角度' name='verticalStartAngle'>
            <Input size='small' />
          </Form.Item>

          <Form.Item label='垂直结束角度' name='verticalEndAngle'>
            <Input size='small' />
          </Form.Item>

          <Form.Item name='clipEnabled' valuePropName='checked'>
            <Checkbox>是否裁剪</Checkbox>
          </Form.Item>
        </>
      ),
    },

    {
      key: '4',
      label: '关联',
      children: (
        <Form.Item label='作用于' name='bindTargets'>
          <Checkbox.Group
            className='flex-col gap-2'
            options={[
              { label: '定位', value: 'location' },
              { label: '安全', value: 'safety' },
              { label: '感知', value: 'perception' },
              { label: '活动', value: 'activity' },
            ]}
          />
        </Form.Item>
      ),
    },
  ];

  return (
    <div className='flex-1 bg-white/5 rounded-sm flex flex-col gap-2 p-2 overflow-auto' ref={setContainer}>
      {/* 搜索 */}
      <Affix target={() => container} offsetTop={0}>
        <div className='flex items-center justify-center bg-neutral-800 rounded-sm p-1'>
          <Input size='small' className='w-1/2' prefix={<SearchOutlined />} />
        </div>
      </Affix>

      {/* ✅ 单一 Form */}
      <Form form={form} labelCol={{ span: 12 }} wrapperCol={{ span: 24 }} layout='horizontal'>
        <Collapse items={items} defaultActiveKey={items.map((i) => i.key)} />
      </Form>
    </div>
  );
};

export default Radar2dPanel;
