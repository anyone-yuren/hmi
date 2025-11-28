import { isEqual } from 'lodash';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
  setting: boolean;
  setSetting: (bol: any) => void;
  obstacleData: {
    stop_distance_forward_empty: number;
    stop_distance_backward_empty: number;
    stop_distance_left_empty: number;
    stop_distance_right_empty: number;
    spinStopAngle: number;
    stop_region_left: number;
    stop_region_right: number;
  };
  setObstacleData: (data: any) => void;
  obsInfo: any;
  setObsInfo: (data: any) => void;
  seniorPoints: any[];
  setSeniorPoints: (data: any) => void;
  // goodsInfo: any;
  // setGoodsInfo: (data: any) => void;
  showPointCloud: boolean;
  setShowPointCloud: (data: any) => void;
  cloudCategory: Array<any>;
  setCloudCategory: (data: any) => void;
  // 转弯区域数据
  turnRegionData: any;
  setTurnRegionData: (data: any) => void;
  // 车辆状态
  motionStatus: number;
  setMotionStatus: (data: any) => void;

  forksHeight: number;
  setForksHeight: (data: number) => void;

  sensorPointsKey: any[];
  setSensorPointsKey: (data: any) => void;

  isDensePointCloud: boolean;
  setIsDensePointCloud: (isDensePointCloud: boolean) => void;

  sensorPoints: {};
  setSensorPoints: (key: string, data: any) => void;
  setAllSensorPoints: (sensorPoints: any) => void;
  clearSensorPoints: () => void;

  pointCloudFilter: {
    minY: number;
    maxY: number;
  };
  setPointCloudFilter: (data) => void;
}

export const useSafetyStore = create<State>()(
  persist(
    (set, get) => ({
      setting: false,
      setSetting: (bol) => set({ setting: bol }),
      obstacleData: {
        stop_distance_forward_empty: 0.3,
        stop_distance_backward_empty: 0.3,
        stop_distance_left_empty: 0.3,
        stop_distance_right_empty: 0.3,
        spinStopAngle: 0.3,
        stop_region_left: 0.3,
        stop_region_right: 0.3,
      },
      setObstacleData: (data) => set({ obstacleData: data }),
      obsInfo: {},
      setObsInfo: (data) => {
        // 使用lodash isEqual与对象比较
        if (!isEqual(data, get().obsInfo)) {
          set({ obsInfo: data });
        }
      },
      seniorPoints: [],
      setSeniorPoints: (data) => set({ seniorPoints: data }),
      // goodsInfo: {},
      // setGoodsInfo: (data) => set({ goodsInfo: data }),
      showPointCloud: false,
      setShowPointCloud: (data) => set({ showPointCloud: data }),
      cloudCategory: [],
      setCloudCategory: (data) => set({ cloudCategory: data }),
      turnRegionData: [],
      setTurnRegionData: (data) => set({ turnRegionData: data }),
      motionStatus: 0,
      setMotionStatus: (data) => set({ motionStatus: data }),
      forksHeight: 0,
      setForksHeight: (data) => set({ forksHeight: data }),
      sensorPointsKey: [],
      setSensorPointsKey: (data) => {
        const isDense = get().isDensePointCloud;
        const keys = !isDense ? data?.map((item) => `/sirius/topics/${item}`) : data;
        set({ sensorPointsKey: keys });
      },
      isDensePointCloud: false,
      setIsDensePointCloud: (isDensePointCloud: boolean) => set({ isDensePointCloud }),
      sensorPoints: {},
      setSensorPoints: (key, data) => set({ sensorPoints: { ...get().sensorPoints, [key]: data } }),
      setAllSensorPoints: (sensorPoints) => set({ sensorPoints }),
      clearSensorPoints: () => set({ sensorPoints: {} }),

      pointCloudFilter: {
        mixY: 0,
        maxY: 100,
      },
      setPointCloudFilter: (pointCloudFilter) => set({ pointCloudFilter }),
    }),
    {
      name: 'safety-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
