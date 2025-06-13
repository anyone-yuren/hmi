import { useHybridStore } from '@/store/hyBridStore';
import { useWebSocket } from 'ahooks';
import { useShallow } from 'zustand/react/shallow';

const HYBRID_URL = 'ws://192.168.2.233:10001';

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
      const data = JSON.parse(e.data);
      if (data?.uri === '/navigation/robot_status_localizer_result') {
        data.pose.x = data.pose.x * 1000;
        data.pose.y = data.pose.y * 1000;

        const diffX = Math.abs(data.pose.x - agvPosition.x);
        const diffY = Math.abs(data.pose.y - agvPosition.y);

        if (diffX > 10 || diffY > 10) {
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
