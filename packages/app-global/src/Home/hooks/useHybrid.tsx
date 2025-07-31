import { useWebSocket } from 'ahooks';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useHomeStore } from '../store';

// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const HYBRID_URL =
  import.meta.env.NODE_ENV == 'development'
    ? '/ws10009' // 开发环境使用代理
    : `ws://${currentHost}:10009`; // 生产环境使用真实地址

export const useHybrid = () => {
  const { setTaskInfo, setControlStatus } = useHomeStore(
    useShallow((state) => {
      return {
        setTaskInfo: state.setTaskInfo,
        setControlStatus: state.setControlStatus,
      };
    }),
  );
  const { sendMessage, latestMessage, readyState } = useWebSocket(HYBRID_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage: (message) => {
      if (message.data.includes('subscribe')) {
        return;
      }
      const data = JSON.parse(message.data);
      if (data.uri == '/sirius/topics/task_info') {
        const { timestamp, ...rest } = data;
        setTaskInfo(rest);
      }
      if (data.uri == '/sirius/topics/control_status') {
        const { timestamp, ...rest } = data;
        setControlStatus(rest);
      }
    },
  });

  useEffect(() => {
    if (readyState === 1) {
      sendMessage(
        JSON.stringify({
          uri: 'subscribe',
          topics: ['/sirius/topics/task_info', '/sirius/topics/control_status'],
        }),
      );
    }
  }, [readyState]);
  return {
    sendMessage,
    latestMessage,
    readyState,
  };
};
