import { useWebSocket } from 'ahooks';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSingleTaskStore } from '../store/singleTask.store';

// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const VEHICLE_URL =
  import.meta.env.NODE_ENV == 'development'
    ? '/ws10009' // 开发环境使用代理
    : `ws://${currentHost}:10009`; // 生产环境使用真实地址
// 使用10001端口的websocket 连接
const HYBRID_URL =
  import.meta.env.NODE_ENV == 'development'
    ? '/ws10001' // 开发环境使用代理
    : `ws://${currentHost}:10001`; // 生产环境使用真实地址

export const useSingleTask = () => {
  const [count, setCount] = useState(1);
  const { setAgvPosition, setRcsInfo, setRefreshTaskList, setCloudPoints, setRobotCurrentStatus } = useSingleTaskStore(
    useShallow((state) => {
      return {
        setAgvPosition: state.setAgvPosition,
        setRcsInfo: state.setRcsInfo,
        setRefreshTaskList: state.setRefreshTaskList,
        setCloudPoints: state.setCloudPoints,
        setRobotCurrentStatus: state.setRobotCurrentStatus,
      };
    }),
  );
  const { sendMessage, latestMessage, readyState } = useWebSocket(VEHICLE_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage: (message) => {
      if (message.data.includes('subscribe') || !message.data) {
        return;
      }
      const data = JSON.parse(message.data);
      if (data.uri == '/sirius/topics/test_task_info') {
        setCount((origin) => {
          return origin + 1;
        });
      }
      if (data.uri == '/sirius/topics/rcs_info') {
        const { timestamp, ...rest } = data;
        setRcsInfo(rest);
      }
    },
  });
  const {
    sendMessage: sendMessage10001,
    latestMessage: latestMessage10001,
    readyState: readyState10001,
  } = useWebSocket(HYBRID_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage: (message) => {
      if (message.data.includes('subscribe')) {
        return;
      }

      const data = JSON.parse(message.data);
      if (data.uri == '/navigation/robot_current_status') {
        const { timestamp, ...rest } = data;
        setRobotCurrentStatus(rest);
      }
      if (data.uri == '/navigation/scan_head') {
        const { timestamp, ...rest } = data;
        setCloudPoints(rest);
      }
      if (data.uri == '/navigation/robot_status_localizer_result') {
        setAgvPosition({
          angel: data.pose.theta,
          x: data.pose.x,
          y: data.pose.y,
        });
      }
    },
  });

  useEffect(() => {
    if (readyState10001 === 1) {
      sendMessage10001(
        JSON.stringify({
          uri: 'subscribe',
          topics: [
            '/navigation/robot_current_status',
            '/navigation/scan_head',
            '/navigation/robot_status_localizer_result',
          ],
        }),
      );
    }
  }, [readyState10001]);

  useEffect(() => {
    if (readyState === 1) {
      sendMessage(
        JSON.stringify({
          uri: 'subscribe',
          topics: ['/sirius/topics/test_task_info', '/sirius/topics/rcs_info'],
        }),
      );
    }
  }, [readyState]);

  useEffect(() => {
    setRefreshTaskList(count);
  }, [count]);

  return {
    sendMessage,
    latestMessage,
    readyState,
  };
};
