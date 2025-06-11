import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

// 没用的东西全干掉，目前保存的是rcs的首页监控的
type TSignalRState = {
  monitorMessage: any;
};

type TSignalRAction = {
  updateMonitorMessage: (message: TSignalRState["monitorMessage"]) => void;
};

export const useMonitorSignalRStore = createWithEqualityFn<
  TSignalRState & TSignalRAction
>(
  (set, get) => ({
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
    updateMonitorMessage: (monitorMessage) => set({ monitorMessage }),
  }),
  shallow
);
