import { useRcs2DGlobalStore } from '@gbeata/store';
import _ from 'lodash';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

type TSignalVehicle = {
  vehicleNum: number;
  x: number;
  y: number;
  z: number;
  angle: number;
  speed: number;
  elecQuantity: number;
  energyState: number;
  controlState: number;
  deviceState: number;
  isInSystem: boolean;
  isHasGoods: boolean;
  trafficControlCar: number;
  isFree: boolean;
  abnormalState: number;
  emergencyStatus: number;
  schedulingStatus: number;
  outlineX1: number;
  outlineY1: number;
  outlineX2: number;
  outlineY2: number;
  image: string;
  tracks: Array<{
    index: number;
    routeKey: number;
    offSet: number;
    genus: number;
    state: number;
    direction: number;
    speed: number;
    length: number;
    variableBits: number;
    isHoldFork: boolean;
    hasEvent: boolean;
    events: Array<any>;
    floorCurrent: number;
    floorTarget: number;
  }>;
};

type TSignalMonitorMessage = {
  agvUtilization: {
    labels: Array<string>;
    values: Array<{
      title: string;
      list: Array<number>;
    }>;
  };
  agvAbnormal: Array<{
    vehicleNum: number;
    duration: number;
    abnormalCode: number;
    routeType: number;
    routeKey: number;
    abnormalType: number;
    missionId: any;
    subMissionId: any;
  }>;
  agvMission: {
    agvMissionList: Array<{
      id: number;
      taskQty: number;
      consumeTime: number;
      average: number;
    }>;
    completed: number;
    uncompleted: number;
  };
  agvStates: {
    onlineCount: number;
    offlineCount: number;
    freeCount: number;
    abnormalCount: number;
  };
  vehicleStates: {
    onlineCount: number;
    offlineCount: number;
    freeCount: number;
    abnormalCount: number;
  };
  agvRunTime: Array<{
    freeTime: number;
    workTime: number;
    errorTime: number;
    trafficTime: number;
    chargeTime: number;
    averageTask: number;
    id: number;
    taskQty: number;
    consumeTime: number;
    average: number;
  }>;
};

type TSignalRState = {
  activationMessage?: string;
  vehicles?: TSignalVehicle[];
  vehicleHashMap?: Record<string, any>;
  monitorMessage: TSignalMonitorMessage | any;
  shuttleStateHashMap?: Record<string, any>;
  shuttleStateList?: any[];
  vehiclesList?: any[];
  wssLocationStateHashMap: Record<string, any>;
  ChargingStationState: any;
};

type TSignalRAction = {
  setActivationMessage: (activationMessage: string) => void;
  updateVehicles: (device: TSignalRState['vehicles']) => void;
  updateVehiclesMap: (key: string, vehicleHashMap: any) => void;
  updateMonitorMessage: (message: TSignalRState['monitorMessage']) => void;
  updateVehiclesList: (vehiclesList: any) => void;
  setWssLocationStateHashMap: (wssLocationStateHashMap: Record<string, any>) => void;
  updateChargingStationState: (ChargingStationState: any) => void;
};

export const useSignalRStore = createWithEqualityFn<TSignalRState & TSignalRAction>(
  (set, get) => ({
    activationMessage: '',
    setActivationMessage: (activationMessage: string) => {
      set({ activationMessage });
    },
    vehicles: [],
    vehicleHashMap: {},
    monitorMessage: {
      agvUtilization: {
        labels: [],
        values: [],
      },
      agvAbnormal: [],
      agvMission: {
        agvMissionList: [],
        completed: 0,
        uncompleted: 0,
      },

      agvStates: {
        onlineCount: 0,
        offlineCount: 0,
        freeCount: 0,
        abnormalCount: 0,
      },
      vehicleStates: {
        onlineCount: 0,
        offlineCount: 0,
        freeCount: 0,
        abnormalCount: 0,
      },
      agvRunTime: [],
    },
    updateVehicles: (vehicles) => {
      const ary = get().vehicles;
      if (vehicles?.length === 0) {
        useRcs2DGlobalStore.getState().setVehicleList([]);
      }
      // 暂时先判断为空,车辆动了就有数据,不动的话刷新的时候没有数据。看看如何解决
      if (_.isEqual(ary, vehicles)) {
        // console.log('[signalIR]: 车辆数据不改变,不必渲染');
        return;
      }
      // console.log('[signalIR]:是否有设置vehicles', vehicles);
      useRcs2DGlobalStore.getState().setVehicleList(vehicles);
      set({ vehicles });
    },
    updateVehiclesMap: (key, vehicleHashMap) => {
      const hashMap = get().vehicleHashMap;
      set({ vehicleHashMap: { ...hashMap, [key]: vehicleHashMap } });
    },
    updateMonitorMessage: (monitorMessage) => set({ monitorMessage }),
    shuttleStateHashMap: {},
    shuttleStateList: [],
    updateShuttleStateMessage: (shuttleState) => {
      // 覆盖掉
      const hashMap = { ...get().shuttleStateHashMap };
      // shuttleState 直接全覆盖，判断个jier
      shuttleState.forEach((item: any) => {
        item?.vehicleNum && (hashMap[item?.vehicleNum] = item);
      });
      set({ shuttleStateHashMap: hashMap, shuttleStateList: Object.keys(hashMap) });
    },
    vehiclesList: [],
    updateVehiclesList: (vehiclesList) => {
      set({ vehiclesList });
    },
    wssLocationStateHashMap: {},
    setWssLocationStateHashMap: (wssLocationStateHashMap) => {
      console.log('wssLocationStateHashMap', wssLocationStateHashMap);
      set({ wssLocationStateHashMap });
      useRcs2DGlobalStore.getState().setWssLocationStateHashMap(wssLocationStateHashMap);
    },
    ChargingStationState: [],
    updateChargingStationState: (data: any) => {
      set({ ChargingStationState: data });
    },
  }),
  shallow,
);
