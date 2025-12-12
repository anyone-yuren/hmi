import { useWebSocket } from 'ahooks';
import { throttle } from 'lodash';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useHomeHybirdStore } from '../store/hybird';
import useDebouncedHomeStore from './useDebounce';

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

export const useHome = () => {
  const debounced = useDebouncedHomeStore();

  const { agvPosition, setAgvPosition } = useHomeHybirdStore(
    useShallow((state) => {
      return {
        agvPosition: state.agvPosition,
        setAgvPosition: state.setAgvPosition,
      };
    }),
  );

  // 在 hook 内，保证 debounce/ref 在第一次 render 就存在
  const latestSetAgvPositionRef = useRef(setAgvPosition);
  useEffect(() => {
    latestSetAgvPositionRef.current = setAgvPosition;
  }, [setAgvPosition]);

  const throttleSetAgvPositionRef = useRef(
    throttle((pos) => {
      try {
        latestSetAgvPositionRef.current(pos);
      } catch (e) {
        console.error('[throttle] inner error', e);
      }
    }, 1000),
  );

  // 清理
  useEffect(() => {
    return () => {
      throttleSetAgvPositionRef.current?.cancel?.();
    };
  }, []);

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
        debounced.setTaskInfo(rest);
      }
      if (data.uri == '/sirius/topics/control_status') {
        const { timestamp, ...rest } = data;
        debounced.setControlStatus(rest);
      }
      if (data.uri == '/sirius/topics/robot_status_isensor') {
        const { timestamp, ...rest } = data;
        debounced.setRobotIsensorStatus(rest);
      }
      if (data.uri == '/sirius/topics/robot_status_goods') {
        const { timestamp, ...rest } = data;
        debounced.setRobotGoodsStatus(rest);
      }
      if (data.uri == '/sirius/topics/robot_status_forkarm') {
        const { timestamp, ...rest } = data;
        debounced.setRobotForkarmStatus(rest);
      }
      if (data.uri == '/sirius/topics/segments_info') {
        const { timestamp, ...rest } = data;
        debounced.setSegmentsInfo(rest?.segments);
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
        debounced.setRobotCurrentStatus(rest);
      }
      if (data?.uri === '/navigation/robot_status_localizer_result') {
        data.pose.x = Math.round(data.pose.x * 1000 * 100) / 100;
        data.pose.y = Math.round(data.pose.y * 1000 * 100) / 100;
        data.pose.theta = Math.round(data.pose.theta * 100) / 100;
        // TODO 转整数
        if (!agvPosition) {
          throttleSetAgvPositionRef.current({
            angel: data.pose.theta,
            x: data.pose.x,
            y: data.pose.y,
          });
        }
        // const diffX = Math.abs(data.pose.x - agvPosition.x);
        // const diffY = Math.abs(data.pose.y - agvPosition.y);

        // if (diffX > 1 || diffY > 1) {
        // }
        throttleSetAgvPositionRef.current({
          angel: data.pose.theta,
          x: data.pose.x,
          y: data.pose.y,
        });
        // }
      }
    },
  });

  useEffect(() => {
    debounced.setIsContentWss(false);
  }, []);

  useEffect(() => {
    if (readyState10001 === 1) {
      debounced.setIsContentWss(true);
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
            '/sirius/topics/segments_info',
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
