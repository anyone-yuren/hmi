import { useHybridStore } from '@/store/hyBridStore';
import { useWebSocket } from 'ahooks';
import { useShallow } from 'zustand/react/shallow';

// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const HYBRID_URL = import.meta.env.DEV
  ? '/ws10001' // 开发环境使用代理
  : `ws://${currentHost}:10001`; // 生产环境使用真实地址

export const useHybrid = () => {
  const { setAgvPosition, agvPosition } = useHybridStore(
    useShallow((state) => ({
      setAgvPosition: state.setAgvPosition,
      agvPosition: state.agvPosition,
    })),
  );
  const { sendMessage, latestMessage, readyState } = useWebSocket(HYBRID_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage: (e) => {
      const data = JSON.parse(e?.data);
      if (data?.uri === '/navigation/robot_status_localizer_result') {
        data.pose.x = data.pose.x * 1000;
        data.pose.y = data.pose.y * 1000;

        const diffX = Math.abs(data.pose.x - agvPosition.x);
        const diffY = Math.abs(data.pose.y - agvPosition.y);

        if (diffX > 5 || diffY > 5) {
          setAgvPosition({
            angel: data.pose.theta,
            x: data.pose.x,
            y: data.pose.y,
          });
        }
      }
    },
  });
};
