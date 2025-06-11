import { useNotificationStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { App } from 'antd';
import { dashboard } from 'apis';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

const useRefreshNotification = () => {
  const { t } = useTranslation();
  const { modal } = App.useApp();
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

  const { run: readAll } = useRequest(dashboard.readAllNotification, {
    manual: true,
    onSuccess: () => {
      getCount();
      getUnread({
        status: 0,
        SkipCount: 0,
        MaxResultCount: 1000,
      });
    },
  });
  return {
    refreshNotification: () => {
      getCount();
      getUnread({
        status: 0,
        SkipCount: 0,
        MaxResultCount: 1000,
      });
    },
    readAllNotification: () => {
      modal.confirm({
        title: t('global.readAll') + '?',
        okText: t('editor.confirm'),
        cancelText: t('editor.cancel'),
        getContainer: false,
        onOk: () => {
          readAll();
        },
      });
    },
  };
};

export default useRefreshNotification;
