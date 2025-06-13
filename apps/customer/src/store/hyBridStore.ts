import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
interface State {
  agvPosition: any;
  setAgvPosition: (agvPosition: any) => void;
}
export const useHybridStore = create<State>()(
  persist(
    (set) => ({
      agvPosition: {},
      setAgvPosition: (agvPosition: any) =>
        set((state) => ({
          agvPosition: agvPosition,
        })),
    }),
    {
      name: 'hybrid-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
