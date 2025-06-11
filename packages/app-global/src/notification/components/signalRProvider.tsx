import { useNotificationStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { dashboard } from 'apis';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { createSinalRConnection } from './signalr';
export const SignalRProvider = () => {
  const { addNotification, setCountUnread, resetNotification } = useNotificationStore(
    useShallow((state) => {
      return {
        addNotification: state.addNotification,
        setCountUnread: state.setCountUnread,
        resetNotification: state.resetNotification,
      };
    }),
  );

  const { run: getUnread } = useRequest(dashboard.getNotificationList, {
    manual: true,
    onSuccess: (res) => {
      if (res?.items?.length > 0) {
        addNotification(res.items);
      } else {
        resetNotification();
      }
      // console.log(res);
    },
  });
  const { run: getCount } = useRequest(dashboard.getNotificationUnreadCount, {
    manual: true,
    onSuccess: (res) => {
      // console.log(res);
      setCountUnread(res);
    },
  });

  useEffect(() => {
    getCount();
    getUnread({
      status: 0,
      SkipCount: 0,
      MaxResultCount: 1000,
    });
    const connection = createSinalRConnection('/messaging-hub?keyMessage=WMS,RCS,WCS');
    connection.start().then(() => {
      connection.on('MessageNotify', async (message: any) => {
        toast.warning(message?.title, {
          position: 'top-right',
          // duration: Infinity,
          description: message?.content,
          dismissible: true,
          action: {
            label: '查看',
            onClick: () => {
              // window.open(message?.url, '_blank');
            },
          },
        });
        await getUnread({
          status: 0,
          SkipCount: 0,
          MaxResultCount: 1000,
        });
        await getCount();
        // debugger;
        // addNotification(message);
      });
    });
    return () => {
      connection.stop();
    };
  }, []);
  return null;
};
