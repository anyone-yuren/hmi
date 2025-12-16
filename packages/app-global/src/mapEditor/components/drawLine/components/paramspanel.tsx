import { Checkbox, Collapse, Form, Input, Select } from 'antd';
import { useState } from 'react';

const DrawLinesParamsPanel = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const items = [
    {
      key: '1',
      label: '通用属性',
      children: (
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item label='控制点' name='templateName' rules={[{ required: true, message: '请输入模板名称' }]}>
            {new Array(5).fill(0).map((_, index) => (
              <div key={index} className='flex gap-2'>
                <Form.Item
                  name={['controlPoints', index, 'x']}
                  noStyle
                  rules={[{ required: true, message: '请输入 X！' }]}
                >
                  <Input size='small' placeholder='X' />
                </Form.Item>

                <Form.Item
                  name={['controlPoints', index, 'y']}
                  noStyle
                  rules={[{ required: true, message: '请输入 Y！' }]}
                >
                  <Input size='small' placeholder='Y' />
                </Form.Item>
              </div>
            ))}
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
          {/* <Form.Item name='disableCall' valuePropName='checked' label={'禁止呼叫'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='allowDock' valuePropName='checked' label={'允许停靠'}>
            <Checkbox></Checkbox>
          </Form.Item> */}
          <Form.Item label='线路编号' name='lineId' rules={[{ required: true, message: '请输入线路编号' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='起始点' name='startPoint' rules={[{ required: true, message: '请输入起始点' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='终止点' name='endPoint' rules={[{ required: true, message: '请输入终止点' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='进入角度' name='enterAngle' rules={[{ required: true, message: '请输入进入角度' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='离开角度' name='leaveAngle' rules={[{ required: true, message: '请输入离开角度' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='速度比例' name='speedRatio' rules={[{ required: true, message: '请输入速度比例' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='速度' name='speed' rules={[{ required: true, message: '请输入速度' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='线路长度' name='lineLength' rules={[{ required: true, message: '请输入线路长度' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='起始比例' name='startRatio' rules={[{ required: true, message: '请输入起始比例' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='终止比例' name='endRatio' rules={[{ required: true, message: '请输入终止比例' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='方向' name='direction' rules={[{ required: true, message: '请选择方向' }]}>
            <Select
              size='small'
              options={[
                { label: '顺时针', value: 'clockwise' },
                { label: '逆时针', value: 'counterclockwise' },
                { label: '优弧', value: 'optimalArc' },
              ]}
            />
          </Form.Item>
          <Form.Item label='航向角' name='headingAngle' rules={[{ required: true, message: '请输入航向角' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='附加权重' name='additionalWeight' rules={[{ required: true, message: '请输入附加权重' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item name='flexiblePath' valuePropName='checked' label={'柔性路径'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='autoOnline' valuePropName='checked' label={'自动上线'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='virtualFloorLine' valuePropName='checked' label={'楼层虚拟线'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item
            label='左侧绕障距离'
            name='leftObstacleDistance'
            rules={[{ required: true, message: '请输入左侧绕障距离' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='右侧绕障距离'
            name='rightObstacleDistance'
            rules={[{ required: true, message: '请输入右侧绕障距离' }]}
          >
            <Input size='small' />
          </Form.Item>
          <Form.Item label='逻辑值1' name='logicalValue1' rules={[{ required: true, message: '请输入逻辑值1' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='逻辑值2' name='logicalValue2' rules={[{ required: true, message: '请输入逻辑值2' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='逻辑值3' name='logicalValue3' rules={[{ required: true, message: '请输入逻辑值3' }]}>
            <Input size='small' />
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
          <Form.Item name='keepAmrDirection' valuePropName='checked' label={'保持AMR方向'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='shrinkObstacleAvoidanceRange' valuePropName='checked' label={'缩小避障范围'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='outboundLineGuidance' valuePropName='checked' label={'出库线盲导'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='enableHeadingAngle' valuePropName='checked' label={'启用航向角'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='enableVisualLineDetection' valuePropName='checked' label={'视觉检测线'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='allowUturn' valuePropName='checked' label={'允许掉头'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='disableObstacleAvoidance' valuePropName='checked' label={'关闭后避障'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='disableObstacleAvoidanceBefore' valuePropName='checked' label={'关闭前避障'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='disableCrossArmTakeoffLand' valuePropName='checked' label={'禁止叉臂起降'}>
            <Checkbox></Checkbox>
          </Form.Item>
          <Form.Item name='continuousIssueRoute' valuePropName='checked' label={'连续下发路线'}>
            <Checkbox></Checkbox>
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
export default DrawLinesParamsPanel;
