import { Form } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../../../../store';
import { useMapEditorViewStore } from '../../../../../../store/view';
const DrawNavigationSelect = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { setParamsPanelCollapsed, selectDrawType, setSelectDrawType } = useMapEditorStore(
    useShallow((state) => {
      return {
        setParamsPanelCollapsed: state.setParamsPanelCollapsed,
        selectDrawType: state.selectDrawType,
        setSelectDrawType: state.setSelectDrawType,
      };
    }),
  );
  const { setShowMapEditor } = useMapEditorViewStore(
    useShallow((state) => {
      return {
        setShowMapEditor: state.setShowMapEditor,
      };
    }),
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
    if (selectDrawType === 'navigation') {
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
            'bg-[#00d1d1]/60': selectDrawType === 'navigation',
          },
        )}
        onClick={() => {
          setCollapsed(false);
          setSelectDrawType('navigation');
        }}
      >
        <IconifyIcon icon='mingcute:navigation-line' size={16} />
        <span>导航区域管理</span>
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
          {/* <div className='flex gap-2 items-center text-white/80'>
            <div
              className={classNames('hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer', {
                'bg-[#00d1d1]/60': true,
              })}
              onClick={() => {
                setParamsPanelCollapsed(true);
                setSelectDrawType('navigation');
              }}
            >
              反光板
            </div>
            <div
              className={classNames('hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer', {
                'bg-[#00d1d1]/60': false,
              })}
              onClick={() => {
                setParamsPanelCollapsed(true);
                setSelectDrawType('navigation');
              }}
            >
              SLAM
            </div>
            <div
              className='hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer'
              onClick={() => {
                setParamsPanelCollapsed(true);
                setSelectDrawType('navigation');
              }}
            >
              二维码
            </div>
            <div
              className='hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer'
              onClick={() => {
                setParamsPanelCollapsed(true);
                setSelectDrawType('navigation');
              }}
            >
              混导区域
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
              <Form.Item label='导入反光板'>
                <Radio.Group>
                  <Radio value='1'>本地</Radio>
                  <Radio value='2'>车辆</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label='导出反光板'>
                <Radio.Group>
                  <Radio value='1'>本地</Radio>
                  <Radio value='2'>车辆</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </div> */}
          <div
            className='hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer'
            onClick={() => {
              setShowMapEditor(false);
            }}
          >
            清除地图
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

export default DrawNavigationSelect;
