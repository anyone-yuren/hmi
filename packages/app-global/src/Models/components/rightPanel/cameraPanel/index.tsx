import { SearchOutlined } from '@ant-design/icons';
import { Affix, Button, Checkbox, Collapse, Form, Input, InputNumber, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import PanelLoading from '../../../../components/PanelLoading';
import { useDebouncedStoreSetter } from '../../../hooks/useDebouncedStoreSetter';
import { useModelStore } from '../../../store';
const CameraPanel = () => {
  // 防抖函数
  const {
    cameraPosition,
    cameraClip,
    cameraPitch,
    cameraYaw,
    cameraRoll,
    setCameraPosition,
    setCameraClip,
    setCameraPitch,
    setCameraYaw,
    setCameraRoll,
    enableClip,
    setEnableClip,
  } = useModelStore(
    useShallow((state) => {
      return {
        cameraPosition: state.cameraPosition || { x: 0, y: 0, z: 0 },
        cameraClip: state.cameraClip || { near: 0.1, far: 1000 },
        cameraPitch: state.cameraPitch || 0,
        cameraYaw: state.cameraYaw || 0,
        cameraRoll: state.cameraRoll || 0,
        setCameraPosition: state.setCameraPosition,
        setCameraClip: state.setCameraClip,
        setCameraPitch: state.setCameraPitch,
        setCameraYaw: state.setCameraYaw,
        setCameraRoll: state.setCameraRoll,
        enableClip: state.enableClip,
        setEnableClip: state.setEnableClip,
      };
    }),
  );
  const setPitchDebounced = useDebouncedStoreSetter(setCameraPitch, 300);
  const setYawDebounced = useDebouncedStoreSetter(setCameraYaw, 300);
  const setRollDebounced = useDebouncedStoreSetter(setCameraRoll, 300);
  const setPositionDebounced = useDebouncedStoreSetter(setCameraPosition, 300);
  const setClipDebounced = useDebouncedStoreSetter(setCameraClip, 300);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      x: cameraPosition?.x,
      y: cameraPosition?.y,
      z: cameraPosition?.z,
      pitch: cameraPitch,
      yaw: cameraYaw,
      roll: cameraRoll,
      near: cameraClip?.near,
      far: cameraClip?.far,
      enableClip: enableClip,
    });
  }, [cameraPosition, cameraPitch, cameraYaw, cameraRoll, cameraClip, enableClip]);
  const items = [
    {
      key: '1',
      label: '通用属性',
      children: (
        <>
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
        </>
      ),
    },
    {
      key: '2',
      label: '网络',
      children: (
        <>
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
        </>
      ),
    },
    {
      key: '4',
      label: '关联',
      children: (
        <>
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
          <Form.Item
            label={'任务场景'}
            name='deviceId'
            rules={[{ required: true, message: 'Please input your deviceId!' }]}
          >
            <Checkbox.Group
              className='flex-col gap-2'
              options={[
                { label: '堆叠取货挪车', value: 'pickupMove' },
                { label: '堆叠放货挪车', value: 'putdownMove' },
                { label: '平板飞翼卡车取货挪车', value: 'truckPickupMove' },
                { label: '平板飞翼卡车放货挪车', value: 'truckPutdownMove' },
              ]}
            />
          </Form.Item>
        </>
      ),
    },
    {
      key: '3',
      label: '裁剪',
      children: (
        <>
          <Form.Item label='前探测距离' name='near' rules={[{ required: true, message: 'Please input your near!' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item
            label='后探测距离'
            name='far'
            rules={[{ required: true, message: 'Please input your backDistance!' }]}
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
          <Form.Item name='enableClip' valuePropName='checked' label={null}>
            <Checkbox>是否裁剪</Checkbox>
          </Form.Item>
        </>
      ),
    },

    {
      key: '5',
      label: '位置位姿',
      children: (
        <>
          <Form.Item label='X' name='x' rules={[{ required: true, message: 'Please input your x!' }]}>
            <InputNumber size='small' />
          </Form.Item>
          <Form.Item label='Y' name='y' rules={[{ required: true, message: 'Please input your y!' }]}>
            <InputNumber size='small' />
          </Form.Item>
          <Form.Item label='Z' name='z' rules={[{ required: true, message: 'Please input your z!' }]}>
            <InputNumber size='small' />
          </Form.Item>
          <Form.Item label='横滚角' name='roll' rules={[{ required: true, message: 'Please input your roll!' }]}>
            <InputNumber size='small' />
          </Form.Item>
          <Form.Item label='俯仰角' name='pitch' rules={[{ required: true, message: 'Please input your pitch!' }]}>
            <InputNumber size='small' />
          </Form.Item>
          <Form.Item label='偏航角' name='yaw' rules={[{ required: true, message: 'Please input your yaw!' }]}>
            <InputNumber size='small' />
          </Form.Item>
        </>
      ),
    },
    {
      key: '6',
      label: '标定',
      children: (
        <div className='flex flex-col gap-2'>
          <Form.Item
            label='标定板位置'
            name='calibrationBoardPosition'
            rules={[{ required: true, message: 'Please input your x!' }]}
          >
            <Select
              size='small'
              options={[
                { label: '车辆前方', value: 'front' },
                { label: '车辆后方', value: 'back' },
                { label: '车辆左侧', value: 'left' },
                { label: '车辆右侧', value: 'right' },
                { label: '车辆顶部', value: 'top' },
                { label: '车辆底部', value: 'bottom' },
              ]}
            />
          </Form.Item>
          <Form.Item name='remember' valuePropName='checked' label={null}>
            <Checkbox>开启实时点云</Checkbox>
          </Form.Item>
          <Table
            loading={loading}
            size='small'
            columns={[
              { title: '名称', dataIndex: 'name', key: 'name' },
              { title: '位姿', dataIndex: 'pose', key: 'pose' },
              { title: '参数值', dataIndex: 'value', key: 'value' },
              { title: '误差', dataIndex: 'error', key: 'error' },
            ]}
            dataSource={[
              { name: 'X坐标(mm)', pose: '0.0', value: '0.0', error: '0.0' },
              { name: 'Y坐标(mm)', pose: '0.0', value: '0.0', error: '0.0' },
              { name: 'Z坐标(mm)', pose: '0.0', value: '0.0', error: '0.0' },
              { name: '横滚角', pose: '0.0', value: '0.0', error: '0.0' },
              { name: '俯仰角', pose: '0.0', value: '0.0', error: '0.0' },
              { name: '偏航角', pose: '0.0', value: '0.0', error: '0.0' },
            ]}
            pagination={false}
          />
          <div className='relative bg-neutral-800 text-white p-2 rounded-sm'>
            <p>日志打印：</p>
            <div className='flex flex-col items-center justify-center'>
              <SvgIcon size={120} name={'noLog'} />
              <p>暂无日志打印</p>
            </div>
            {loading && <PanelLoading isDark={true} />}
          </div>
          <div className='flex gap-2 justify-end'>
            <Button type='primary' size='small' onClick={() => setLoading(true)}>
              标定
            </Button>
            <Button variant='solid' color='danger' size='small' onClick={() => setLoading(false)}>
              停止
            </Button>
            <Button variant='solid' color='default' size='small'>
              保存
            </Button>
            <Button variant='solid' color='gold' size='small'>
              刷新
            </Button>
          </div>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className='flex-1 bg-white/5 rounded-sm flex flex-col gap-2 p-2 overflow-auto' ref={setContainer}>
        {/* 属性搜索框 */}
        <Affix target={() => container} offsetTop={0}>
          <div className='flex items-center justify-center bg-neutral-800 rounded-sm p-1'>
            <Input size='small' placeholder='' className='w-1/2' prefix={<SearchOutlined />} />
          </div>
        </Affix>
        <div>
          <Form
            form={form}
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            autoComplete='off'
            onValuesChange={(changed, all) => {
              if ('x' in changed || 'y' in changed || 'z' in changed) {
                setPositionDebounced({
                  x: Number(all.x),
                  y: Number(all.y),
                  z: Number(all.z),
                });
              }

              if ('pitch' in changed) setPitchDebounced(Number(all.pitch));
              if ('yaw' in changed) setYawDebounced(Number(all.yaw));
              if ('roll' in changed) setRollDebounced(Number(all.roll));
              if ('near' in changed) setClipDebounced({ near: Number(all.near), far: Number(all.far) });
              if ('far' in changed) setClipDebounced({ far: Number(all.far), near: Number(all.near) });
              if ('enableClip' in changed) setEnableClip(Boolean(all.enableClip));
            }}
          >
            <Collapse items={items} defaultActiveKey={['1', '2', '5', '6']} />
          </Form>
        </div>
      </div>
    </>
  );
};
export default CameraPanel;
