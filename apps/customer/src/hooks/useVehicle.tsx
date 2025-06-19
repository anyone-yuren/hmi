import { useVehicleStore } from '@/store/vehicleStore';
import { useWebSocket } from 'ahooks';
import YAML from 'js-yaml';
import { useShallow } from 'zustand/react/shallow';

// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const HYBRID_URL = import.meta.env.DEV
  ? '/ws10009' // 开发环境使用代理
  : `ws://${currentHost}:10009`; // 生产环境使用真实地址

export const useVehicle = () => {
  const { setPower, setSeniorPoints } = useVehicleStore(
    useShallow((state) => ({
      setPower: state.setPower,
      setSeniorPoints: state.setSeniorPoints,
    })),
  );
  const { sendMessage, latestMessage, readyState } = useWebSocket(HYBRID_URL, {
    reconnectLimit: 10,
    reconnectInterval: 5000,
    onMessage: (e) => {
      // if (!e?.data || !e?.data.includes('{')) return;
      // const data = JSON.parse(e.data);
      // if (data?.uri === '/navigation/robot_status_localizer_result') {
      // }
      if (e?.data?.includes('/sirius/topics/robot_status_battery')) {
        const data = YAML.load(e?.data);
        if (data) {
          setPower(Math.round(data?.power));
        }
      }
      if (e?.data?.includes('/sirius/topics/compose_sensor_point')) {
        const data = JSON.parse(e?.data);
        setSeniorPoints(data?.points);
      }
    },
  });
};
