import Safety from '@/views/Safety';
import { useSafetyStore } from '@/views/Safety/store/safety.store';
import { useGetState } from 'ahooks';
import { ConfigProvider, Drawer, Modal, notification, theme } from 'antd';
import { useResponsive } from 'antd-style';
import { memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import useObsError from './obsError';

const NotificationGlobal = () => {
  const { t } = useTranslation();
  const [modal, contextHolderModal] = Modal.useModal();
  const { getObsMsg } = useObsError();
  const [api, contextHolder] = notification.useNotification({
    maxCount: 2,
    stack: true,
  });
  const { xl } = useResponsive();

  const hasUpdatedShowDrawer = useRef(false);
  const [showDrawer, setShowDrawer, getShowDrawer] = useGetState(false);

  const { obsInfo } = useSafetyStore(
    useShallow((store) => ({
      obsInfo: store.obsInfo,
    })),
  );

  return (
    <>
      {contextHolder}
      {contextHolderModal}
      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
        <Drawer
          title={t('避障信息')}
          placement={'right'}
          zIndex={1202}
          push={false}
          onClose={() => {
            modal.confirm({
              title: t('关闭避障消息'),
              content: t('确定关闭避障消息吗?'),
              onOk: () => {
                setShowDrawer(false);
              },
            });
          }}
          width={xl ? '50%' : '60%'}
          styles={{
            body: {
              position: 'relative',
            },
          }}
        >
          <Safety />
        </Drawer>
      </ConfigProvider>
    </>
  );
};

export default memo(NotificationGlobal);
