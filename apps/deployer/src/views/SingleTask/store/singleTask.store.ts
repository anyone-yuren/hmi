import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  rcsInfo: any;
  setRcsInfo: (info: any) => void;
  refreshTaskList: number;
  setRefreshTaskList: (num: number) => void;
}

const storageOptions = {
  name: 'map',
};

const localAndMapStore = (
  set: (
    partial: State | Partial<State> | ((state: State) => State | Partial<State>),
    replace?: boolean | undefined,
  ) => void,
  get: () => State,
) => ({
  refreshTaskList: 0,
  setRefreshTaskList: (count: number) => {
    set({ refreshTaskList: count });
  },

  rcsInfo: {},
  setRcsInfo: (info: any) => {
    set({ rcsInfo: info });
  },
});

export const useMapStore = create<State>()(persist(localAndMapStore, storageOptions));
