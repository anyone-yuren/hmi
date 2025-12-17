import { Checkbox, Form, Popover } from 'antd';
import { IconifyIcon } from 'ui';

const ControlView = () => {
  const content = (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-1 flex-col'>
        <span>全局</span>
        <Form>
          <Form.Item label='网格显示' name='gridVisible'>
            <Checkbox />
          </Form.Item>
        </Form>
      </div>
      <div className='flex gap-1 flex-col'>
        <span>元素</span>
        <Form>
          <Form.Item label='点显示' name='pointsVisible'>
            <Checkbox.Group
              options={[
                { label: '所有点', value: 'allPoints' },
                { label: '普通点', value: 'point' },
                { label: '库位点', value: 'libraryPoint' },
                { label: '选中点', value: 'selectedPoint' },
                { label: '暂停点', value: 'pausePoint' },
                { label: '视觉检测点', value: 'visionPoint' },
              ]}
            />
          </Form.Item>
          <Form.Item label='线显示' name='linesVisible'>
            <Checkbox.Group
              options={[
                { label: '所有线', value: 'allLines' },
                { label: '直线', value: 'line' },
                { label: 'B样条', value: 'bspline' },
                { label: '贝塞尔曲线', value: 'bezierCurve' },
                { label: '贝塞尔圆弧', value: 'bezierArc' },
              ]}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
  return (
    <Popover
      content={content}
      title={null}
      trigger='click'
      classNames={{
        root: 'bg-black text-white',
        body: '!bg-black text-white',
      }}
    >
      <div className='flex gap-0.5 items-center cursor-pointer'>
        <IconifyIcon icon='material-symbols:grid-view-rounded' size={16} />
        <span>视图显示</span>
      </div>
    </Popover>
  );
};
export default ControlView;
