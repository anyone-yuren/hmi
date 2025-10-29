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
  sessionTimeout: number;
  timer: any | null; // 存储定时器引用
  resetSessionTimeout: () => void;
  rememberUser: boolean;
  setRememberUser: () => void;

  // 车辆类型
  avgType: string;
  setAvgType: (avgType: string) => void;
  // 显示充电弹窗
  showChargingDialog: Boolean;
  setShowChargingDialog: (v: Boolean) => void;

  closeChargingTime: number; // 关闭充电弹窗的时间
  setCloseChargingTime: (closeChargingTime: number) => void;
}
export const useGlobalStore = create<State>()(
  persist(
    (set, get) => {
      return {
        sessionTimeout: 60 * 60 * 1000,
        showAnimate: false,
        setShowAnimate: (showAnimate: boolean) => set({ showAnimate }),
        cacheSave: true,
        setCacheSave: (cacheSave: boolean) => set({ cacheSave }),
        showThree: false,
        setShowThree: (showThree: boolean) => set({ showThree }),
        token: "",
        timer: null, // 初始化定时器为null
        setToken: (token: string) => {
          // 清除已有定时器
          if (get().timer) {
            clearTimeout(get().timer);
          }
          set({ token });
          // 创建新定时器并存储引用
          if (token && get().rememberUser) {
            const timer = setTimeout(() => {
              set({ token: "", timer: null });
            }, get().sessionTimeout);
            set({ timer });
          }
        },
        // 重置计时器
        resetSessionTimeout: () => {
          if (!get().rememberUser) {
            return;
          }
          const { token, sessionTimeout, timer } = get();
          if (token) {
            if (timer) {
              clearTimeout(timer);
            }
            // 创建新定时器并存储引用
            const newTimer = setTimeout(() => {
              set({ token: "", timer: null });
            }, sessionTimeout);
            set({ timer: newTimer });
          }
        },
        // 车辆类型
        avgType: "",
        setAvgType: (avgType: string) => set({ avgType }),

        showChargingDialog: false,
        setShowChargingDialog: (v) => set({ showChargingDialog: v }),

        closeChargingTime: 0,
        setCloseChargingTime: (closeChargingTime: number) =>
          set({ closeChargingTime }),
        rememberUser: false,
        setRememberUser: (isRememberUser: boolean) =>
          set({ rememberUser: isRememberUser }),
      };
    },
    {
      name: "global-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
