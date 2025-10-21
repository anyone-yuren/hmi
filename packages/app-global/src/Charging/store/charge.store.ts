import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
  robotChangeInfo: any;
  setRobotChangeInfo: (data: any) => void;
}

export const useChargeStore = create<State>()(
  persist(
    (set, get) => ({
      // "last_full_battery_time" : 1753866180528,  //上次满电时间
      // "charging_times" : 13,                    //充电次数
      // "charging_degree" : 5.6, // 充电度数
      robotChangeInfo: {
        last_full_battery_time: 0,
        charging_times: 0,
        charging_degree: 0,
      },
      setRobotChangeInfo: (robotChangeInfo: any) => {
        set({ robotChangeInfo });
      },
    }),
    {
      name: 'charge-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
