import { Button, Form, Input, Modal, Radio } from 'antd';
import { useState } from 'react';
import { IconifyIcon, ShinyText, SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { RadarLoading } from '../../components/RadarLoading';
import { useMapEditorViewStore } from '../store/view';

const HybridManagement = () => {
  const [visible, setVisible] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [loading, setLoading] = useState(false);
  const { setShowMapEditor } = useMapEditorViewStore(
    useShallow((state) => {
      return {
        setShowMapEditor: state.setShowMapEditor,
      };
    }),
  );
  const [form] = Form.useForm();
  return (
    <div className='w-full h-full flex items-center justify-center'>
      {contextHolder}
      <div className='w-1/2 h-1/2 bg-white/10 rounded-lg flex flex-col p-2 relative'>
        <p className='text-2xl'>
          <ShinyText text='导航工具' />
        </p>
        <div className='flex-1 flex items-center w-full'>
          <div className='flex-1 flex flex-col items-center justify-center'>
            <SvgIcon name='noLog' size={220} />
            <p className='text-sm text-gray-500 text-center bg-black/20 p-1 rounded-md'>当前项目无导航数据</p>
          </div>
          <div className='flex-1 '>
            <div className='flex flex-col gap-4 min-w-40'>
              <h4 className='text-xl'>添加方式</h4>
              <div className='handle-list w-full flex flex-col gap-4 text-teal-400'>
                <div
                  className='flex items-center gap-4 cursor-pointer'
                  onClick={() => {
                    setLoading(false);
                    setVisible(false);
                    setShowMapEditor(true);
                  }}
                >
                  <IconifyIcon icon='material-symbols-light:folder-open-outline-sharp' size={20} />
                  <span>打开...</span>
                </div>
                <div
                  className='flex items-center gap-4 cursor-pointer'
                  onClick={() =>
                    modal.confirm({
                      title: '请选择车辆',
                      icon: null,
                      okButtonProps: {
                        type: 'primary',
                        size: 'small',
                      },
                      cancelButtonProps: {
                        size: 'small',
                      },
                      okText: '导入',
                      onOk: async () => {
                        const values = await form.validateFields();
                      },

                      content: (
                        <Form form={form}>
                          <Form.Item
                            label='车辆名称'
                            name='vehicleName'
                            rules={[{ required: true, message: '请选择车辆' }]}
                          >
                            <Radio.Group>
                              <Radio value={1}>车辆1</Radio>
                              <Radio value={2}>车辆2</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Form>
                      ),
                    })
                  }
                >
                  <IconifyIcon icon='uit:link-h' size={20} />
                  <span>连接到车辆...</span>
                </div>
                <div className='flex items-center gap-4 cursor-pointer' onClick={() => setVisible(true)}>
                  <IconifyIcon icon='clarity:world-line' size={20} />
                  <span>连接到手持设备</span>
                </div>
              </div>
              {/* 使用说明 */}
              <div
                className='w-full h-px bg-gray-300'
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)',
                }}
              ></div>
              <div>
                <h4 className='text-sm'>使用说明</h4>
                <div className='handle-list w-full flex flex-col gap-2 text-gray-500 p-2'>
                  <div className='flex items-center gap-4'>
                    <span>1. 若使用手持设备雷达建图，请将手持设备连接到车辆，并将数据传输到手持车辆。 详细说明：</span>
                  </div>
                  <div className='flex items-center gap-4'>
                    <span>2. 若使用车辆雷达建图，请选择需要同步雷达数据的车辆。并同步数据到地图。详细说明：</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={visible} onCancel={() => setVisible(false)} title='连接到手持设备' footer={null}>
        {loading && (
          <div className='my-2'>
            <RadarLoading />
          </div>
        )}
        <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 24 }}>
          <Form.Item label='ip' name='ip' rules={[{ required: true, message: '请输入ip' }]}>
            <Input size='small' />
          </Form.Item>
          <Form.Item label='端口' name='port' rules={[{ required: true, message: '请输入端口' }]}>
            <Input size='small' />
          </Form.Item>
          <div className='flex w-full items-center justify-end gap-2'>
            <Button
              type='primary'
              size='small'
              loading={loading}
              disabled={loading}
              onClick={() =>
                form.validateFields().then((values) => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    setVisible(false);
                    setShowMapEditor(true);
                  }, 5000);
                })
              }
            >
              连接
            </Button>
            <Button variant='solid' color='red' size='small' onClick={() => setVisible(false)}>
              取消
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default HybridManagement;
