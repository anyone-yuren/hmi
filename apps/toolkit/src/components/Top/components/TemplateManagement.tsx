import { Checkbox, Collapse, ColorPicker, Form, Input, Modal, Select, Tooltip } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { IconifyIcon } from 'ui';
const TemplateManagement = ({ onClick, open }: { onClick?: () => void; open: boolean }) => {
  const [visible, setVisible] = useState(open);
  useEffect(() => {
    setVisible(open);
  }, [open]);
  const items = [
    {
      key: '1',
      label: '路径点',
      children: (
        <>
          <ul className='flex flex-col gap-2 text-xs py-2'>
            {new Array(4)
              .fill(0)
              .map((_, index) => ({
                label: `路径点${index + 1}`,
                key: `pathPoint${index + 1}`,
                isSelected: index % 2 === 0,
              }))
              .map((item, index) => {
                return (
                  <li
                    className={classNames(
                      'cursor-pointer hover:bg-cyan-500/30 px-2 py-0.5 flex items-center justify-between transition-all duration-300',
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
                      <Tooltip title='关闭/激活'>
                        <IconifyIcon icon={'ic:round-close'} size={14} />
                      </Tooltip>
                    </span>
                  </li>
                );
              })}
          </ul>
        </>
      ),
    },
    {
      key: '2',
      label: '路径线',
      children: (
        <>
          <ul className='flex flex-col gap-2 text-xs py-2'>
            {new Array(24)
              .fill(0)
              .map((_, index) => ({
                label: `路径线${index + 1}`,
                key: `pathLine${index + 1}`,
                isSelected: index % 2 === 0,
              }))
              .map((item, index) => {
                return (
                  <li
                    className={classNames(
                      'cursor-pointer hover:bg-cyan-500/30 px-2 py-0.5 flex items-center justify-between transition-all duration-300',
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
                      <Tooltip title='关闭/激活'>
                        <IconifyIcon icon={'ic:round-close'} size={14} />
                      </Tooltip>
                    </span>
                  </li>
                );
              })}
          </ul>
        </>
      ),
    },
  ];
  const items1 = [
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
          <Form.Item label='模板名称' name='templateName' rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='模板颜色' name='templateColor' rules={[{ required: true, message: '请输入模板颜色' }]}>
            <ColorPicker defaultValue='#00d1d1' size='small' showText className='w-full' />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: '高级属性',
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item name='disableCall' valuePropName='checked' label={'禁止呼叫'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='allowDock' valuePropName='checked' label={'允许停靠'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item label='点类型' name='pointType' rules={[{ required: true, message: '请输入点类型' }]}>
            <Select
              size='small'
              options={[
                { label: '端点', value: 'endpoint' },
                { label: '平库', value: 'plank' },
                { label: '立库', value: 'stand' },
              ]}
            />
          </Form.Item>
          <Form.Item label='自旋优先级' name='spinPriority' rules={[{ required: true, message: '请选择自旋优先级' }]}>
            <Select
              size='small'
              options={[
                { label: '顺时针', value: 'clockwise' },
                { label: '逆时针', value: 'counterclockwise' },
                { label: '优弧', value: 'optimalArc' },
              ]}
            />
          </Form.Item>
          <Form.Item label='动作类型' name='actionType' rules={[{ required: true, message: '请选择动作类型' }]}>
            <Select
              size='small'
              options={[
                { label: '顺时针', value: 'clockwise' },
                { label: '逆时针', value: 'counterclockwise' },
                { label: '优弧', value: 'optimalArc' },
              ]}
            />
          </Form.Item>
          <Form.Item label='楼层号' name='floorId' rules={[{ required: true, message: '请输入楼层号' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='分组号' name='groupId' rules={[{ required: true, message: '请输入分组号' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='避障方案'
            name='obstacleAvoidanceScheme'
            rules={[{ required: true, message: '请选择避障方案' }]}
          >
            <Select
              size='small'
              options={[
                { label: '顺时针', value: 'clockwise' },
                { label: '逆时针', value: 'counterclockwise' },
                { label: '优弧', value: 'optimalArc' },
              ]}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '3',
      label: '额外属性',
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item label='逻辑值1' name='logicalValue1' rules={[{ required: true, message: '请输入逻辑值1' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='逻辑值2' name='logicalValue2' rules={[{ required: true, message: '请输入逻辑值2' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='逻辑值3' name='logicalValue3' rules={[{ required: true, message: '请输入逻辑值3' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='逻辑值4' name='logicalValue4' rules={[{ required: true, message: '请输入逻辑值4' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item name='remember' valuePropName='checked' label={null}>
            <Checkbox className='text-xs'>禁止＞120°自旋</Checkbox>
          </Form.Item>
          <Form.Item name='disableTurnAround' valuePropName='checked' label={null}>
            <Checkbox>禁止掉头</Checkbox>
          </Form.Item>
        </Form>
      ),
    },
  ];
  return (
    <>
      <Modal
        title='模板管理'
        open={visible}
        onCancel={() => {
          setVisible(false);
          onClick?.();
        }}
        onOk={() => {
          setVisible(false);
          onClick?.();
        }}
        width={'60%'}
        classNames={{
          content: '!p-2',
        }}
        okButtonProps={{
          size: 'small',
        }}
        cancelButtonProps={{
          size: 'small',
        }}
      >
        <div className='flex items-stretch h-full gap-2 max-h-[50vh]'>
          <div className='w-1/3 bg-white/5 cursor-pointer p-2 overflow-auto max-h-[50vh]'>
            <Collapse items={items} defaultActiveKey={['1', '2']} />
          </div>
          <div className='w-2/3 bg-white/5 p-2 cursor-pointer overflow-auto flex flex-col gap-2'>
            <p className='flex items-center justify-end gap-2'>
              {/* 复制 */}
              <IconifyIcon icon='icon-park-outline:copy' size={14} />
              {/* 删除 */}
              <IconifyIcon icon='ic:round-close' size={16} />
            </p>
            <Collapse items={items1} defaultActiveKey={['1', '2', '3']} />
          </div>
        </div>
      </Modal>
    </>
  );
};
export default TemplateManagement;
