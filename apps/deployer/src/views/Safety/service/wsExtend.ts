import pako from 'pako';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../store/safety.store';

function unzipText(str) {
  return pako.ungzip(
    Uint8Array.from(atob(str), (c) => c.charCodeAt(0)),
    { to: 'string' },
  );
}

export default function useHybirdWsExtend() {
  const { setObsInfo, setSeniorPoints, setGoodsInfo, setTurnRegionData, setMotionStatus } = useSafetyStore(
    useShallow((store) => ({
      setObsInfo: store.setObsInfo,
      setSeniorPoints: store.setSeniorPoints,
      setGoodsInfo: store.setGoodsInfo,
      setTurnRegionData: store.setTurnRegionData,
      setMotionStatus: store.setMotionStatus,
    })),
  );

  return {
    '/sirius/topics/safety_obs_info': (data: any) => {
      // 这里不做阈值处理
      setObsInfo(data);
    },
    '/sirius/topics/compose_sensor_point': (data: any) => {
      // 避障点云
      if (data.points) {
        // const decompressedData = unzipText(data.points);
        const decompressedData = typeof data?.point_cloud === 'object' ? data?.points : unzipText(data?.points);
        setSeniorPoints(decompressedData ?? []);
      }
    },
    '/sirius/topics/goods_info': (data: any) => {
      // 货物信息
      setGoodsInfo(data);
    },
    '/sirius/topics/safety_protect_region': (data: any) => {
      //转弯区域
      setTurnRegionData(data.points || []);
    },
    '/sirius/topics/task_status_motion': (data: any) => {
      // 车辆状态
      setMotionStatus(data.motion_state);
    },
  };
}
