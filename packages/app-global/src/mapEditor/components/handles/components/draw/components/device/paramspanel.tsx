import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Collapse, Dropdown, Form, Input, Select, Table, Tooltip } from 'antd';
import classNames from 'classnames';
import { useEffect } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../../../../store';

const DrawDeviceParamsPanel = () => {
  const [form] = Form.useForm();

  const { selectLineData } = useMapEditorStore(
    useShallow((state) => ({
      selectLineData: state.selectLineData,
    })),
  );

  /* ------------------- 同步选中线段数据 ------------------- */
  useEffect(() => {
    if (!selectLineData) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      points: selectLineData.points.map((p) => ({
        x: Number(p.x.toFixed(3)),
        y: Number(p.y.toFixed(3)),
      })),
      lineLength: Number(selectLineData.length.toFixed(3)),
      headingAngle: Number(((selectLineData.angle * 180) / Math.PI).toFixed(2)),
    });
  }, [selectLineData]);

  return (
    <div className='flex flex-col gap-2 w-full'>
      <div className='bg-white/5 rounded-sm p-2'>
        <p className='text-xs font-medium flex items-center gap-2 justify-between'>
          <span>
            <IconifyIcon icon='subway:folder-2' size={14} /> 电梯列表
          </span>
        </p>
        <Dropdown
          menu={{
            items: [
              {
                label: (
                  <div className='flex items-center justify-between'>
                    复制
                    <span className='text-xs font-medium text-gray-400 flex items-center gap-1'>
                      <IconifyIcon icon='mingcute:command-line' size={12} />c
                    </span>
                  </div>
                ),
                key: 'copy',
              },
              { label: <span>删除</span>, key: 'delete' },
              { label: <span>选择</span>, key: 'add' },
            ],
          }}
          trigger={['contextMenu']}
        >
          <ul className='flex flex-col gap-2 text-xs py-2'>
            {new Array(4)
              .fill(0)
              .map((_, index) => ({
                label: `电梯${index + 1}`,
                key: `camera${index + 1}`,
                isSelected: index % 2 === 0,
              }))
              .map((item, index) => {
                return (
                  <li
                    className={classNames(
                      'cursor-pointer hover:bg-cyan-500/30 px-2 py-0.5 flex items-center justify-between',
                      {
                        'bg-white/5': index % 2 === 0,
                        'text-gray-400': !item.isSelected,
                        'bg-[#00d1d1]/80 !text-black': index === 1,
                      },
                    )}
                    key={item.key}
                  >
                    {item.label}
                  </li>
                );
              })}
          </ul>
        </Dropdown>
      </div>
      <div className='flex-1 bg-white/5 rounded-sm p-2 overflow-auto w-full'>
        <Form form={form} layout='horizontal' labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} autoComplete='off'>
          <Collapse defaultActiveKey={['1', '2', '3', '4', '5']}>
            {/* ---------------- 通用属性 ---------------- */}
            <Collapse.Panel header='通用属性' key='1'>
              <Form.Item label='名称' name='name' rules={[{ required: true, message: '请输入名称' }]}>
                <Input size='small' />
              </Form.Item>
              <Form.Item label='坐标' name='coordinate' rules={[{ required: true, message: '请输入坐标' }]}>
                <Input size='small' />
              </Form.Item>
              <Form.Item label='通讯方式' name='commType' rules={[{ required: true, message: '请选择通讯方式' }]}>
                <Select size='small' options={[{ label: 'CAN', value: 'can' }]} />
              </Form.Item>
              <Form.Item label='关联线路' name='lineId' rules={[{ required: true, message: '请选择关联线路' }]}>
                <Select size='small' options={[{ label: '1', value: '1' }]} />
              </Form.Item>
              <Form.Item name='isEnabled' valuePropName='checked' label={'是否启用'}>
                <Checkbox></Checkbox>
              </Form.Item>
            </Collapse.Panel>
            <Collapse.Panel header='网络' key='2'>
              <Form.Item label='IP' name='ip' rules={[{ required: true, message: '请输入IP' }]}>
                <Input size='small' />
              </Form.Item>
              <Form.Item label='端口' name='port' rules={[{ required: true, message: '请输入端口' }]}>
                <Input size='small' />
              </Form.Item>
              <Form.Item label='检测是否连通' name='isConnected' valuePropName='checked'>
                <Button color='primary' variant='link' size='small'>
                  检测
                </Button>
              </Form.Item>
            </Collapse.Panel>

            {/* ---------------- 事件关联 ---------------- */}
            <Collapse.Panel
              header={
                <div>
                  <div className='flex items-center gap-1'>
                    事件关联
                    <Tooltip
                      title={
                        <div className='text-xs'>
                          事件管理，请前往RCS模块
                          <Button size='small' variant='link' color='primary'>
                            前往
                          </Button>
                        </div>
                      }
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                </div>
              }
              key='5'
            >
              <Table
                size='small'
                columns={[
                  {
                    title: '事件名称',
                    dataIndex: 'event',
                    key: 'event',
                  },
                  {
                    title: '事件类型',
                    dataIndex: 'eventType',
                    key: 'eventType',
                  },
                  {
                    title: '线编号',
                    dataIndex: 'lineId',
                    key: 'lineId',
                  },
                ]}
                dataSource={[
                  {
                    key: '1',
                    event: '呼叫电梯',
                    eventType: '通知',
                    lineId: '1',
                  },
                  {
                    key: '1',
                    event: '去往楼层',
                    eventType: '通知',
                    lineId: '1',
                  },
                ]}
                pagination={false}
              />
            </Collapse.Panel>

            {/* ---------------- 高级属性 ---------------- */}
            <Collapse.Panel header='高级属性' key='3'>
              <Form.Item
                label='连接超时时间'
                name='connectTimeout'
                rules={[{ required: true, message: '请输入连接超时时间' }]}
              >
                <Input size='small' />
              </Form.Item>
              <Form.Item
                label='接收超时时间'
                name='receiveTimeout'
                rules={[{ required: true, message: '请输入接收超时时间' }]}
              >
                <Input size='small' />
              </Form.Item>
              <Form.Item label='模式' name='mode' rules={[{ required: true, message: '请选择模式' }]}>
                <Select
                  size='small'
                  options={[
                    { label: '自动', value: 'auto' },
                    { label: '手动', value: 'manual' },
                  ]}
                />
              </Form.Item>
              <Form.Item label='站点编号' name='stationId' rules={[{ required: true, message: '请输入站点编号' }]}>
                <Input size='small' />
              </Form.Item>
              <Form.Item label='编码类型' name='encodingType' rules={[{ required: true, message: '请选择编码类型' }]}>
                <Select
                  size='small'
                  options={[
                    { label: 'ASCII', value: 'ascii' },
                    { label: 'HEX', value: 'hex' },
                  ]}
                />
              </Form.Item>
            </Collapse.Panel>

            {/* ---------------- 额外属性 ---------------- */}
            <Collapse.Panel header='额外属性' key='4'>
              <Form.Item name='openDoorRequestAddress' label={'开门请求地址'}>
                <Input size='small' />
              </Form.Item>
              <Form.Item name='openDoorResponseAddress' label={'开门响应地址'}>
                <Input size='small' />
              </Form.Item>
              <Form.Item
                label='关门请求地址'
                name='closeDoorRequestAddress'
                rules={[{ required: true, message: '请输入关门请求地址' }]}
              >
                <Input size='small' />
              </Form.Item>
              <Form.Item
                label='关门响应地址'
                name='closeDoorResponseAddress'
                rules={[{ required: true, message: '请输入关门响应地址' }]}
              >
                <Input size='small' />
              </Form.Item>
            </Collapse.Panel>
          </Collapse>
        </Form>
      </div>
    </div>
  );
};

export default DrawDeviceParamsPanel;
