import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface State {
  showAnimate: boolean;
  setShowAnimate: (showAnimate: boolean) => void;
  cacheSave: boolean;
  setCacheSave: (cacheSave: boolean) => void;
  showThree: boolean;
  setShowThree: (showThree: boolean) => void;
  token: string;
  setToken: (token: string) => void;
}
export const useGlobalStore = create<State>()(
  persist(
    (set) => ({
      showAnimate: false,
      setShowAnimate: (showAnimate: boolean) => set({ showAnimate }),
      cacheSave: true,
      setCacheSave: (cacheSave: boolean) => set({ cacheSave }),
      showThree: false,
      setShowThree: (showThree: boolean) => set({ showThree }),
      token: "",
      setToken: (token: string) => set({ token }),
    }),
    {
      name: "global-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
