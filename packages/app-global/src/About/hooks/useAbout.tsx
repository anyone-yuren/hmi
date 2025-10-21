import { useWebSocket } from 'ahooks';
import { isEqual } from 'lodash';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAboutStore } from '../store/about.store';
// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const VEHICLE_URL =
  import.meta.env.NODE_ENV == 'development'
    ? '/ws10009' // 开发环境使用代理
    : `ws://${currentHost}:10009`; // 生产环境使用真实地址
const formatToTwoDecimals = (data: any): any => {
  if (typeof data === 'number') {
    return parseFloat(data.toFixed(0)); // 保留两位小数并转换为数字
  }
  if (Array.isArray(data)) {
    return data.map(formatToTwoDecimals); // 递归处理数组
  }
  if (typeof data === 'object' && data !== null) {
    const formattedData: Record<string, any> = {};
    for (const key in data) {
      formattedData[key] = formatToTwoDecimals(data[key]); // 递归处理对象
    }
    return formattedData;
  }
  return data; // 非数值字段保持不变
};
export const useAbout = () => {
  const { setSystemUsage, systemUsage } = useAboutStore(
    useShallow((state) => {
      return {
        systemUsage: state.systemUsage,
        setSystemUsage: state.setSystemUsage,
      };
    }),
  );

  const { sendMessage, latestMessage, readyState } = useWebSocket(VEHICLE_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage: (message) => {
      if (message.data.includes('subscribe')) {
        return;
      }
      const data = JSON.parse(message.data);
      if (data.uri == '/sirius/topics/system_status') {
        const { timestamp, ...rest } = data;
        // 格式化 rest 的每个字段，保留两位小数
        const formattedRest = formatToTwoDecimals(rest);

        // 判断 systemUsage 和 formattedRest 是否相等
        if (!isEqual(systemUsage, formattedRest)) {
          setSystemUsage(formattedRest); // 仅在不相等时更新
        }
      }
    },
  });

  useEffect(() => {
    if (readyState === 1) {
      sendMessage(
        JSON.stringify({
          uri: 'subscribe',
          topics: ['/sirius/topics/system_status'],
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
