import { Checkbox, Collapse, Dropdown, Form, Select, Tooltip } from 'antd';
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
  const items1 = [
    {
      key: '1',
      label: (
        <div className='flex items-center gap-1 justify-end'>
          <span>2d相机</span>
        </div>
      ),
      children: (
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
                label: `相机${index + 1}`,
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
                    <span className='flex items-center gap-1'>
                      <Tooltip title='显示/隐藏'>
                        <IconifyIcon icon='charm:eye' size={14} />
                      </Tooltip>
                      {/* <Tooltip title='选中/取消选中'>
                        <IconifyIcon
                          icon={
                            item.isSelected
                              ? 'material-symbols:check-box-rounded'
                              : 'material-symbols:check-box-outline-sharp'
                          }
                          size={14}
                        />
                      </Tooltip> */}
                    </span>
                  </li>
                );
              })}
          </ul>
        </Dropdown>
      ),
    },
    {
      key: '2',
      label: (
        <div className='flex items-center gap-1 justify-end'>
          <span>3d相机</span>
        </div>
      ),
      children: (
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
                label: `相机${index + 1}`,
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
                    <span className='flex items-center gap-1'>
                      <Tooltip title='显示/隐藏'>
                        <IconifyIcon icon='charm:eye' size={14} />
                      </Tooltip>
                      {/* <Tooltip title='选中/取消选中'>
                        <IconifyIcon
                          icon={
                            item.isSelected
                              ? 'material-symbols:check-box-rounded'
                              : 'material-symbols:check-box-outline-sharp'
                          }
                          size={14}
                        />
                      </Tooltip> */}
                    </span>
                  </li>
                );
              })}
          </ul>
        </Dropdown>
      ),
    },
  ];
  return (
    <>
      <div
        className={classNames(' absolute top-10 left-2 z-10 flex flex-col gap-2 h-full overflow-auto min-w-32', {
          hidden: mode !== 'editor',
        })}
      >
        <div className={classNames('flex flex-col w-full items-center justify-center gap-y-px bg-black/80')}>
          {/* <div
            className={`flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 ${activeTab === 'radar' ? 'bg-cyan-500/40' : ''}`}
            onClick={() => {
              setActiveTab('radar');
              setPanelOpen(true);
            }}
          >
            <Tooltip title='2D雷达' placement='right'>
              <IconifyIcon icon='stash:radar' size={28} />
            </Tooltip>
          </div> */}
          {/* <div className='flex items-center justify-center w-full aspect-square bg-black/40 active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <IconifyIcon icon='stash:radar-light' size={28} />
          </div> */}
          <Collapse items={items1} defaultActiveKey={['1']} className='w-full' />
        </div>
        <div className='flex flex-col items-center justify-center gap-y-px'>
          {/* <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <IconifyIcon icon='fluent:hard-drive-28-regular' size={28} />
          </div>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='执行机构' placement='right'>
              <IconifyIcon icon='mdi:hydraulic-oil-temperature' size={28} />
            </Tooltip>
          </div> */}
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40  min-w-28 bg-black/40 '>
            <IconifyIcon icon='fluent:hard-drive-28-regular' size={16} />
            <span>底盘</span>
          </div>
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 min-w-28 bg-black/40 '>
            <IconifyIcon icon='mdi:hydraulic-oil-temperature' size={16} />
            <span>执行机构</span>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 min-w-28 bg-black/40 '>
            <IconifyIcon icon='solar:camera-outline' size={16} />
            <span>视觉相机</span>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 min-w-28 bg-black/40 '>
            <IconifyIcon icon='iconamoon:music-album-fill' size={16} />
            <span>音频播放器</span>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 min-w-28 bg-black/40 '>
            <IconifyIcon icon='bx:rfid' size={16} />
            <span>RFID读取器</span>
          </div>
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 min-w-28 bg-black/40 '>
            <IconifyIcon icon='streamline:wave-signal' size={16} />
            <span>超声波</span>
          </div>
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 min-w-28 bg-black/40 '>
            <IconifyIcon icon='lucide:scale-3d' size={16} />
            <span>IMU</span>
          </div>
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 min-w-28 bg-black/40 '>
            <IconifyIcon icon='ci:radio-fill' size={16} />
            <span>IO</span>
          </div>
        </div>
        {/* <div className='flex flex-col items-center justify-center gap-y-px'>
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
        </div> */}
        <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 min-w-28 bg-black/40 '>
            <IconifyIcon icon='ant-design:qrcode-outlined' size={16} />
            <span>二维码</span>
          </div>
        </div>
        {/* <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-center w-full aspect-square bg-black/40 cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40'>
            <Tooltip title='二维码' placement='right'>
              <IconifyIcon icon='ant-design:qrcode-outlined' size={28} />
            </Tooltip>
          </div>
        </div> */}
        <div className='flex flex-col items-center justify-center gap-y-px'>
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 min-w-28 bg-black/40 '>
            <IconifyIcon icon='simple-icons:relay' size={16} />
            <span>继电器</span>
          </div>
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 min-w-28 bg-black/40 '>
            <IconifyIcon icon='ix:plc-device-tag' size={16} />
            <span>PLC</span>
          </div>
          <div className='flex items-center justify-between px-2 w-full cursor-pointer active:bg-cyan-500/30 hover:bg-cyan-500/40 min-w-28 bg-black/40 '>
            <IconifyIcon icon='ph:circuitry' size={16} />
            <span>电路板</span>
          </div>
        </div>
        {/* <div className='flex flex-col items-center justify-center gap-y-px'>
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
        </div> */}
      </div>
      {/* 地图操作 */}
      <div className='absolute top-2 right-2 left-2 flex items-center justify-between z-10 '>
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
