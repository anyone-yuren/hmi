import { Dropdown, Menu, MenuProps } from 'antd';
import { useTheme } from 'antd-style';
import { useState } from 'react';
import { IconifyIcon } from 'ui';
import RobotCapabilityTopology from '../Models/modules/Capability';
import VisionFlow from '../Models/visionFlow';
import WorkflowDesignerContainer from '../WorkflowDesigner/container';
import BaseInformation from './modules/baseInformation';
import PathPlanning from './modules/pathPlanning';

type MenuItem = Required<MenuProps>['items'][number];
const Parameters = () => {
  const theme = useTheme();
  const [selectedKey, setSelectedKey] = useState('base');
  const items: MenuItem[] = [
    { key: 'base', label: '配置进度' },
    {
      key: '1',
      icon: <IconifyIcon icon='ic:baseline-blur-on' size={16} />,
      label: '基础',
      children: [
        { key: '1-1', label: '基础信息' },
        {
          key: '1-2',
          label: '黑匣子',
          children: [
            { key: '1-2-1', label: 'can数据配置' },
            { key: '1-2-2', label: '关键话题数据配置' },
          ],
        },
        { key: '1-3', label: '充电' },
        {
          key: '1-4',
          label: '雷达',
          children: [
            { key: '1-4-1', label: '过滤' },
            { key: '1-4-2', label: '频率' },
          ],
        },
        { key: '1-5', label: '劢微云' },
        { key: '1-6', label: '外设' },
        { key: '1-7', label: '任务管理' },
        { key: '1-8', label: '车辆' },
        { key: '1-9', label: '车辆安全防护' },
        { key: '1-10', label: '版本管理' },
        { key: '1-11', label: '车载web通讯' },
      ],
    },
    {
      key: '2',
      icon: (
        <IconifyIcon
          icon='material-symbols-light:compass-calibration-outline'
          size={16}
        />
      ),
      label: '标定',
      children: [
        { key: '2-1', label: '避障相机' },
        { key: '2-2', label: 'imu' },
        { key: '2-3', label: '2D避障雷达' },
        { key: '2-4', label: '3D避障雷达' },
        { key: '2-5', label: '定位雷达坐标' },
        { key: '2-6', label: '定位雷达偏航角' },
        { key: '2-7', label: '二维码读头' },
      ],
    },
    {
      key: '3',
      icon: <IconifyIcon icon='ion:game-controller-outline' size={16} />,
      label: '控制',
      children: [
        { key: '3-1', label: '底盘' },
        { key: '3-2', label: '执行机构' },
      ],
    },
    {
      key: '5',
      label: '视觉',
      icon: <IconifyIcon icon='ion:camera-outline' size={16} />,
    },
    {
      key: 'sub2',
      label: '嵌入式',
      icon: <IconifyIcon icon='ion:code-working-outline' size={16} />,
      children: [
        { key: '9', label: 'Option 9' },
        { key: '10', label: 'Option 10' },
        {
          key: 'sub3',
          label: 'Submenu',
          children: [
            { key: '11', label: 'Option 11' },
            { key: '12', label: 'Option 12' },
          ],
        },
      ],
    },
    {
      key: '4',
      icon: <IconifyIcon icon='ion:map-outline' size={16} />,
      label: '建图',
    },
    {
      key: '6',
      icon: <IconifyIcon icon='ion:location-outline' size={16} />,
      label: '定位',
    },
    {
      key: '7',
      icon: <IconifyIcon icon='ion:navigate-outline' size={16} />,
      label: '路径规划',
    },
    {
      key: '8',
      icon: <IconifyIcon icon='ion:layers-outline' size={16} />,
      label: '拓扑地图',
    },
    {
      key: '9',
      icon: <IconifyIcon icon='hugeicons:workflow-circle-03' size={16} />,
      label: '事件编排',
    },
  ];
  return (
    <div className='h-full w-full flex gap-2'>
      <div className='h-full  bg-white/15  shadow-[#00d1d1] p-2 overflow-auto min-w-44'>
        <Menu
          defaultSelectedKeys={[selectedKey]}
          defaultOpenKeys={['1']}
          mode='inline'
          theme='dark'
          className='bg-transparent'
          inlineIndent={12}
          // inlineCollapsed={collapsed}
          items={items}
          onSelect={({ key }) => {
            setSelectedKey(key);
          }}
        />
      </div>
      <div className='h-full shadow-xl flex gap-2 flex-col flex-1'>
        <div className='bg-white/10'>
          <div className='flex gap-2 items-center justify-end px-2'>
            <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
              <IconifyIcon
                icon='mynaui:save'
                size={16}
                style={{
                  color: theme.colorWarning,
                }}
              />
              <span>保存</span>
            </div>
            <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
              <IconifyIcon
                icon='icon-park-outline:back'
                size={16}
                style={{
                  color: theme.colorError,
                }}
              />
              <span>撤销</span>
            </div>
            <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
              <IconifyIcon
                icon='uil:sync'
                size={16}
                style={{
                  color: theme.colorSuccess,
                }}
              />
              <span>同步至车辆</span>
            </div>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  { label: '本地(.zar)', key: 5 },
                  { label: '本地(.zip)', key: 6 },
                  { label: '调度(.zar)', key: 7 },
                ],
              }}
            >
              <div className='flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md'>
                <IconifyIcon icon='mingcute:file-export-line' size={16} />
                <span>导出</span>
              </div>
            </Dropdown>
          </div>
        </div>
        <div className='flex-1 overflow-auto'>
          {selectedKey === '5' && <VisionFlow />}
          {selectedKey === '1-1' && <BaseInformation />}
          {selectedKey === 'base' && <RobotCapabilityTopology />}
          {selectedKey === '7' && <PathPlanning />}
          {selectedKey === '9' && <WorkflowDesignerContainer />}
        </div>
      </div>
    </div>
  );
};
export default Parameters;
