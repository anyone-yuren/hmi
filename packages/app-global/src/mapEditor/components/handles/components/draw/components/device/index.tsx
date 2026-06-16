import { Checkbox, Form, Modal, Select } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../../../../store';
import { useMapEditorViewStore } from '../../../../../../store/view';
const DrawDeviceSelect = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [modal, contextHolder] = Modal.useModal();
  const { setParamsPanelCollapsed, selectDrawType, setSelectDrawType, setSelectSubDrawType, selectSubDrawType } =
    useMapEditorStore(
      useShallow((state) => {
        return {
          setParamsPanelCollapsed: state.setParamsPanelCollapsed,
          selectDrawType: state.selectDrawType,
          setSelectDrawType: state.setSelectDrawType,
          setSelectSubDrawType: state.setSelectSubDrawType,
          selectSubDrawType: state.selectSubDrawType,
        };
      }),
    );
  const { devicesView, setDevicesView } = useMapEditorViewStore(
    useShallow((s) => ({
      devicesView: s.devicesView as Array<'elevator' | 'autoDoor'>,
      setDevicesView: s.setDevicesView,
    })),
  );
  const [form] = Form.useForm();
  const vehicleOptions = [
    {
      label: '1221',
      value: '1',
    },
    {
      label: '7665',
      value: '2',
    },
  ];
  useEffect(() => {
    if (selectDrawType === 'device') {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  }, [selectDrawType]);
  const drawPointsType = Form.useWatch('drawPointsType', form);
  return (
    <>
      <div
        className={classNames(
          'flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md',
          {
            'bg-[#00d1d1]/60': selectDrawType === 'device',
          },
        )}
        onClick={() => {
          setCollapsed(false);
          setSelectDrawType('device');
        }}
      >
        <IconifyIcon icon='material-symbols:doorbell-chime-outline' size={16} />
        <span>设备</span>
      </div>

      <motion.div
        animate={{
          opacity: collapsed ? 0 : 1,
          y: collapsed ? -10 : 0,
          zIndex: collapsed ? -1 : 1,
        }}
        //动画结束后设置z-index为-1
        className='absolute left-0 top-full w-full bg-[#1a1a1a]/80'
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 24,
        }}
      >
        <div className='flex items-center justify-between px-2 py-1'>
          <div className='flex gap-2 items-center text-white/80'>
            <div
              className={classNames('hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer', {
                'bg-[#00d1d1]/60': selectSubDrawType === 'elevator',
              })}
              onClick={() => {
                if (!devicesView.includes('elevator')) {
                  modal.confirm({
                    title: '提示',
                    content: '当前地图未显示电梯，是否显示？',
                    classNames: {
                      content: '!p-2',
                    },
                    okText: '显示',
                    okButtonProps: {
                      type: 'primary',
                      size: 'small',
                    },
                    cancelButtonProps: {
                      size: 'small',
                    },
                    onOk: () => {
                      setDevicesView([...devicesView, 'elevator']);
                      setParamsPanelCollapsed(true);
                      setSelectSubDrawType('elevator');
                    },
                  });
                } else {
                  setParamsPanelCollapsed(true);
                  setSelectSubDrawType('elevator');
                }
              }}
            >
              电梯
            </div>
            <div
              className={classNames('hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer', {
                'bg-[#00d1d1]/60': selectSubDrawType === 'autoDoor',
              })}
              onClick={() => {
                if (!devicesView.includes('autoDoor')) {
                  modal.confirm({
                    title: '提示',
                    content: '当前地图未显示自动门，是否显示？',
                    classNames: {
                      content: '!p-2',
                    },
                    okText: '显示',
                    okButtonProps: {
                      type: 'primary',
                      size: 'small',
                    },
                    cancelButtonProps: {
                      size: 'small',
                    },
                    onOk: () => {
                      setDevicesView([...devicesView, 'autoDoor']);
                      setParamsPanelCollapsed(true);
                      setSelectSubDrawType('autoDoor');
                    },
                  });
                } else {
                  setParamsPanelCollapsed(true);
                  setSelectSubDrawType('autoDoor');
                }
              }}
            >
              自动门
            </div>
            <div
              className='hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer'
              onClick={() => {
                setParamsPanelCollapsed(true);
                setSelectDrawType('bezier');
              }}
            >
              输送线
            </div>
            <div className='flex items-center gap-1'>
              <IconifyIcon icon='mingcute:add-fill' size={14} />
              <span>添加设备</span>
            </div>
          </div>
          <div className='min-w-80'>
            <Form
              form={form}
              layout='inline'
              initialValues={{
                isSnap: true,
                vehicleId: '1',
              }}
            >
              <Form.Item name='isSnap' label='自由添加'>
                <Checkbox></Checkbox>
              </Form.Item>
              <Form.Item name='vehicleId' label='关联线段' tooltip='生成线段的点类型'>
                <Select options={vehicleOptions} className='min-w-24' size='small' />
              </Form.Item>
              <Form.Item name='vehicleId' label='线类型'>
                <Select
                  options={[
                    {
                      label: '向前',
                      value: '1',
                    },
                    {
                      label: '向后',
                      value: '2',
                    },
                  ]}
                  className='min-w-24'
                  size='small'
                />
              </Form.Item>
            </Form>
          </div>
          <div
            className='hover:bg-[#00d1d1]/20 aspect-square rounded-md cursor-pointer'
            onClick={() => {
              setCollapsed(true);
              setParamsPanelCollapsed(false);
            }}
          >
            <IconifyIcon icon='ic:round-close' size={20} />
          </div>
        </div>
      </motion.div>
      {contextHolder}
    </>
  );
};

export default DrawDeviceSelect;
