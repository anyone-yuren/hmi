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
  const { setObsInfo, setSeniorPoints, setGoodsInfo, setTurnRegionData, setMotionStatus, setForksHeight } =
    useSafetyStore(
      useShallow((store) => ({
        setObsInfo: store.setObsInfo,
        setSeniorPoints: store.setSeniorPoints,
        setGoodsInfo: store.setGoodsInfo,
        setTurnRegionData: store.setTurnRegionData,
        setMotionStatus: store.setMotionStatus,
        setForksHeight: store.setForksHeight,
      })),
    );

  return {
    '/sirius/topics/safety_obs_info': (data: any) => {
      // 这里不做阈值处理
      const { timestamp, ...rest } = data;
      setObsInfo(rest);
    },
    '/sirius/topics/compose_sensor_point': (data: any) => {
      // 避障点云
      if (data.points) {
        // const decompressedData = unzipText(data.points);
        const decompressedData = typeof data?.point_cloud === 'object' ? data?.points : unzipText(data?.points);
        console.log('避障点云数据长度', decompressedData);
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
    '/sirius/topics/robot_status_forkarm': (data: any) => {
      // 叉臂高度 data?.z 后面看看要不要加判断
      setForksHeight(data?.z || 0);
    },
  };
}
