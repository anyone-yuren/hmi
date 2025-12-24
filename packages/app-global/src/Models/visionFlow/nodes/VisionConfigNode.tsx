import { Handle, Position } from '@xyflow/react';
import { Checkbox, Collapse, Form, Input, InputNumber } from 'antd';
import { useVisionFlowStore } from '../store/visionFlowStore';

export default function VisionConfigNode() {
  const enabled = useVisionFlowStore((s) => s.enabled);
  const setEnabled = useVisionFlowStore((s) => s.setEnabled);
  const setShowPickupMove = useVisionFlowStore((s) => s.setShowPickupMove);
  const showPickupMove = useVisionFlowStore((s) => s.showPickupMove);
  const [form] = Form.useForm();
  return (
    <div className='w-64 p-2 bg-white/20 border rounded'>
      <div className='font-bold mb-2'>视觉配置</div>
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
            <Form.Item name='enabled' label='开启视觉取货'>
              <Checkbox checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
            </Form.Item>
            <Form.Item name='debugMode' label='开启调试模式'>
              <Checkbox />
            </Form.Item>
            <Form.Item name='confidenceThreshold' label='置信度'>
              <InputNumber min={0} max={1} step={0.1} className='w-full' />
            </Form.Item>
            <Form.Item name='detectionThreshold' label='检测次数'>
              <InputNumber min={0} max={100} step={1} className='w-full' />
            </Form.Item>
            <Form.Item name='blindGuideDistance' label='盲导距离'>
              <InputNumber min={0} max={1} step={0.1} className='w-full' />
            </Form.Item>
            <Form.Item name='autoTune' label='自动调参'>
              <Checkbox />
            </Form.Item>
          </Collapse.Panel>
          <Collapse.Panel header='通用场景' key='2'>
            <div className='flex items-center justify-between p-2 bg-white/10 rounded mb-2'>
              <span>取货挪车</span>
              <Checkbox checked={showPickupMove} onChange={(e) => setShowPickupMove(e.target.checked)} />
            </div>
            <Collapse defaultActiveKey={['task', 'tray']}>
              <Collapse.Panel header='任务' key='task'>
                <Form.Item name='single' label='单箱取货参数'>
                  <Input placeholder='请输入单箱取货参数' />
                </Form.Item>
              </Collapse.Panel>
              <Collapse.Panel header='托盘取货' key='tray'>
                <Form.Item name='tray' label='托盘取货参数'>
                  <Input placeholder='请输入托盘取货参数' />
                </Form.Item>
              </Collapse.Panel>
            </Collapse>
          </Collapse.Panel>
        </Collapse>
      </Form>
      <Handle type='source' position={Position.Right} />
    </div>
  );
}
