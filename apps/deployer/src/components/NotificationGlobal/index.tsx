import { useSafetyStore } from '@/views/Safety/store/safety.store';
import { ConfigProvider, Drawer, Modal, notification, theme } from 'antd';
import { memo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useObsError from './obsError';
// import { useGlobaltore } from "@/store/global";
// import { useDashboardInfo } from "@/store/DashboardInfo";
import Safety from '@/views/Safety';
import { useGetState } from 'ahooks';
import { useResponsive } from 'antd-style';
import { useTranslation } from 'react-i18next';

const NotificationGlobal = () => {
  const { t } = useTranslation();
  const [modal, contextHolderModal] = Modal.useModal();
  // const [showDrawer, setShowDrawer] = useState(false);
  const { getObsMsg } = useObsError();
  const [api, contextHolder] = notification.useNotification({
    maxCount: 2,
    stack: true,
  });
  const { xl } = useResponsive();

  // useRef to track the execution of first useEffect
  const hasUpdatedShowDrawer = useRef(false);
  // const showDrawer = useRef(false);
  const [showDrawer, setShowDrawer, getShowDrawer] = useGetState(false);

  const { obsInfo } = useSafetyStore(
    useShallow((store) => ({
      obsInfo: store.obsInfo,
    })),
  );
  // const { Error_description } = useDashboardInfo(
  //   useShallow((store) => ({
  //     Error_description: store.Error_description,
  //   }))
  // );
  // const { setActiveApp, setDialogOpenActive, activeApp } = useGlobaltore(
  //   useShallow((store) => ({
  //     setActiveApp: store.setActiveApp,
  //     setDialogOpenActive: store.setDialogOpenActive,
  //     activeApp: store.activeApp,
  //   }))
  // );

  // useEffect(() => {
  //   api.destroy("error-description");
  //   if (Error_description.length && activeApp != "Diagnosis") {
  //     api.error({
  //       message: "异常信息",
  //       description: (
  //         <>
  //           {Error_description.map((item) => (
  //             <p>{item.description}</p>
  //           ))}
  //           <Button
  //             type="link"
  //             onClick={() => {
  //               setActiveApp("Diagnosis");
  //               setDialogOpenActive();
  //             }}
  //           >
  //             {t("查看详情")}
  //           </Button>
  //         </>
  //       ),
  //       placement: "top",
  //       duration: 0,
  //       showProgress: true,
  //       key: "error-description",
  //     });
  //   }
  // }, [Error_description, activeApp]);

  // useEffect(() => {
  //   // if (hasUpdatedShowDrawer.current) {
  //   if (obsInfo?.type !== 1) {
  //     if (!showDrawer) {
  //       api.warning({
  //         message: getObsMsg(obsInfo.type),
  //         closeIcon: false,
  //         description: (
  //           <Button
  //             type="link"
  //             onClick={() => {
  //               // setActiveApp("Safety");
  //               // setDialogOpenActive();

  //               setShowDrawer(true);
  //             }}
  //           >
  //             {t("查看详情")}
  //           </Button>
  //         ),
  //         key: "obs-info",
  //         placement: "top",
  //         duration: 0,
  //         showProgress: true,
  //       });
  //     } else {
  //       setShowDrawer(true);
  //       api.destroy("obs-info");
  //     }
  //   }
  //   // }
  // }, [getShowDrawer(), obsInfo?.type, activeApp]);

  // useEffect(() => {
  //   if (activeApp === "Safety") {
  //     setShowDrawer(false);
  //     api.destroy("obs-info");
  //   }
  // }, [activeApp]);

  return (
    <>
      {(() => {
        console.log('是否在刷新');
        return null;
      })()}
      {contextHolder}
      {contextHolderModal}
      <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
        <Drawer
          title={t('避障信息')}
          placement={'right'}
          zIndex={1202}
          // closable={false}
          // destroyOnClose
          push={false}
          onClose={() => {
            modal.confirm({
              title: t('关闭避障消息'),
              content: t('确定关闭避障消息吗?'),
              onOk: () => {
                setShowDrawer(false);

                // setActiveApp("Safety");
                // setDialogOpenActive();
              },
            });
          }}
          // open={obsInfo?.type !== 1 && activeApp != "Safety" && showDrawer}
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
