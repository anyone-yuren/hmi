import { isEqual } from 'lodash';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
  agvPosition: Record<any, any>;
  setAgvPosition: (data: Record<any, any>) => void;
}

export const useHomeHybirdStore = create<State>()(
  persist(
    (set, get) => ({
      agvPosition: {
        angel: 0,
        x: 0,
        y: 0,
      },
      setAgvPosition: (agvPosition) => {
        if (!isEqual(agvPosition, get().agvPosition)) {
          set({ agvPosition: agvPosition });
        }
      },
    }),
    {
      name: 'home-hybird-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
