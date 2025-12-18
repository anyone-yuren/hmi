import { Menu, Modal, Popover, Tooltip } from 'antd';
import { createStyles, useResponsive, useTheme } from 'antd-style';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconifyIcon } from 'ui';
// 修改antd Menu默认样式
const menuStyles = createStyles(({ token }) => ({
  menu: {
    backgroundColor: 'transparent',
    border: 'none !important',
    '.ant-menu-item, .ant-menu-submenu-title': {
      height: '24px !important',
      lineHeight: '24px !important',
    },
    '.ant-menu-item-selected': {
      color: token.colorPrimary,
    },
    '.ant-menu-item:hover': {
      color: token.colorPrimary,
    },
  },
}));

const GlobalHeader = () => {
  const responsive = useResponsive();
  const [modal, contextHolder] = Modal.useModal();
  const theme = useTheme();
  const { styles } = menuStyles();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className=' text-xs flex flex-col h-full items-center justify-between px-2 py-4 text-white '>
      <div className='flex flex-col items-center gap-4'>
        <IconifyIcon
          icon='mdi:widgets-outline'
          size={24}
          className='opacity-40 transition-all duration-300 cursor-pointer hover:opacity-100'
          onClick={() => navigate(`/`)}
        />
        {location.pathname !== '/' && (
          <>
            <Tooltip title='地图编辑器' placement='right'>
              <div className='flex items-center flex-col gap-1 opacity-40 transition-all duration-300 cursor-pointer hover:opacity-100'>
                <IconifyIcon icon='carbon:map' size={24} className='' onClick={() => navigate(`/mapEditor`)} />
                <span>地图</span>
              </div>
            </Tooltip>
            <Tooltip title='车辆管理' placement='right'>
              <div className='flex items-center flex-col gap-1 opacity-40 transition-all duration-300 cursor-pointer hover:opacity-100'>
                <IconifyIcon icon='material-symbols-light:forklift' size={26} onClick={() => navigate(`/dashboard`)} />
                <span>车辆</span>
              </div>
            </Tooltip>
            <Tooltip title='车辆日志' placement='right'>
              <div className='flex items-center flex-col gap-1 opacity-40 transition-all duration-300 cursor-pointer hover:opacity-100'>
                <IconifyIcon icon='solar:database-outline' size={24} onClick={() => navigate(`/vehicleLogs`)} />
                <span>日志</span>
              </div>
            </Tooltip>
            <Tooltip title='调度配置' placement='right'>
              <div className='flex items-center flex-col gap-1 opacity-40 transition-all duration-300 cursor-pointer hover:opacity-100'>
                <IconifyIcon icon='fluent:transmission-20-regular' size={24} onClick={() => navigate(`/ftp`)} />
                <span>RCS</span>
              </div>
            </Tooltip>
            <Tooltip title='远程FTP' placement='right'>
              <div className='flex items-center flex-col gap-1 opacity-40 transition-all duration-300 cursor-pointer hover:opacity-100'>
                <IconifyIcon icon='mingcute:transfer-3-line' size={24} onClick={() => navigate(`/ftp`)} />
                <span>FTP</span>
              </div>
            </Tooltip>
          </>
        )}
      </div>
      <div className='flex flex-col items-center gap-4'>
        <IconifyIcon
          icon='teenyicons:user-circle-solid'
          size={22}
          className='opacity-40 transition-all duration-300 cursor-pointer hover:opacity-100'
        />
        <Popover
          placement='rightTop'
          trigger='click'
          content={
            <Menu
              className={styles.menu}
              items={[
                {
                  key: '1',
                  label: '主题',
                },
                {
                  key: '2',
                  label: '文字大小',
                },
                {
                  key: 'sub1',
                  label: 'Navigation Two',
                  children: [
                    { key: '3', label: 'Option 3' },
                    { key: '4', label: 'Option 4' },
                  ],
                },
              ]}
            />
          }
          title={null}
        >
          <IconifyIcon
            icon='ant-design:setting-outlined'
            size={24}
            className='opacity-40 transition-all duration-300 cursor-pointer hover:opacity-100'
          />
        </Popover>
      </div>
      {contextHolder}
    </div>
  );
};
export default GlobalHeader;
