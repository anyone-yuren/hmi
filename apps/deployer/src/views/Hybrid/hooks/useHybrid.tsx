import { useWebSocket } from 'ahooks';
import YAML from 'js-yaml';
import { useEffect } from 'react';
import useHybirdWsExtend from '../service/wsExtend';
// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const HYBRID_URL = import.meta.env.DEV
  ? '/ws10001' // 开发环境使用代理
  : `ws://${currentHost}:10001`; // 生产环境使用真实地址

const hashMap: any = {};
export const useHybrid = () => {
  const hybirdWsExtend = useHybirdWsExtend();
  const webSocketEventHashMap: any = {
    ...hybirdWsExtend,
  };
  const { sendMessage, latestMessage, readyState } = useWebSocket(HYBRID_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage: (message) => {
      if (message.data.includes('subscribe')) {
        return;
      }
      const uriRegex = /"uri":"([^"]+)"/;
      const uri = message.data.match(uriRegex);
      if (!uri?.[1]) {
        console.log(message.data);
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
        const render_data = message ? YAML.load(message.data) : {};
        webSocketEventHashMap[data?.uri] && webSocketEventHashMap[data?.uri](render_data);
      }
    },
  });

  useEffect(() => {
    if (readyState === 1) {
      sendMessage(
        JSON.stringify({
          uri: 'subscribe',
          topics: ['/navigation/scan_head'],
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
