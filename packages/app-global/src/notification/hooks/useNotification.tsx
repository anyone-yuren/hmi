import { useWebSocket } from 'ahooks';
import { useEffect, useState } from 'react';
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
  const { getObsMsg } = useObsError();
  const [obsInfo, setObsInfo] = useState<any>();
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
    },
  });
  useEffect(() => {
    if (obsInfo !== 1) {
      console.log(getObsMsg(obsInfo?.type));

      toast({
        title: '避障消息',
        description: getObsMsg(obsInfo),
        button: {
          label: '查看',
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
