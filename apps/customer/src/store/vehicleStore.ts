import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useGlobalStore } from './globalStore';
interface State {
  power: number;
  setPower: (power: number) => void;
  seniorPoints: any[];
  setSeniorPoints: (seniorPoints: any[]) => void;
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
    }),
    {
      name: 'vehicle-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
