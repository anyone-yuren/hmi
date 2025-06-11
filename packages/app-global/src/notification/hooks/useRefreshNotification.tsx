import { useNotificationStore } from '@gbeata/store';
import { App } from 'antd';
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

  return {
    refreshNotification: () => {},
    readAllNotification: () => {
      modal.confirm({
        title: t('global.readAll') + '?',
        okText: t('editor.confirm'),
        cancelText: t('editor.cancel'),
        getContainer: false,
        onOk: () => {},
      });
    },
  };
};

export default useRefreshNotification;
