import pako from 'pako';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../store/safety.store';

function unzipText(str) {
  return pako.ungzip(
    Uint8Array.from(atob(str), (c) => c.charCodeAt(0)),
    { to: 'string' },
  );
}
let lastUpdateTime = 0;
export default function useHybirdWsExtend() {
  const {
    setObsInfo,
    setSeniorPoints,
    setGoodsInfo,
    setTurnRegionData,
    setMotionStatus,
    setForksHeight,
    setSensorPoints,
    setAllSensorPoints,
  } = useSafetyStore(
    useShallow((store) => ({
      setObsInfo: store.setObsInfo,
      setSeniorPoints: store.setSeniorPoints,
      setGoodsInfo: store.setGoodsInfo,
      setTurnRegionData: store.setTurnRegionData,
      setMotionStatus: store.setMotionStatus,
      setForksHeight: store.setForksHeight,
      setSensorPoints: store.setSensorPoints,
      setAllSensorPoints: store.setAllSensorPoints,
    })),
  );

  return {
    '/sirius/topics/safety_obs_info': (data: any) => {
      // 这里不做阈值处理
      const { timestamp, ...rest } = data;
      setObsInfo(rest);
    },
    '/sirius/topics/safety_compose_sensor_points': (data: any) => {
      // 避障点云
      if (data.points) {
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
    '/sirius/topics/robot_status_forkarm': (data: any) => {
      // 叉臂高度 data?.z 后面看看要不要加判断
      setForksHeight(data?.z || 0);
    },
    '/set_sensor_points': (key, data) => {
      const decompressedData = typeof data?.data === 'object' ? data?.data : JSON.parse(unzipText(data?.data || ''));
      setSensorPoints(key, decompressedData);
    },
    // 更新全部传感器点云的 先不开放
    '/set_all_sensor_points': (data) => {
      const now = new Date().getTime();
      const timeInterval = lastUpdateTime ? (now - lastUpdateTime) / 1000 : 0;

      const obj: any = {};
      Object.keys(data).forEach((key) => {
        const decompressedData =
          typeof data[key]?.data === 'object' ? data[key]?.data : JSON.parse(unzipText(data[key]?.data || ''));
        obj[key] = decompressedData;
      });
      setAllSensorPoints(obj);
    },
  };
}
