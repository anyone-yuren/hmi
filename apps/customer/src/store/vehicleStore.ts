import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
interface State {
  power: number;
  setPower: (power: number) => void;
  seniorPoints: any[];
  setSeniorPoints: (seniorPoints: any[]) => void;
}
export const useVehicleStore = create<State>()(
  persist(
    (set) => ({
      power: 0,
      setPower: (power: number) => set({ power }),
      seniorPoints: [],
      setSeniorPoints: (seniorPoints: any[]) => set({ seniorPoints }),
    }),
    {
      name: 'vehicle-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
