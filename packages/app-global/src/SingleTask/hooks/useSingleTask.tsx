import { useWebSocket } from 'ahooks';
import pako from 'pako';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSingleTaskStore } from '../store/singleTask.store';

function unzipText(str) {
  return pako.ungzip(
    Uint8Array.from(atob(str), (c) => c.charCodeAt(0)),
    { to: 'string' },
  );
}

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
  // const [rcsTaskCount, setRcsTaskCount] = useState(1)
  const [rcsTaskState, setRcsTaskState] = useState(0);
  const { setAgvPosition, setRcsInfo, setRefreshTaskList, setCloudPoints, setRobotCurrentStatus, setRealTimePoints } =
    useSingleTaskStore(
      useShallow((state) => {
        return {
          setAgvPosition: state.setAgvPosition,
          setRcsInfo: state.setRcsInfo,
          setRefreshTaskList: state.setRefreshTaskList,
          setCloudPoints: state.setCloudPoints,
          setRobotCurrentStatus: state.setRobotCurrentStatus,
          setRealTimePoints: state.setRealTimePoints,
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
          return origin + 10;
        });
      }
      if (data.uri == '/sirius/topics/rcs_info') {
        const { timestamp, ...rest } = data;
        setRcsInfo(rest);
        // if (rest.task_state)
        setRcsTaskState(rest.task_state);
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

      if (data.uri == '/navigation/real_time_data/scan_head') {
        let ary = [];
        if (data?.isGzip) {
          ary = unzipText(data?.point_cloud);
        } else {
          ary = data?.point_cloud;
        }
        if (typeof ary === 'string') {
          ary = JSON.parse(ary);
        }
        setRealTimePoints(ary || []);
        // !isDrag && setPointCloudV1Data(ary || []);
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
            '/navigation/real_time_data/scan_head',
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

  useEffect(() => {
    if (rcsTaskState === 2) {
      setCount((origin) => {
        return origin + 1;
      });
    }
  }, ['rcsTaskState']);

  return {
    sendMessage,
    latestMessage,
    readyState,
  };
};
