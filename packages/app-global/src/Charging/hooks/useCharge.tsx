import { useWebSocket } from 'ahooks';
import { isEqual } from 'lodash';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useChargeStore } from '../store/charge.store';
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
export const useCharge = () => {
  const { robotChangeInfo, setRobotChangeInfo } = useChargeStore(
    useShallow((state) => {
      return {
        robotChangeInfo: state.robotChangeInfo,
        setRobotChangeInfo: state.setRobotChangeInfo,
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
      if (data.uri == '/sirius/topics/robot_charge_data') {
        const { timestamp, ...rest } = data;
        if (!isEqual(robotChangeInfo, rest)) {
          setRobotChangeInfo(rest);
        }
      }
    },
  });

  useEffect(() => {
    if (readyState === 1) {
      sendMessage(
        JSON.stringify({
          uri: 'subscribe',
          topics: ['/sirius/topics/robot_charge_data'],
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
