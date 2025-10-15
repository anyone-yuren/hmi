import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
  // system_cpu_usage: number; //系统cpu占用率
  // process_cpu_usage: number; //当前程序cpu占用率
  // system_mem_usage: number; //系统内存使用率
  // process_mem_usage: number; //当前程序内存使用率
  systemUsage: any;
  setSystemUsage: (data: any) => void;
}

export const useAboutStore = create<State>()(
  persist(
    (set, get) => ({
      // system_cpu_usage: 0,
      // process_cpu_usage: 0,
      // system_mem_usage: 0,
      // process_mem_usage: 0,
      systemUsage: {},
      setSystemUsage: (systemUsage: any) => {
        set({ systemUsage });
      },
    }),
    {
      name: 'about-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
