import YAML from 'js-yaml';

import { useWebSocket } from 'ahooks';
import useVisionWsExtend from '../services/wsExtend';

const currentHost = window.location.hostname;
const VISION_URL = import.meta.env.DEV
  ? '/ws10010' // 开发环境使用代理
  : `ws://${currentHost}:10010`; // 生产环境使用真实地址
const hashMap: any = {};

const useVision = () => {
  const visionWsExtend = useVisionWsExtend();

  const webSocketEventHashMap: any = {
    ...visionWsExtend,
  };

  const { disconnect, sendMessage, readyState } = useWebSocket(VISION_URL, {
    reconnectLimit: 100,
    reconnectInterval: 5000,
    onMessage: (message, isBinary) => {
      const data = message ? YAML.load(message.data) : {};
      if (!data.uri) {
        console.log(data);
        return;
      }
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
        if (!isDiff || diffTime < 300) return;
        overwrite = isDiff;
        hashMap[data?.uri].data = message.data;
        hashMap[data?.uri].time = now;
      }

      overwrite && webSocketEventHashMap[data?.uri] && webSocketEventHashMap[data?.uri](data);
    },
  });

  return { disconnect, sendMessage, readyState };
};
export default useVision;
