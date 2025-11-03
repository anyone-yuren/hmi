import { isEqual } from 'lodash';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  agvPosition: any;
  setAgvPosition: (position: any) => void;
  rcsInfo: any;
  setRcsInfo: (info: any) => void;
  refreshTaskList: number;
  setRefreshTaskList: (num: number) => void;
  cloudPoints: any;
  setCloudPoints: (cloudPoints: any) => void;
  robotCurrentStatus: any;
  setRobotCurrentStatus: (robotCurrentStatus: any) => void;
  realTimePoints: any;
  setRealTimePoints: (realTimePoints: any) => void;
  showRealTimePoints: boolean;
  setShowRealTimePoints: (showRealTimePoints: boolean) => void;
  agvViewLock: boolean;
  setAgvViewLock: (agvViewLock: boolean) => void;
  subscriptionFeedList: string[];
  setSubscriptionFeedList: (list: string[]) => void;
}

const storageOptions = {
  name: 'singleTask',
};

const localAndMapStore = (
  set: (
    partial: State | Partial<State> | ((state: State) => State | Partial<State>),
    replace?: boolean | undefined,
  ) => void,
  get: () => State,
) => ({
  agvPosition: { x: 0, y: 0, angel: 0 },
  setAgvPosition: (position: any) => {
    if (!isEqual(position, get().agvPosition)) {
      set({ agvPosition: position });
    }
  },

  refreshTaskList: 0,
  setRefreshTaskList: (count: number) => {
    set({ refreshTaskList: count });
  },

  rcsInfo: {},
  setRcsInfo: (info: any) => {
    if (!isEqual(info, get().rcsInfo)) {
      set({ rcsInfo: info });
    }
  },

  cloudPoints: {},
  setCloudPoints: (cloudPoints: any) => {
    if (!isEqual(cloudPoints, get().cloudPoints)) {
      set({ cloudPoints: cloudPoints });
    }
  },
  robotCurrentStatus: {},
  setRobotCurrentStatus: (robotCurrentStatus) => {
    if (!isEqual(robotCurrentStatus, get().robotCurrentStatus)) {
      set({ robotCurrentStatus });
    }
  },
  realTimePoints: [],
  setRealTimePoints: (realTimePoints) => {
    if (!isEqual(realTimePoints, get().realTimePoints)) {
      set({ realTimePoints });
    }
  },

  showRealTimePoints: true,
  setShowRealTimePoints: (showRealTimePoints: boolean) => {
    set({ showRealTimePoints });
  },

  agvViewLock: true,
  setAgvViewLock: (agvViewLock: boolean) => {
    set({ agvViewLock });
  },

  subscriptionFeedList: [],
  setSubscriptionFeedList: (list: string[]) => {
    set({ subscriptionFeedList: list });
  },
});

export const useSingleTaskStore = create<State>()(persist(localAndMapStore, storageOptions));
