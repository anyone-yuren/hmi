import { Handle, Position } from '@xyflow/react';
import { Checkbox, Collapse, Form, Input, InputNumber } from 'antd';

export default function VisionScenePickupMoveNode() {
  const [form] = Form.useForm();
  return (
    <div className='w-68 p-2 bg-white/20 border rounded'>
      <div className='font-semibold mb-2'>放货物挪车场景</div>

      <Form
        form={form}
        layout='horizontal'
        size='small'
        labelCol={{ span: 12 }}
        wrapperCol={{ span: 14 }}
        autoComplete='off'
      >
        <Collapse defaultActiveKey={['1', '2', '3', '4', '5']}>
          {/* ---------------- 通用属性 ---------------- */}
          <Collapse.Panel header='通用参数' key='1'>
            <Form.Item name='visionModelList' label='视觉取货模型列表'>
              <Input placeholder='请输入视觉取货模型列表' />
            </Form.Item>
            <Form.Item name='targetSegmentationMode' label='目标分割模式'>
              <InputNumber min={0} max={1} step={0.1} className='w-full' />
            </Form.Item>
            <Form.Item name='roi' label='识别ROI'>
              <InputNumber min={0} max={100} step={1} className='w-full' />
            </Form.Item>
            <Form.Item name='boundSensorName' label='绑定传感器名称'>
              <Input placeholder='请输入绑定传感器名称' />
            </Form.Item>
            <Form.Item name='enablePickupMove' label='是否开启放货挪车'>
              <Checkbox />
            </Form.Item>
          </Collapse.Panel>
          <Collapse.Panel header='通用场景' key='2'>
            <Collapse defaultActiveKey={['task', 'tray']}>
              <Collapse.Panel header='平板飞翼卡车' key='task'>
                <Form.Item name='pickupHeight' label='放货高度识别'>
                  <Checkbox />
                </Form.Item>
                <Form.Item name='pickupHeight' label='最大偏移距离'>
                  <Input placeholder='请输入最大偏移距离' />
                </Form.Item>
                <Form.Item name='boundSensorName' label='绑定传感器名称'>
                  <Input placeholder='请输入绑定传感器名称' />
                </Form.Item>
                <Form.Item name='enablePickupMove' label='是否开启放货挪车'>
                  <Checkbox />
                </Form.Item>
              </Collapse.Panel>
              <Collapse.Panel header='堆叠' key='tray'>
                <Form.Item name='tray' label='托盘取货参数'>
                  <Input placeholder='请输入托盘取货参数' />
                </Form.Item>
                <Form.Item name='enablePickupMove' label='是否开启放货挪车'>
                  <Checkbox />
                </Form.Item>
              </Collapse.Panel>
            </Collapse>
          </Collapse.Panel>
        </Collapse>
      </Form>

      <Handle type='target' position={Position.Left} />
    </div>
  );
}
