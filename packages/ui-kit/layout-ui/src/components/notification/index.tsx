import { BellOutlined } from '@ant-design/icons';
import { GlobalNotification, NotificationList, SignalRProvider, useRefreshNotification } from '@gbeata/app-global';
import { useNotificationStore } from '@gbeata/store';
import { Badge, Divider, Drawer, Space } from 'antd';
import { useTheme } from 'antd-style';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';
import { IconButton, IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';

const Notification = () => {
  const { countUnread } = useNotificationStore(
    useShallow((state) => ({
      countUnread: state.countUnread,
    })),
  );
  const { readAllNotification } = useRefreshNotification();
  const token = useTheme();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  return (
    <>
      <Toaster richColors closeButton visibleToasts={2} offset={16} />
      <SignalRProvider />
      <IconButton shape='circle' size='small' onClick={() => setDrawerOpen(true)}>
        <Badge
          count={countUnread ?? 0}
          size='small'
          styles={{
            root: { color: 'inherit' },
            indicator: { color: token.colorBgBase },
          }}
        >
          {/* <IconifyIcon icon="line-md:bell-loop" size={18} /> */}
          <BellOutlined />
        </Badge>
      </IconButton>
      <Drawer
        placement='right'
        title={t('global.notification')}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        closable={false}
        width={420}
        classNames={{
          content: '',
        }}
        styles={{
          body: { padding: 0 },
          mask: { backgroundColor: 'transparent' },
          footer: {
            padding: 0,
          },
        }}
        extra={
          <IconButton
            shape='circle'
            size='small'
            onClick={() => {
              setDrawerOpen(false);
            }}
          >
            <IconifyIcon icon='solar:check-read-broken' size={20} />
          </IconButton>
        }
        footer={
          <div style={{ color: token.colorText, cursor: 'pointer', padding: 0 }}>
            <Space
              className='flex h-10 w-full items-center justify-evenly font-semibold'
              split={<Divider type='vertical' />}
            >
              <span
                onClick={() => {
                  setShowAll(true);
                }}
              >
                {t('global.viewAll')}
              </span>
              <span
                style={{
                  color: token.colorWarning,
                }}
                onClick={() => {
                  readAllNotification();
                }}
              >
                {t('global.readAll')}
              </span>
            </Space>
          </div>
        }
      >
        <GlobalNotification />
      </Drawer>
      <Drawer
        width='100%'
        height='100%'
        open={showAll}
        onClose={() => {
          setShowAll(false);
        }}
        className='top-0'
        styles={{
          body: {
            height: '100%',
            overflowY: 'auto',
          },
        }}
      >
        <NotificationList />
      </Drawer>
    </>
  );
};
export default Notification;
