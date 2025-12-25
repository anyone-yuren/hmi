import { SearchOutlined } from '@ant-design/icons';
import { Affix, Button, Checkbox, Collapse, Form, Input, Select, Table } from 'antd';
import { useState } from 'react';
import { SvgIcon } from 'ui';
import PanelLoading from '../../../../components/PanelLoading';

const CameraPanel = () => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
    {
      key: '6',
      label: '标定',
      children: (
        <div className='flex flex-col gap-2'>
          <Form
            name='basic'
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            autoComplete='off'
          >
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
          </Form>
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
          <Collapse items={items} defaultActiveKey={['1', '2', '3', '4', '5']} />
        </div>
      </div>
    </>
  );
};
export default CameraPanel;
