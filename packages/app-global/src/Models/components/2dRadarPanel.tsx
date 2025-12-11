import { SearchOutlined } from '@ant-design/icons';
import { Affix, Checkbox, Collapse, Dropdown, Form, Input, Select, Tooltip } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import { IconifyIcon } from 'ui';

const Radar2dPanel = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const items = [
    {
      key: '1',
      label: '通用属性',
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item
            label='设备ID'
            name='deviceId'
            rules={[{ required: true, message: 'Please input your deviceId!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='设备类型'
            name='deviceType'
            rules={[{ required: true, message: 'Please input your deviceType!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='设备型号'
            name='deviceModel'
            rules={[{ required: true, message: 'Please input your deviceModel!' }]}
          >
            <Select size='small' options={[{ label: 'Livox mid 60', value: 'Livox mid 60' }]} />
          </Form.Item>
          <Form.Item
            label='设备中文名称'
            name='deviceName'
            rules={[{ required: true, message: 'Please input your deviceName!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='设备英文名称'
            name='deviceEnglishName'
            rules={[{ required: true, message: 'Please input your deviceEnglishName!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item name='remember' valuePropName='checked' label={null}>
            <Checkbox>是否启用</Checkbox>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: '网络',
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item
            label='IP地址'
            name='deviceId'
            rules={[{ required: true, message: 'Please input your deviceId!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='端口号'
            name='deviceType'
            rules={[{ required: true, message: 'Please input your deviceType!' }]}
          >
            <Input size='small' />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '3',
      label: '裁剪',
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item
            label='前探测距离'
            name='deviceId'
            rules={[{ required: true, message: 'Please input your deviceId!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='后探测距离'
            name='deviceType'
            rules={[{ required: true, message: 'Please input your deviceType!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='左探测距离'
            name='leftDistance'
            rules={[{ required: true, message: 'Please input your leftDistance!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='右探测距离'
            name='rightDistance'
            rules={[{ required: true, message: 'Please input your rightDistance!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='上探测距离'
            name='topDistance'
            rules={[{ required: true, message: 'Please input your topDistance!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='下探测距离'
            name='bottomDistance'
            rules={[{ required: true, message: 'Please input your bottomDistance!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='水平起始角度'
            name='horizontalStartAngle'
            rules={[{ required: true, message: 'Please input your horizontalStartAngle!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='水平结束角度'
            name='horizontalEndAngle'
            rules={[{ required: true, message: 'Please input your horizontalEndAngle!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='垂直起始角度'
            name='verticalStartAngle'
            rules={[{ required: true, message: 'Please input your verticalStartAngle!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='垂直结束角度'
            name='verticalEndAngle'
            rules={[{ required: true, message: 'Please input your verticalEndAngle!' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item name='remember' valuePropName='checked' label={null}>
            <Checkbox>是否裁剪</Checkbox>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '4',
      label: '关联',
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item
            label={'作用于'}
            name='deviceId'
            rules={[{ required: true, message: 'Please input your deviceId!' }]}
          >
            <Checkbox.Group
              className='flex-col gap-2'
              options={[
                { label: '定位', value: 'camera1' },
                { label: '安全', value: 'camera2' },
                { label: '感知', value: 'camera3' },
                { label: '活动', value: 'camera4' },
              ]}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '5',
      label: '位置位姿',
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item label='X' name='x' rules={[{ required: true, message: 'Please input your x!' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='Y' name='y' rules={[{ required: true, message: 'Please input your y!' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='Z' name='z' rules={[{ required: true, message: 'Please input your z!' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='横滚角' name='roll' rules={[{ required: true, message: 'Please input your roll!' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='俯仰角' name='pitch' rules={[{ required: true, message: 'Please input your pitch!' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='偏航角' name='yaw' rules={[{ required: true, message: 'Please input your yaw!' }]}>
            <Input size='small' />
          </Form.Item>
        </Form>
      ),
    },
  ];
  return (
    <>
      <div className='bg-white/5 rounded-sm p-2'>
        <p className='text-xs font-medium flex items-center gap-2 justify-between'>
          <span>
            <IconifyIcon icon='subway:folder-2' size={14} /> 相机集合
          </span>
          <IconifyIcon icon='material-symbols:check-box-rounded' size={14} />
        </p>
        <Dropdown
          menu={{
            items: [
              {
                label: (
                  <div className='flex items-center justify-between'>
                    复制
                    <span className='text-xs font-medium text-gray-400 flex items-center gap-1'>
                      <IconifyIcon icon='mingcute:command-line' size={12} />c
                    </span>
                  </div>
                ),
                key: 'copy',
              },
              { label: <span>删除</span>, key: 'delete' },
              { label: <span>选择</span>, key: 'add' },
            ],
          }}
          trigger={['contextMenu']}
        >
          <ul className='flex flex-col gap-2 text-xs py-2'>
            {new Array(4)
              .fill(0)
              .map((_, index) => ({
                label: `相机${index + 1}`,
                key: `camera${index + 1}`,
                isSelected: index % 2 === 0,
              }))
              .map((item, index) => {
                return (
                  <li
                    className={classNames(
                      'cursor-pointer hover:bg-cyan-500/30 px-2 py-0.5 flex items-center justify-between',
                      {
                        'bg-white/5': index % 2 === 0,
                        'text-gray-400': !item.isSelected,
                        'bg-[#00d1d1]/80 !text-black': index === 1,
                      },
                    )}
                    key={item.key}
                  >
                    {item.label}
                    <span className='flex items-center gap-1'>
                      <Tooltip title='显示/隐藏'>
                        <IconifyIcon icon='charm:eye' size={14} />
                      </Tooltip>
                      <Tooltip title='选中/取消选中'>
                        <IconifyIcon
                          icon={
                            item.isSelected
                              ? 'material-symbols:check-box-rounded'
                              : 'material-symbols:check-box-outline-sharp'
                          }
                          size={14}
                        />
                      </Tooltip>
                    </span>
                  </li>
                );
              })}
          </ul>
        </Dropdown>
      </div>
      <div className='flex-1 bg-white/5 rounded-sm flex flex-col gap-2 p-2 overflow-auto' ref={setContainer}>
        {/* 属性搜索框 */}
        <Affix target={() => container} offsetTop={0}>
          <div className='flex items-center justify-center bg-neutral-800 rounded-sm p-1'>
            <Input size='small' placeholder='' className='w-1/2' prefix={<SearchOutlined />} />
          </div>
        </Affix>
        <div>
          <Collapse items={items} defaultActiveKey={['1', '2', '3', '4', '5']} />
        </div>
      </div>
    </>
  );
};
export default Radar2dPanel;
