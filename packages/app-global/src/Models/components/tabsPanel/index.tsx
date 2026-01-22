import { Checkbox, Collapse, Form, Menu, Select, Tooltip } from 'antd';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../../store';
import { useSafetyStore } from '../../store/safity';
import ObstacleHandles from './obsHandles';

const TabsPanel = ({ setPanelOpen }) => {
  const {
    mode,
    setMode,
    threeControl,
    setShowPoints,
    showPoints,
    modelSelect,
    setModelSelect,
    setSelectedPart,
    isOffsetTable,
  } = useModelStore(
    useShallow((state) => {
      return {
        mode: state.mode,
        setMode: state.setMode,
        threeControl: state.threeControl,
        setShowPoints: state.setShowPoints,
        showPoints: state.showPoints,
        modelSelect: state.modelSelect,
        setModelSelect: state.setModelSelect,
        setSelectedPart: state.setSelectedPart,
        isOffsetTable: state.isOffsetTable,
      };
    }),
  );
  const {
    showStrategies,
    setShowStrategies,
    selectMeshName,
    setSelectMeshName,
  } = useSafetyStore(
    useShallow((state) => ({
      showStrategies: state.showStrategies,
      setShowStrategies: state.setShowStrategies,
      selectMeshName: state.selectMeshName,
      setSelectMeshName: state.setSelectMeshName,
    })),
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
    if (mode === 'diagnosis' && threeControl) {
      threeControl?.setLookAt(
        0,
        1,
        2,
        0,
        0.5,
        0,
        true, // 平滑动画
      );
    }
  }, [mode, threeControl]);
  const [activeTab, setActiveTab] = useState('radar');
  const [activePoints, setActivePoints] = useState(false);

  if (isOffsetTable) return null;
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

  const menuItems = [
    {
      key: '1',
      icon: <IconifyIcon icon='ion:game-controller-outline' size={16} />,
      label: '2d激光雷达',
      children: [
        {
          key: 'radar1',
          label: '2d激光雷达-1',
          onClick: () => {
            threeControl?.setLookAt(
              -1,
              0.15,
              -0.4,
              0,
              0.15,
              0.4,
              true, // 平滑动画
            );
            setSelectedPart('camera-2');
          },
        },
        {
          key: 'radar2',
          label: '2d激光雷达-2',
          onClick: () => {
            threeControl?.setLookAt(
              -1,
              0.15,
              0.4,
              0,
              0.15,
              0.4,
              true, // 平滑动画
            );
            setSelectedPart('camera-1');
          },
        },
      ],
    },
    {
      key: '2',
      icon: <IconifyIcon icon='ion:game-controller-outline' size={16} />,
      label: '3d激光雷达',
      children: [
        { key: '2-1', label: '3d激光雷达-1' },
        { key: '2-2', label: '3d激光雷达-2' },
      ],
    },
    {
      key: '3',
      icon: <IconifyIcon icon='fluent:hard-drive-28-regular' size={16} />,
      label: '底盘',
    },
    {
      key: '4',
      icon: <IconifyIcon icon='mdi:hydraulic-oil-temperature' size={16} />,
      label: '执行机构',
    },
    {
      key: '5',
      icon: <IconifyIcon icon='solar:camera-outline' size={16} />,
      label: 'Tof视觉相机',
      children: [
        {
          key: 'topCamera',
          label: 'Tof牙尖相机-1',
          onClick: () => {
            threeControl?.setLookAt(
              -0.6,
              1.1,
              0.5,
              -0.6,
              1.1,
              0,
              true, // 平滑动画
            );
            setSelectedPart('radar');
          },
        },
      ],
    },
    {
      key: '6',
      icon: <IconifyIcon icon='iconamoon:music-album-fill' size={16} />,
      label: '音频播放器',
    },
    {
      key: '8',
      icon: <IconifyIcon icon='bx:rfid' size={16} />,
      label: 'RFID读取器',
    },
    {
      key: '9',
      icon: <IconifyIcon icon='streamline:wave-signal' size={16} />,
      label: '超声浓',
    },
    {
      key: '10',
      icon: <IconifyIcon icon='lucide:scale-3d' size={16} />,
      label: 'IMU',
    },
    {
      key: '11',
      icon: <IconifyIcon icon='ci:radio-fill' size={16} />,
      label: 'IO',
    },
    {
      key: '12',
      icon: <IconifyIcon icon='ant-design:qrcode-outlined' size={16} />,
      label: '二维码',
    },
    {
      key: '13',
      icon: <IconifyIcon icon='simple-icons:relay' size={16} />,
      label: '继电器',
    },
    {
      key: '14',
      icon: <IconifyIcon icon='ix:plc-device-tag' size={16} />,
      label: 'PLC',
    },
    {
      key: '15',
      icon: <IconifyIcon icon='ph:circuitry' size={16} />,
      label: '电路板',
    },
  ];

  return (
    <>
      <div
        className={classNames(
          ' absolute top-10 left-2 z-10 flex flex-col gap-2  overflow-auto min-w-32 bg-[#1e1e1e]',
          {
            hidden: mode !== 'editor',
          },
        )}
      >
        <Menu
          defaultSelectedKeys={[modelSelect]}
          defaultOpenKeys={['1']}
          mode='inline'
          theme='dark'
          className='bg-transparent'
          inlineIndent={12}
          // inlineCollapsed={collapsed}
          items={menuItems}
          onSelect={({ key }) => {
            setModelSelect(key);
          }}
        />
      </div>
      {/* 地图操作 */}
      <div className='absolute top-10 right-2 flex items-center justify-end z-10 gap-2'>
        <div>
          <Select
            className='min-w-32'
            size='small'
            defaultValue='1'
            value={mode}
            onChange={setMode}
            options={[
              { label: '编辑模式', value: 'editor' },
              { label: '视觉诊断', value: 'diagnosis' },
              { label: '避障模式', value: 'obstacleAvoidance' },
            ]}
          />
        </div>
        <div
          className={classNames('flex items-center justify-center gap-1', {
            hidden: mode !== 'obstacleAvoidance',
          })}
        >
          <span>避障策略</span>
          <Select
            className='min-w-32'
            size='small'
            // value={mode}
            // onChange={setMode}
            value={selectMeshName}
            onChange={setSelectMeshName}
            options={[
              { label: '叉臂下方保护', value: 'underForkProtection' },
              { label: '取货牙尖防护策略', value: 'pickupTipProtection' },
              { label: '放货空间检测', value: 'deliverySpaceDetection' },
              { label: '顶部保护策略', value: 'topProtection' },
            ]}
          />
        </div>
        <div className='flex items-center justify-center gap-2'>
          <div
            className={
              showPoints
                ? 'flex items-center cursor-pointer bg-teal-500/60 active:bg-cyan-500/30 hover:bg-cyan-500/40 p-1'
                : 'flex items-center cursor-pointer bg-black/40 active:bg-cyan-500/30 hover:bg-cyan-500/40 p-1'
            }
            onClick={() => setShowPoints(!showPoints)}
          >
            <Tooltip title='点云查看' placement='top'>
              <IconifyIcon
                icon='icon-park-outline:nine-points-connected'
                size={16}
              />
            </Tooltip>
          </div>
          <div
            className={classNames(
              'flex items-center cursor-pointer bg-black/40 active:bg-cyan-500/30 hover:bg-cyan-500/40 p-1',
              { hidden: mode !== 'obstacleAvoidance' },
              { 'bg-cyan-500/80': !showStrategies },
            )}
            onClick={() => setShowStrategies(!showStrategies)}
          >
            <Tooltip title='显示/隐藏策略' placement='bottom'>
              <IconifyIcon
                icon='icon-park-outline:stereo-perspective'
                size={16}
              />
            </Tooltip>
          </div>
        </div>
        {mode === 'obstacleAvoidance' && <ObstacleHandles />}
      </div>
      <AnimatePresence>
        {activePoints && (
          <motion.div
            className='absolute top-16 right-10 z-10 bg-black min-w-40 rounded-lg'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <Collapse items={items} defaultActiveKey={['1']} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 避障相关 */}
    </>
  );
};

export default TabsPanel;
