import isEqual from 'lodash-es/isEqual';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
  // 显示的策略数组
  displayStrategies: any[];
  setDisplayStrategies: (displayStrategies: any[]) => void;
  selectMeshName: string;
  setSelectMeshName: (selectMeshName: string) => void;
  showStrategies: boolean;
  setShowStrategies: (showStrategies: boolean) => void;
}

export const useSafetyStore = create<State>()(
  persist(
    (set, get) => ({
      // 显示的策略数组
      displayStrategies: [],
      setDisplayStrategies: (displayStrategies: any[]) => {
        const currentDisplayStrategies = get().displayStrategies;
        // 如果缓存开关开着，且值有变化，才更新
        if (!isEqual(displayStrategies, currentDisplayStrategies)) {
          set(() => ({
            displayStrategies,
          }));
        }
      },
      selectMeshName: '',
      setSelectMeshName: (selectMeshName: string) => {
        set(() => ({
          selectMeshName,
        }));
      },
      showStrategies: false,
      setShowStrategies: (showStrategies: boolean) => {
        set(() => ({
          showStrategies,
        }));
      },
    }),
    {
      name: 'safety-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
