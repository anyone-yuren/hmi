import { Dropdown } from 'antd';
import { useTheme } from 'antd-style';
import { IconifyIcon } from 'ui';
import ControlView from '../../../controlView';
import DrawLinesSelect from '../../../drawLine';
import DrawPlaneSelect from '../../../drawPlane';
import DrawPointsSelect from '../../../drawPoints';
import DrawStationSelect from '../../../drawStation';
import DrawDeviceSelect from './components/device';
import DrawNavigationSelect from './components/navigation';

const DrawHandle = () => {
  const theme = useTheme();
  return (
    <div className='top-0 left-0 w-full flex  items-start justify-between gap-2 bg-[#1a1a1a] z-10 absolute font-bold'>
      <div className='flex gap-2 items-center justify-between'>
        <div className='flex gap-2 items-center px-2'>
          <DrawPointsSelect />
          <DrawStationSelect />
          <DrawLinesSelect />
          <DrawPlaneSelect />
          <DrawDeviceSelect />
          <DrawNavigationSelect />
        </div>
      </div>
      <div className='flex gap-2 items-center'>
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
          <span>同步至调度</span>
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
        <div className='flex gap-2 items-center px-2'>
          <ControlView />
        </div>
      </div>
    </div>
  );
};

export default DrawHandle;
