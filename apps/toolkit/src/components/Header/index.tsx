import { Menu, Modal, Popover } from 'antd';
import { createStyles, useResponsive, useTheme } from 'antd-style';
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
  return (
    <div className='flex flex-col h-full items-center justify-between px-2 py-4 text-white '>
      <div className='flex flex-col items-center gap-4'>
        <IconifyIcon
          icon='ic:outline-file-copy'
          size={24}
          className='opacity-40 transition-all duration-300 cursor-pointer hover:opacity-100'
        />
        <IconifyIcon
          icon='mdi:widgets-outline'
          size={24}
          className='opacity-40 transition-all duration-300 cursor-pointer hover:opacity-100'
        />
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
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
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
          title='设置'
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
