import { useWebSocket } from 'ahooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '../components/CustomToast';
import useObsError from './useObsError';
// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const HYBRID_URL = import.meta.env.DEV
  ? '/ws10009' // 开发环境使用代理
  : `ws://${currentHost}:10009`; // 生产环境使用真实地址

const hashMap: any = {};
export const useNotification = () => {
  const { t } = useTranslation();
  const { getObsMsg } = useObsError();
  const [obsInfo, setObsInfo] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<any>();
  const { sendMessage, latestMessage, readyState } = useWebSocket(HYBRID_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage: (message) => {
      if (message?.data?.includes('/sirius/topics/safety_obs_info')) {
        const data = JSON.parse(message.data);
        setObsInfo((prev) => {
          if (prev?.type === data.type) {
            return prev;
          }
          return data.type;
        });
      }
      if (message?.data?.includes('/sirius/topics/error_description')) {
        // TODO 此处需要改造成json格式
        // const data = JSON.parse(message.data);
        // setErrorMessage((prev) => {
        //   if (prev?.type === data.type) {
        //     return prev;
        //   }
        //   return data;
        // });
      }
    },
  });
  useEffect(() => {
    if (obsInfo !== 1 && getObsMsg(obsInfo)) {
      toast({
        title: t('common.obsError.title'),
        description: getObsMsg(obsInfo),
        button: {
          label: t('common.obsError.view'),
          onClick: () => {
            console.log('查看通知');
          },
        },
      });
    }
  }, [obsInfo]);
  return {
    sendMessage,
    latestMessage,
    readyState,
  };
};
