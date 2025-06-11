import { useNotificationStore } from '@gbeata/store';
import { useSize } from 'ahooks';
import { Button, Divider, Empty, Tabs, TabsProps, Tag } from 'antd';
// import { dashboard } from 'apis';
import dayjs from 'dayjs';
import VirtualList from 'rc-virtual-list';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import useRefreshNotification from './hooks/useRefreshNotification';

const GlobalNotification = () => {
  const refdiv = useRef(null);
  const size = useSize(refdiv);
  const { t } = useTranslation();
  const { refreshNotification } = useRefreshNotification();
  const { notifications } = useNotificationStore(
    useShallow((state) => {
      return {
        notifications: state.notifications,
      };
    }),
  );

  const tabChildren = (source) => {
    const filterNotification = notifications.filter((item) => item.source === source);
    if (filterNotification.length === 0) {
      return <Empty />;
    }
    return (
      <VirtualList height={size?.height ?? 600} data={filterNotification} itemHeight={80} itemKey={(item) => item?.id}>
        {(item) => (
          <>
            <div className='flex justify-between' key={item.id}>
              <div className='ml-2'>
                <div>{item.title}</div>
                <div className='text-xs font-light opacity-60'>{item.content}</div>
                <span className='text-xs font-light opacity-60'>
                  {dayjs(item?.creationTime).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>
              <div className='mt-2'>
                <Button
                  size='small'
                  className='text-xs py-1 h-5'
                  variant='filled'
                  color='orange'
                  onClick={async () => {
                    // const res = await dashboard.readNotification(item.id);
                    // if (res) {
                    //   message.success(t('global.billing.readSuccess'));
                    //   refreshNotification();
                    // }
                  }}
                >
                  {t('global.billing.read')}
                </Button>
              </div>
            </div>
            <Divider variant='dashed' className='m-1' type='horizontal' />
          </>
        )}
      </VirtualList>
    );
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <div className='flex gap-2'>
          <span>Wms</span>
          <Tag bordered={false} color='processing'>
            {notifications.filter((item) => item.source === 0).length ?? 0}
          </Tag>
        </div>
      ),
      children: tabChildren(0),
    },
    {
      key: '2',
      label: (
        <div className='flex gap-2'>
          <span>WCS</span>
          <Tag bordered={false} color='error'>
            {notifications.filter((item) => item.source === 1).length ?? 0}
          </Tag>
        </div>
      ),
      children: tabChildren(1),
    },
    {
      key: '3',
      label: (
        <div className='flex gap-2'>
          <span>RCS</span>
          <Tag bordered={false} color='green'>
            {notifications.filter((item) => item.source === 2).length ?? 0}
          </Tag>
        </div>
      ),
      children: tabChildren(2),
    },
  ];
  return (
    <>
      {/* <SignalRProvider /> */}
      <div className='flex flex-col px-6 h-[calc(100%-62px)]' ref={refdiv}>
        <Tabs defaultActiveKey='1' items={items} />
      </div>
    </>
  );
};
export default GlobalNotification;
