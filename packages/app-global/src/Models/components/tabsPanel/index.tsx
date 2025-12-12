import { Checkbox, Collapse, Form, Select, Tooltip } from 'antd';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../../store';
import ObstacleHandles from './obsHandles';

const TabsPanel = ({ setPanelOpen }) => {
  const { mode, setMode, threeControl } = useModelStore(
    useShallow((state) => {
      return {
        mode: state.mode,
        setMode: state.setMode,
        threeControl: state.threeControl,
      };
    }),
  );
  useEffect(() => {
    if (mode === 'obstacleAvoidance' && threeControl) {
      threeControl?.setLookAt(
        0,
        0,
        3,
        0,
        1,
        0,
        true, // 平滑动画
      );
    }
    if (mode === 'editor' && threeControl) {
      threeControl?.setLookAt(
        0,
        2,
        2,
        0,
        0,
        0,
        true, // 平滑动画
      );
    }
  }, [mode, threeControl]);
  const [activeTab, setActiveTab] = useState('radar');
  const [activePoints, setActivePoints] = useState(false);
  const items = [
    {
      key: '1',
      label: '点云查看',
      children: (
        <Form
          name='basic'
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item label={'激活点云'} name='deviceId'>
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
        </Form>
      ),
    },
  ];
  return (
    <>
      <div
        className={classNames('w-10 absolute top-10 left-2 z-10 flex flex-col gap-2', { hidden: mode !== 'editor' })}
      >
        <div className={classNames('flex flex-col items-center justify-center gap-y-px')}>
          <div
            className={`flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 ${activeTab === 'radar' ? 'bg-cyan-500/40' : ''}`}
            onClick={() => {
              setActiveTab('radar');
              setPanelOpen(true);
            }}
          >
            <Tooltip title='2D雷达' placement='right'>
              <IconifyIcon icon='stash:radar' size={28} />
            </Tooltip>
          </div>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <IconifyIcon icon='stash:radar-light' size={28} />
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <IconifyIcon icon='fluent:hard-drive-28-regular' size={28} />
          </div>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='执行机构' placement='right'>
              <IconifyIcon icon='mdi:hydraulic-oil-temperature' size={28} />
            </Tooltip>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='视觉相机' placement='right'>
              <IconifyIcon icon='solar:camera-outline' size={28} />
            </Tooltip>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='音乐播放器' placement='right'>
              <IconifyIcon icon='iconamoon:music-album-fill' size={28} />
            </Tooltip>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='RFID读取器' placement='right'>
              <IconifyIcon icon='bx:rfid' size={28} />
            </Tooltip>
          </div>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='超声波' placement='right'>
              <IconifyIcon icon='streamline:wave-signal' size={28} />
            </Tooltip>
          </div>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='IMU' placement='right'>
              <IconifyIcon icon='lucide:scale-3d' size={28} />
            </Tooltip>
          </div>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='IO' placement='right'>
              <IconifyIcon icon='ci:radio-fill' size={28} />
            </Tooltip>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='二维码' placement='right'>
              <IconifyIcon icon='ant-design:qrcode-outlined' size={28} />
            </Tooltip>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='继电器' placement='right'>
              <IconifyIcon icon='simple-icons:relay' size={28} />
            </Tooltip>
          </div>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='PLC' placement='right'>
              <IconifyIcon icon='ix:plc-device-tag' size={28} />
            </Tooltip>
          </div>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='电路板' placement='right'>
              <IconifyIcon icon='ph:circuitry' size={28} />
            </Tooltip>
          </div>
        </div>
      </div>
      {/* 地图操作 */}
      <div className='absolute top-2 right-2 left-2 flex items-center justify-between z-10'>
        <div>
          <Select
            className='min-w-32'
            size='small'
            defaultValue='1'
            value={mode}
            onChange={setMode}
            options={[
              { label: '编辑模式', value: 'editor' },
              { label: '透视模式', value: 'perspective' },
              { label: '避障模式', value: 'obstacleAvoidance' },
            ]}
          />
        </div>
        <div className='flex items-center justify-center gap-2'>
          <div
            className={
              activePoints
                ? 'flex items-center cursor-pointer bg-teal-500/60 active:bg-cyan-500/30 hover:bg-cyan-500/40 p-1'
                : 'flex items-center cursor-pointer bg-black/40 active:bg-cyan-500/30 hover:bg-cyan-500/40 p-1'
            }
          >
            <Tooltip title='点云查看' placement='top'>
              <IconifyIcon
                icon='icon-park-outline:nine-points-connected'
                size={16}
                onClick={() => setActivePoints(!activePoints)}
              />
            </Tooltip>
          </div>
          <div className='flex items-center cursor-pointer bg-black/40 active:bg-cyan-500/30 hover:bg-cyan-500/40 p-1'>
            <Tooltip title='透视模式' placement='bottom'>
              <IconifyIcon icon='icon-park-outline:stereo-perspective' size={16} />
            </Tooltip>
          </div>
        </div>
      </div>
      <motion.div
        className='absolute top-10 right-10 z-10 bg-black min-w-40 rounded-lg'
        initial={{ opacity: 0, y: 10 }}
        animate={activePoints ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        // 结束后设置隐藏
      >
        <Collapse items={items} defaultActiveKey={['1']} />
      </motion.div>

      {/* 避障相关 */}
      {mode === 'obstacleAvoidance' && <ObstacleHandles />}
    </>
  );
};

export default TabsPanel;
