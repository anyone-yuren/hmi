import { isEqual } from 'lodash-es';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useGlobalStore } from './globalStore';
interface State {
  power: number;
  setPower: (power: number) => void;
  seniorPoints: any[];
  setSeniorPoints: (seniorPoints: any[]) => void;
  auto_manual_status: number;
  setAutoManualStatus: (auto_manual_status: number) => void;
}
export const useVehicleStore = create<State>()(
  persist(
    (set, get) => ({
      power: 0,
      setPower: (power: number) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave) {
          set({ power });
        }
      },
      seniorPoints: [],
      setSeniorPoints: (seniorPoints: any[]) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave) {
          set({ seniorPoints });
        }
      },
      auto_manual_status: 0,
      setAutoManualStatus: (auto_manual_status: number) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave && !isEqual(auto_manual_status, get().auto_manual_status)) {
          set({ auto_manual_status });
        }
      },
    }),
    {
      name: 'vehicle-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
