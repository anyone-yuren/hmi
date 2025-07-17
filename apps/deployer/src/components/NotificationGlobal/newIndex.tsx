import { useSafetyStore } from '@/views/Safety/store/safety.store';
import { Modal, notification } from 'antd';
import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useObsError from './obsError';
// import { useGlobaltore } from "@/store/global";
// import { useDashboardInfo } from "@/store/DashboardInfo";
import { useTranslation } from 'react-i18next';

const NotificationGlobal = () => {
  const { t } = useTranslation();
  const [modal, contextHolderModal] = Modal.useModal();
  const { getObsMsg } = useObsError();
  const [api, contextHolder] = notification.useNotification({
    maxCount: 2,
    stack: true,
  });
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
  //       message: t("异常信息"),
  //       description: (
  //         <>
  //           {Error_description.map((item) => (
  //             <p key={item.description}>{item.description}</p>
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
  //   if (obsInfo?.type !== 1 && activeApp != "Safety") {
  //     api.warning({
  //       message: getObsMsg(obsInfo.type),
  //       closeIcon: false,
  //       description: (
  //         <Button
  //           type="link"
  //           onClick={() => {
  //             setActiveApp("Safety");
  //             setDialogOpenActive();
  //           }}
  //         >
  //           {t("查看详情")}
  //         </Button>
  //       ),
  //       key: "obs-info",
  //       placement: "top",
  //       duration: 0,
  //       showProgress: true,
  //     });
  //   } else {
  //     api.destroy("obs-info");
  //   }
  // }, [obsInfo?.type, activeApp]);

  // useEffect(() => {
  //   if (activeApp === "Safety") {
  //     api.destroy("obs-info");
  //   }
  // }, [activeApp]);

  return (
    <>
      {contextHolder}
      {contextHolderModal}
    </>
  );
};

export default memo(NotificationGlobal);
