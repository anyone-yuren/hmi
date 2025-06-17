import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
interface State {}
export const useVehicleStore = create<State>()(
  persist((set) => ({}), {
    name: 'vehicle-store',
    storage: createJSONStorage(() => localStorage),
  }),
);
