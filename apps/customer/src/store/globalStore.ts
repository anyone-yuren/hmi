import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
interface State {
  showAnimate: boolean;
  setShowAnimate: (showAnimate: boolean) => void;
  cacheSave: boolean;
  setCacheSave: (cacheSave: boolean) => void;
  showThree: boolean;
  setShowThree: (showThree: boolean) => void;
}
export const useGlobalStore = create<State>()(
  persist(
    (set) => ({
      showAnimate: false,
      setShowAnimate: (showAnimate: boolean) => set({ showAnimate }),
      cacheSave: false,
      setCacheSave: (cacheSave: boolean) => set({ cacheSave }),
      showThree: false,
      setShowThree: (showThree: boolean) => set({ showThree }),
    }),
    {
      name: 'global-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
