import { Button, DatePicker, Divider, Form, Radio, Select, Slider } from 'antd';
import { useState } from 'react';
import { IconifyIcon } from 'ui';
const { RangePicker } = DatePicker;

const DiagnosisPanel = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [form] = Form.useForm();
  const diagnosisType = Form.useWatch('diagnosisType', form);
  return (
    <>
      <div className='bg-white/5 rounded-sm p-2'>
        <p className='text-xs font-medium flex items-center gap-1'>
          <IconifyIcon icon='material-symbols:health-and-safety-outline' size={14} /> 视觉诊断
        </p>
      </div>
      <div className='bg-white/5 rounded-sm flex flex-col gap-2 p-2 overflow-auto'>
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          autoComplete='off'
          form={form}
        >
          <Form.Item name='diagnosisType' label='诊断类型'>
            <Radio.Group
              name='diagnosisType'
              options={[
                { label: '点', value: 'point' },
                { label: '时间段', value: 'timeRange' },
              ]}
            />
          </Form.Item>
          {diagnosisType === 'point' && (
            <Form.Item name='point' label='选择点'>
              <Select options={[{ label: '点1', value: 'point1' }]} className='min-w-24' size='small' />
            </Form.Item>
          )}
          {diagnosisType === 'timeRange' && (
            <Form.Item name='timeRange' label='选择时间段'>
              <RangePicker showTime />
            </Form.Item>
          )}
          <Form.Item>
            <div className='flex items-center gap-2 justify-end'>
              <Button type='primary' size='small'>
                开始诊断
              </Button>
              <Button variant='link' size='small' color='orange'>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
      <div className='flex-1 bg-white/5 rounded-sm flex flex-col gap-2 p-2 overflow-auto' ref={setContainer}>
        <div className='flex flex-col gap-2'>
          <Divider orientation='left' orientationMargin='0' className='text-xs !my-0'>
            雷达诊断参数
          </Divider>
          <Form
            name='basic'
            labelCol={{ span: 10, prefixCls: 'items-center' }}
            wrapperCol={{ span: 24 }}
            initialValues={{
              frontDistance: 0,
              backDistance: 10,
              leftDistance: 20,
              rightDistance: 90,
              obstacleDistance: 40,
            }}
            autoComplete='off'
            className='p-2 bg-black'
          >
            <Form.Item name='frontDistance' label='前探测距离'>
              <Slider tooltip={{ formatter: null }} />
            </Form.Item>
            <Form.Item name='backDistance' label='后探测距离'>
              <Slider tooltip={{ formatter: null }} />
            </Form.Item>
            <Form.Item name='leftDistance' label='左探测距离'>
              <Slider tooltip={{ formatter: null }} />
            </Form.Item>
            <Form.Item name='rightDistance' label='右探测距离'>
              <Slider tooltip={{ formatter: null }} />
            </Form.Item>
            <Form.Item name='obstacleDistance' label='上探测距离'>
              <Slider tooltip={{ formatter: null }} />
            </Form.Item>
            <Form.Item>
              <div className='flex items-center gap-2 justify-end'>
                <Button type='primary' size='small'>
                  参数写入
                </Button>
                <Button color='orange' size='small'>
                  重新执行
                </Button>
              </div>
            </Form.Item>
          </Form>
          <Divider orientation='left' orientationMargin='0' className='text-xs !my-0'>
            执行日志
          </Divider>
          <div className='bg-black/40 p-2 rounded-sm flex flex-col gap-1 overflow-auto max-h-[200px] text-xs opacity-80'>
            <p>参数写入成功 2025-01-01 12:00:00</p>
            <p>参数写入成功 2025-01-01 12:00:00</p>
            <p>参数写入成功 2025-01-01 12:00:00</p>
            <p>参数写入成功 2025-01-01 12:00:00</p>
          </div>
          <div className='flex items-center gap-2 justify-end'>
            <Button type='primary' size='small'>
              下一步
            </Button>
            <Button color='orange' variant='solid' size='small'>
              取消
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default DiagnosisPanel;
