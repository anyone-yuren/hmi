import { useWebSocket } from 'ahooks';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useHomeStore } from '../store';
import { useHomeHybirdStore } from '../store/hybird';

// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const VEHICLE_URL =
  import.meta.env.NODE_ENV == 'development'
    ? '/ws10009' // 开发环境使用代理
    : `ws://${currentHost}:10009`; // 生产环境使用真实地址
// 使用10001端口的websocket 连接
const VEHICLE_URL_10001 =
  import.meta.env.NODE_ENV == 'development'
    ? '/ws10001' // 开发环境使用代理
    : `ws://${currentHost}:10001`; // 生产环境使用真实地址

export const useHybrid = () => {
  const {
    setTaskInfo,
    setControlStatus,
    setRobotCurrentStatus,
    setRobotIsensorStatus,
    setRobotGoodsStatus,
    setRobotForkarmStatus,
  } = useHomeStore(
    useShallow((state) => {
      return {
        setTaskInfo: state.setTaskInfo,
        setControlStatus: state.setControlStatus,
        setRobotCurrentStatus: state.setRobotCurrentStatus,
        setRobotIsensorStatus: state.setRobotIsensorStatus,
        setRobotGoodsStatus: state.setRobotGoodsStatus,
        setRobotForkarmStatus: state.setRobotForkarmStatus,
      };
    }),
  );
  const { agvPosition, setAgvPosition } = useHomeHybirdStore(
    useShallow((state) => {
      return {
        agvPosition: state.agvPosition,
        setAgvPosition: state.setAgvPosition,
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
      if (data.uri == '/sirius/topics/task_info') {
        const { timestamp, ...rest } = data;
        setTaskInfo(rest);
      }
      if (data.uri == '/sirius/topics/control_status') {
        const { timestamp, ...rest } = data;
        setControlStatus(rest);
      }
      if (data.uri == '/sirius/topics/robot_status_isensor') {
        const { timestamp, ...rest } = data;
        setRobotIsensorStatus(rest);
      }
      if (data.uri == '/sirius/topics/robot_status_goods') {
        const { timestamp, ...rest } = data;
        setRobotGoodsStatus(rest);
      }
      if (data.uri == '/sirius/topics/robot_status_forkarm') {
        const { timestamp, ...rest } = data;
        setRobotForkarmStatus(rest);
      }
    },
  });
  const {
    sendMessage: sendMessage10001,
    latestMessage: latestMessage10001,
    readyState: readyState10001,
  } = useWebSocket(VEHICLE_URL_10001, {
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
      if (data?.uri === '/navigation/robot_status_localizer_result') {
        data.pose.x = Math.round(data.pose.x * 1000 * 100) / 100;
        data.pose.y = Math.round(data.pose.y * 1000 * 100) / 100;
        data.pose.theta = Math.round(data.pose.theta * 100) / 100;
        // TODO 转整数
        if (!agvPosition) {
          setAgvPosition({
            angel: data.pose.theta,
            x: data.pose.x,
            y: data.pose.y,
          });
        }
        const diffX = Math.abs(data.pose.x - agvPosition.x);
        const diffY = Math.abs(data.pose.y - agvPosition.y);

        // if (diffX > 1 || diffY > 1) {
        // }
        setAgvPosition({
          angel: data.pose.theta,
          x: data.pose.x,
          y: data.pose.y,
        });
        // }
      }
    },
  });

  useEffect(() => {
    if (readyState10001 === 1) {
      sendMessage10001(
        JSON.stringify({
          uri: 'subscribe',
          topics: ['/navigation/robot_current_status', '/navigation/robot_status_localizer_result'],
        }),
      );
    }
  }, [readyState10001]);

  useEffect(() => {
    if (readyState === 1) {
      sendMessage(
        JSON.stringify({
          uri: 'subscribe',
          topics: [
            '/sirius/topics/task_info',
            '/sirius/topics/control_status',
            '/sirius/topics/robot_status_isensor',
            '/sirius/topics/robot_status_goods',
            '/sirius/topics/robot_status_forkarm',
          ],
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
