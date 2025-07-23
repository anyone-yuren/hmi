import { isEqual } from 'lodash-es';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useGlobalStore } from './globalStore';
interface State {
  powerStatus: {
    power: number;
    charge_status: number;
  };
  setPowerStatus: (powerStatus: { power: number; charge_status: number }) => any;
  seniorPoints: any[];
  setSeniorPoints: (seniorPoints: any[]) => void;
  auto_manual_status: number;
  setAutoManualStatus: (auto_manual_status: number) => void;
}
export const useVehicleStore = create<State>()(
  persist(
    (set, get) => ({
      powerStatus: {
        power: 0,
        charge_status: 0,
      },
      setPowerStatus: (powerStatus: { power: number; charge_status: number }) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave) {
          set({ powerStatus });
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
