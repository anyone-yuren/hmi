import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

type TDashboardState = {
  asideOpen: boolean;
  bottomOpen: boolean;
};

type TDashboardActions = {
  setAsideOpen: (open: boolean) => void;
  setBottomOpen: (open: boolean) => void;
};

export const useDashboardStore = createWithEqualityFn<TDashboardState & TDashboardActions>(
  (set) => ({
    asideOpen: false,
    setAsideOpen: (open: boolean) => set({ asideOpen: open }),
    bottomOpen: false,
    setBottomOpen: (open: boolean) => set({ bottomOpen: open }),
  }),
  shallow,
);
