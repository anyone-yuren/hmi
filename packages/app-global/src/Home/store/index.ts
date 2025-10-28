import { isEqual } from 'lodash';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
  taskInfo: Record<any, any>;
  setTaskInfo: (data: Record<any, any>) => void;
  controlStatus: Record<any, any>;
  setControlStatus: (data: Record<any, any>) => void;
  robotCurrentStatus: Record<any, any>;
  setRobotCurrentStatus: (data: Record<any, any>) => void;
  // 输入光电信号
  robotIsensorStatus: Record<any, any>;
  setRobotIsensorStatus: (data: Record<any, any>) => void;

  // 车辆货物
  robotGoodsStatus: Record<any, any>;
  setRobotGoodsStatus: (data: Record<any, any>) => void;

  // 货叉位置
  robotForkarmStatus: Record<any, any>;
  setRobotForkarmStatus: (data: Record<any, any>) => void;

  // 雷达数据
  robotRadarStatus: Record<any, any>[];
  setRobotRadarStatus: (data: Record<any, any>[]) => void;
}

export const useHomeStore = create<State>()(
  persist(
    (set, get) => ({
      taskInfo: {},
      setTaskInfo: (data) => {
        // 使用lodash isEqual与对象比较
        if (!isEqual(data, get().taskInfo)) {
          set({ taskInfo: data });
        }
      },
      controlStatus: {},
      setControlStatus: (data) => {
        // 使用lodash isEqual与对象比较
        if (!isEqual(data, get().controlStatus)) {
          set({ controlStatus: data });
        }
      },
      robotCurrentStatus: {},
      setRobotCurrentStatus: (data) => {
        // 使用lodash isEqual与对象比较
        if (!isEqual(data, get().robotCurrentStatus)) {
          set({ robotCurrentStatus: data });
        }
      },
      robotIsensorStatus: {},
      setRobotIsensorStatus: (data) => {
        // 使用lodash isEqual与对象比较
        if (!isEqual(data, get().robotIsensorStatus)) {
          set({ robotIsensorStatus: data });
        }
      },
      robotGoodsStatus: {},
      setRobotGoodsStatus: (data) => {
        // 使用lodash isEqual与对象比较
        if (!isEqual(data, get().robotGoodsStatus)) {
          set({ robotGoodsStatus: data });
        }
      },
      robotForkarmStatus: {},
      setRobotForkarmStatus: (data) => {
        // 使用lodash isEqual与对象比较
        if (!isEqual(data, get().robotForkarmStatus)) {
          set({ robotForkarmStatus: data });
        }
      },
      robotRadarStatus: [],
      setRobotRadarStatus: (data) => {
        // 使用lodash isEqual与对象比较
        if (!isEqual(data, get().robotRadarStatus)) {
          set({ robotRadarStatus: data });
        }
      },
    }),
    {
      name: 'home-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
