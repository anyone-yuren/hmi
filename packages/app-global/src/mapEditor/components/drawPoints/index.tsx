import { Form, Radio, Select } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../store';

const DrawPointsSelect = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { setParamsPanelCollapsed } = useMapEditorStore(
    useShallow((state) => {
      return {
        setParamsPanelCollapsed: state.setParamsPanelCollapsed,
      };
    }),
  );
  const [form] = Form.useForm();
  const vehicleOptions = [
    {
      label: '车辆1',
      value: '1',
    },
    {
      label: '车辆2',
      value: '2',
    },
  ];
  const drawPointsType = Form.useWatch('drawPointsType', form);
  return (
    <>
      <div
        className={classNames(
          'flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md',
          {
            'bg-[#00d1d1]/20': !collapsed,
          },
        )}
        onClick={() => setCollapsed(!collapsed)}
      >
        <IconifyIcon icon='gis:copy-point' size={20} />
        <span>点</span>
      </div>
      <motion.div
        animate={{
          opacity: collapsed ? 0 : 1,
          y: collapsed ? -5 : 0,
          zIndex: collapsed ? -1 : 1,
        }}
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
              className='hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer'
              onClick={() => setParamsPanelCollapsed(true)}
            >
              库位点
            </div>
            <div
              className='hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer'
              onClick={() => setParamsPanelCollapsed(true)}
            >
              暂停点
            </div>
            <div
              className='hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer'
              onClick={() => setParamsPanelCollapsed(true)}
            >
              普通点
            </div>
            <div
              className='hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer'
              onClick={() => setParamsPanelCollapsed(true)}
            >
              视觉检测点
            </div>
            <div
              className='hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer'
              onClick={() => setParamsPanelCollapsed(true)}
            >
              掉头点
            </div>
            <div
              className='hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer'
              onClick={() => setParamsPanelCollapsed(true)}
            >
              立库点
            </div>
            <div className='flex items-center gap-1'>
              <IconifyIcon icon='mingcute:add-fill' size={14} />
              <span>添加模板</span>
            </div>
          </div>
          <div className='min-w-80'>
            <Form form={form} layout='inline'>
              <Form.Item name='drawPointsType'>
                <Radio.Group>
                  <Radio value='1'>自由添加</Radio>
                  <Radio value='2'>车辆坐标</Radio>
                </Radio.Group>
              </Form.Item>
              {drawPointsType === '2' && (
                <Form.Item name='vehicleId'>
                  <Select options={vehicleOptions} className='min-w-24' size='small' />
                </Form.Item>
              )}
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
    </>
  );
};

export default DrawPointsSelect;
