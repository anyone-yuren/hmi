import { useWebSocket } from 'ahooks';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useSafetyWsExtend from '../service/wsExtend';

import { useSafetyStore } from '../store/safety.store';
// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const HYBRID_URL = import.meta.env.DEV
  ? '/ws10009' // 开发环境使用代理
  : `ws://${currentHost}:10009`; // 生产环境使用真实地址

const hashMap: any = {};
export const useSafety = () => {
  const safetyWsExtend = useSafetyWsExtend();
  const { sensorPointsKey } = useSafetyStore(
    useShallow((store) => ({
      sensorPointsKey: store.sensorPointsKey,
    })),
  );
  const webSocketEventHashMap: any = {
    ...safetyWsExtend,
  };
  const { sendMessage, latestMessage, readyState, disconnect } = useWebSocket(HYBRID_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage: (message) => {
      if (message.data.includes('subscribe')) {
        return;
      }
      const uriRegex = /"uri":"([^"]+)"/;
      const uri = message.data.match(uriRegex);
      if (!uri?.[1]) {
        return;
      }
      const data = { uri: uri[1] };
      let overwrite = false;
      if (!hashMap[data?.uri]) {
        hashMap[data?.uri] = {};
        hashMap[data?.uri].data = message.data;
        hashMap[data?.uri].time = new Date().getTime();
        overwrite = true;
      } else {
        // isDiff为true时候表示不相等,为false表示相等,相等要直接返回
        const isDiff = !(hashMap[data?.uri].data === message.data);
        const now = new Date().getTime();
        const diffTime = now - hashMap[data?.uri].time;
        if (!isDiff || diffTime < 200) return;
        overwrite = isDiff;
        hashMap[data?.uri].data = message.data;
        hashMap[data?.uri].time = now;
      }

      if (overwrite) {
        const render_data = message ? JSON.parse(message.data) : {};
        webSocketEventHashMap[data?.uri] && webSocketEventHashMap[data?.uri](render_data);
      }
      if (sensorPointsKey.includes(data?.uri)) {
        const extra_render_data = message ? JSON.parse(message.data) : {};
        webSocketEventHashMap['/set_sensor_points'](data?.uri, extra_render_data);
      }
    },
  });
  useEffect(() => {
    if (readyState === 1) {
      sendMessage(
        JSON.stringify({
          uri: 'subscribe',
          topics: [
            '/sirius/topics/safety_obs_info',
            // '/sirius/topics/compose_sensor_point',
            '/sirius/topics/safety_compose_sensor_points',
            '/sirius/topics/goods_info',
            '/sirius/topics/safety_protect_region',
            '/sirius/topics/task_status_motion',
            '/sirius/topics/robot_status_forkarm',
            ...sensorPointsKey,
          ],
        }),
      );
    }
  }, [readyState, sendMessage, sensorPointsKey]);
  return {
    sendMessage,
    latestMessage,
    readyState,
  };
};
