import { useVehicleStore } from '@gbeata/store';
import { useWebSocket } from 'ahooks';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

// 动态获取当前 host
const currentHost = window.location.hostname;
// 使用相对路径，Vite 会自动处理代理
const HYBRID_URL = import.meta.env.DEV
  ? '/ws10009' // 开发环境使用代理
  : `ws://${currentHost}:10009`; // 生产环境使用真实地址

export const useVehicle = () => {
  const {
    setPowerStatus,
    setSeniorPoints,
    setAutoManualStatus,
    setChargePileStatus,
    setSignal,
    setSystemDateTime,
    setRcsIsOnline,
  } = useVehicleStore(
    useShallow((state) => ({
      setPowerStatus: state.setPowerStatus,
      setSeniorPoints: state.setSeniorPoints,
      setAutoManualStatus: state.setAutoManualStatus,
      // 电池
      setChargePileStatus: state.setChargePileStatus,
      setSignal: state.setSignal,
      setSystemDateTime: state.setSystemDateTime,
      setRcsIsOnline: state.setRcsIsOnline,
    })),
  );
  const { sendMessage, latestMessage, readyState } = useWebSocket(HYBRID_URL, {
    reconnectLimit: Infinity, // 改为无限重连
    reconnectInterval: 5000,
    onMessage: (e) => {
      if (e?.data?.includes('subscribe')) return;

      if (e?.data?.includes('/sirius/topics/robot_status_battery')) {
        const data = JSON.parse(e?.data);
        if (data) {
          setPowerStatus({
            power: Math.round(data?.power),
            charge_status: Math.round(data?.charge_status),
          });
          setSystemDateTime(data?.timestamp);
        }
      }
      if (e?.data?.includes('/sirius/topics/robot_status_isensor')) {
        const data = JSON.parse(e?.data);

        if (data) {
          setAutoManualStatus(data?.auto_manual_status);
        }
      }
      if (e?.data?.includes('/sirius/topics/charge_pile_status')) {
        const data = JSON.parse(e?.data);
        if (data) {
          setChargePileStatus(data);
        }
      }
      if (e?.data?.includes('/sirius/topics/robot_status_signal')) {
        const data = JSON.parse(e?.data);
        if (data) {
          setSignal(data);
        }
      }
      if (e?.data?.includes('/sirius/topics/rcs_info')) {
        const data = JSON.parse(e?.data);
        if (data) {
          setRcsIsOnline(data?.is_online);
        }
      }
    },
  });

  useEffect(() => {
    if (readyState === 1) {
      sendMessage(
        JSON.stringify({
          uri: 'subscribe',
          topics: [
            '/sirius/topics/robot_status_battery',
            '/sirius/topics/robot_status_isensor',
            '/sirius/topics/charge_pile_status',
            '/sirius/topics/robot_status_signal',
            '/sirius/topics/rcs_info',
          ],
        }),
      );
    }
  }, [readyState, sendMessage]);
};
