import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
  floorData: any;
  mapLoading: boolean;
  setFloorData: (floorData: any) => void;
  setMapLoading: (loading: boolean) => void;
  robot_current_status: {
    floor_number?: number;
    navi_status?: number;
    navigation_type?: number;
    system_status?: number;
  };
  agvPosition: any;
  setAgvPosition: (position: any) => void;
  setRobotCurrentStatus: (status: any) => void;
  scan_head: any;
  setScanHead: (scan_head: any) => void;

  // 底部 反光板导航 选项
  reflectorType: string;
  setReflectorType: (type: string) => void;
  isSettled: boolean; // 是否按下镇定按钮
  setIsSettled: (bol: boolean) => void;

  // 场景实例
  hybirdStage: any;
  setHybirdStage: (hybirdStage: any) => void;
  // 新建slam与扩展地图数据
  addSlamMappingData: any;
  setAddSlamMappingData: (data: any) => void;

  // 当前反光板地图
  currentReflectors: any[];
  setCurrentReflectors: (map: any) => void;
  // 当前匹配成功的反光板
  matchedReflectors: any[];
  setMatchedReflectors: (reflectors: any) => void;
  // 当前未匹配成功的反光板
  mismatchedReflectors: any[];
  setMismatchedReflectors: (reflectors: any) => void;

  showFloor: boolean;
  setShowFloor: (bol: boolean) => void;

  // 触摸点
  startTouch: any;
  setStartTouch: (startTouch: any) => void;

  // 旋转车辆位置
  vehiclePosition: any;
  setVehiclePosition: (position: any) => void;

  // 开始重定位
  beginPose: boolean;
  setBeginPose: (bol: boolean) => void;

  // 显示定位的agv
  showAgv: boolean;
  setShowAgv: (bol: boolean) => void;

  stagePos: any;

  setStagePos: (pos: any) => void;

  // 开启点云
  showPointCloud: boolean;
  setShowPointCloud: (newData: any) => void;

  showPointCloudDiag: boolean;
  setShowPointCloudDiag: (bol: boolean) => void;

  // 刷新当前楼层数据
  refreshFloorData: boolean;
  setRefreshFloorData: () => void;

  // 扩展地图过程中不变的底图
  slam_frozen_map: any;
  setSlamFrozenMap: (map: any) => void;

  // 点云 雷达是否可见
  radarVisible: boolean;
  setRadarVisible: (visible: boolean) => void;

  stageScale: number;
  // 设置舞台缩放
  setStageScale: (scale: number) => void;

  // 导航类型
  navigationType: any;
  setNavigationType: (type: any) => void;
  // 覆盖当前楼层数据
  setCoverFloorData: (key: string, value: any) => void;

  setPointCloudV1Data: (data: any) => void;
  pointCloudV1Data: any;
  onlineData: any;
  setOnlineData: (data: any) => void;
  qrCodeData: any;
  setQrCodeData: (data: any) => void;
  wsState: any;
  setWsState: (data: any) => void;
}

export const useHybirdStore = create<State>()(
  persist(
    (set) => ({
      floorData: {},
      mapLoading: true,
      robot_current_status: {},
      agvPosition: {},
      scan_head: {},
      showFloor: false,
      stageScale: 1,
      setStageScale: (scale: number) => set({ stageScale: scale }),
      setShowFloor: (bol: boolean) => set({ showFloor: bol }),
      refreshFloorData: false,
      setRefreshFloorData: () =>
        set((state) => {
          return { refreshFloorData: !state.refreshFloorData };
        }),
      reflectorType: '',
      setReflectorType: (type: string) => set({ reflectorType: type }),
      isSettled: false,
      setIsSettled: (bol: boolean) => set({ isSettled: bol }),

      radarVisible: true,
      setRadarVisible: (visible: boolean = true) => set({ radarVisible: visible }),

      currentReflectors: [],
      setCurrentReflectors: (map: any) => set({ currentReflectors: map }),
      matchedReflectors: [],
      setMatchedReflectors: (reflectors: any) => set({ matchedReflectors: reflectors }),
      mismatchedReflectors: [],
      setMismatchedReflectors: (reflectors: any) => set({ mismatchedReflectors: reflectors }),

      hybirdStage: null,
      addSlamMappingData: {},
      startTouch: { x: 0, y: 0 },
      setStartTouch: (startTouch: any) => set({ startTouch }),
      vehiclePosition: { x: 0, y: 0, rotation: 0 },
      setVehiclePosition: (position: any) => set({ vehiclePosition: position }),
      setAddSlamMappingData: (data: any) => set({ addSlamMappingData: data }),
      setHybirdStage: (hybirdStage: any) => set({ hybirdStage }),
      setScanHead: (newData: any) => {
        set((state) => {
          return { scan_head: newData };
          const { pose } = newData;
          if (!pose) {
            return state;
          }
          const { pose: poseState } = state.scan_head;
          const previousX = poseState?.x ?? 0;
          const previousY = poseState?.y ?? 0;
          const diffX = Math.abs(newData.pose.x - previousX);
          const diffY = Math.abs(newData.pose.y - previousY);
          return { scan_head: newData };

          // 仅当差值超过阈值时更新数据
          if (diffX > 0.1 || diffY > 0.1) {
            return { scan_head: newData };
          }
          return state;
        });
      },
      setFloorData: (floorData: any) => set({ floorData }),
      setCoverFloorData: (key: string, value: any) => {
        set((state) => {
          const { floorData } = state;

          return {
            floorData: {
              ...(floorData ?? {}),
              [key]: value,
            },
          };
        });
      },
      setMapLoading: (loading: boolean) => set({ mapLoading: loading }),
      setRobotCurrentStatus: (status: any) =>
        set((state) => {
          const { robot_current_status } = state;
          // 新旧值对比，有变化时更新
          if (JSON.stringify(robot_current_status) !== JSON.stringify(status)) {
            return { robot_current_status: status };
          }
          return state;
        }),
      setAgvPosition: (position: any) => {
        set((state) => {
          return { agvPosition: position };
          const { angel, x, y } = state.agvPosition;
          const diffX = Math.abs(position.x - x);
          const diffY = Math.abs(position.y - y);
          // 仅当差值超过阈值时更新数据
          if (diffX > 10 || diffY > 10) {
            return { agvPosition: position };
          }
          return state;
        });
      },
      beginPose: false,
      setBeginPose: (bol: boolean) => set({ beginPose: bol }),
      showAgv: false,
      setShowAgv: (bol: boolean) => set({ showAgv: bol }),
      showPointCloud: false,
      setShowPointCloud: (bol: boolean) => set({ showPointCloud: bol }),
      showPointCloudDiag: false,
      setShowPointCloudDiag: (bol: boolean) => set({ showPointCloudDiag: bol }),

      slam_frozen_map: {},
      setSlamFrozenMap: (map: any) => set({ slam_frozen_map: map }),
      stagePos: { x: 0, y: 0 },
      setStagePos: (stagePos: any) => set({ stagePos }),
      navigationType: 0,
      setNavigationType: (type: number) => set({ navigationType: type }),
      pointCloudV1Data: [],
      setPointCloudV1Data: (data: any) => {
        set({ pointCloudV1Data: data });
      },
      onlineData: [],
      setOnlineData: (data: any) => set({ onlineData: data }),
      qrCodeData: {},
      setQrCodeData: (data: any) => set({ qrCodeData: data }),
      wsState: 0,
      setWsState: (data: any) => set({ wsState: data }),
    }),
    {
      name: 'hybird-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        delete state.pointCloudV1Data;
        return state;
      },
    },
  ),
);
