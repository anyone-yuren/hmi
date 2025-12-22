import { Checkbox, Form, Popover } from 'antd';
import { useEffect } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorViewStore } from '../../store/view';

const ControlView = () => {
  const [form] = Form.useForm();
  const { setPointsView, setLinesView, setDevicesView, pointsView, linesView, devicesView } = useMapEditorViewStore(
    useShallow((state) => ({
      setPointsView: state.setPointsView,
      setLinesView: state.setLinesView,
      setDevicesView: state.setDevicesView,
      pointsView: state.pointsView,
      linesView: state.linesView,
      devicesView: state.devicesView,
    })),
  );
  // 监听form变化
  Form.useWatch((values) => {
    setPointsView(values.pointsVisible);
    setLinesView(values.linesVisible);
    setDevicesView(values.devicesVisible);
  }, form);
  // 使用 useEffect 来同步 form 的值到全局状态
  useEffect(() => {
    // 仅当值发生变化时，才设置 form 的值，避免死循环
    if (pointsView !== form.getFieldValue('pointsVisible')) {
      form.setFieldsValue({ pointsVisible: pointsView });
    }
    if (linesView !== form.getFieldValue('linesVisible')) {
      form.setFieldsValue({ linesVisible: linesView });
    }
    if (devicesView !== form.getFieldValue('devicesVisible')) {
      form.setFieldsValue({ devicesVisible: devicesView });
    }
  }, [pointsView, linesView, devicesView, form]);

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
        <Form form={form}>
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
          <Form.Item label='设备显示' name='devicesVisible'>
            <Checkbox.Group
              options={[
                { label: '所有设备', value: 'allDevices' },
                { label: '电梯', value: 'elevator' },
                { label: '自动门', value: 'autoDoor' },
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
