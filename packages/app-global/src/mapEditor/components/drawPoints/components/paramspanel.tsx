import { Checkbox, Collapse, ColorPicker, Form, Input, Select } from 'antd';
import { useState } from 'react';

const DrawPointsParamsPanel = () => {
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
          <Form.Item label='模板名称' name='templateName' rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='模板颜色' name='templateColor' rules={[{ required: true, message: '请输入模板颜色' }]}>
            <ColorPicker defaultValue='#001d1d' size='small' showText className='w-full' />
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
      <div className='flex-1 bg-white/5 rounded-sm flex flex-col gap-2 p-2 overflow-auto' ref={setContainer}>
        <div>
          <Collapse items={items} defaultActiveKey={['1', '2', '3']} />
        </div>
      </div>
    </>
  );
};
export default DrawPointsParamsPanel;
