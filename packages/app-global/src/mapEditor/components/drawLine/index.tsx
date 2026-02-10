import { Checkbox, Form, Select } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../store';
const DrawLinesSelect = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { setParamsPanelCollapsed, selectDrawType, setSelectDrawType } =
    useMapEditorStore(
      useShallow((state) => {
        return {
          setParamsPanelCollapsed: state.setParamsPanelCollapsed,
          selectDrawType: state.selectDrawType,
          setSelectDrawType: state.setSelectDrawType,
        };
      }),
    );
  console.log('selectDrawType', selectDrawType);
  const [form] = Form.useForm();
  const vehicleOptions = [
    {
      label: '普通点',
      value: '1',
    },
    {
      label: '库位点',
      value: '2',
    },
  ];
  useEffect(() => {
    if (
      selectDrawType === 'line' ||
      selectDrawType === 'bspline' ||
      selectDrawType === 'bezier'
    ) {
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
            'bg-[#00d1d1]/60':
              selectDrawType === 'line' || selectDrawType === 'bspline',
          },
        )}
        onClick={() => {
          setCollapsed(false);
          setSelectDrawType('line');
        }}
      >
        <IconifyIcon icon='fad:softclipcurve' size={16} />
        <span>线</span>
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
              className={classNames(
                'hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer',
                {
                  'bg-[#00d1d1]/60': selectDrawType === 'line',
                },
              )}
              onClick={() => {
                setParamsPanelCollapsed(true);
                debugger;
                setSelectDrawType('line');
              }}
            >
              直线
            </div>
            <div
              className={classNames(
                'hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer',
                {
                  'bg-[#00d1d1]/60': selectDrawType === 'bspline',
                },
              )}
              onClick={() => {
                setParamsPanelCollapsed(true);
                setSelectDrawType('bspline');
              }}
            >
              B样条
            </div>
            <div
              className={classNames(
                'hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer',
                {
                  'bg-[#00d1d1]/60': selectDrawType === 'bezier',
                },
              )}
              onClick={() => {
                setParamsPanelCollapsed(true);
                setSelectDrawType('bezier');
              }}
            >
              贝塞尔曲线
            </div>
            <div
              className='hover:bg-[#00d1d1]/20 px-1 rounded-md cursor-pointer'
              onClick={() => setParamsPanelCollapsed(true)}
            >
              贝塞尔圆弧
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
              <Form.Item name='isSnap' label='吸附'>
                <Checkbox></Checkbox>
              </Form.Item>
              <Form.Item
                name='vehicleId'
                label='点类型'
                tooltip='生成线段的点类型'
              >
                <Select
                  options={vehicleOptions}
                  className='min-w-24'
                  size='small'
                />
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
    </>
  );
};

export default DrawLinesSelect;
