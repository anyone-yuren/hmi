import isEqual from 'lodash-es/isEqual';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useGlobalStore } from './globalStore';

interface State {
  agvPosition: any;
  setAgvPosition: (agvPosition: any) => void;
  // 定位状态
  robotStatus: {
    floor_number: number;
    navi_status: number;
    navigation_type: number;
    system_status: number;
  };
  setRobotStatus: (robotStatus: State['robotStatus']) => void;
}

export const useHybridStore = create<State>()(
  persist(
    (set, get) => ({
      agvPosition: {},
      setAgvPosition: (agvPosition: any) => {
        const { cacheSave } = useGlobalStore.getState();
        const currentPosition = get().agvPosition;
        // 如果缓存开关开着，且值有变化，才更新
        if (cacheSave && !isEqual(agvPosition, currentPosition)) {
          set(() => ({
            agvPosition,
          }));
        }
      },
      robotStatus: {
        floor_number: 0,
        navi_status: 0,
        navigation_type: 0,
        system_status: 0,
      },
      setRobotStatus: (robotStatus: State['robotStatus']) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave && !isEqual(robotStatus, get().robotStatus)) {
          set(() => ({
            robotStatus,
          }));
        }
      },
    }),
    {
      name: 'hybrid-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
