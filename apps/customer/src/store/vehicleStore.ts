import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
interface State {
  power: number;
  setPower: (power: number) => void;
}
export const useVehicleStore = create<State>()(
  persist(
    (set) => ({
      power: 0,
      setPower: (power: number) => set({ power }),
    }),
    {
      name: 'vehicle-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
