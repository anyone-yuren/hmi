import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  agvPosition: any;
  setAgvPosition: (position: any) => void;
  rcsInfo: any;
  setRcsInfo: (info: any) => void;
  refreshTaskList: number;
  setRefreshTaskList: (num: number) => void;
}

const storageOptions = {
  name: 'singleTask',
};

const localAndMapStore = (
  set: (
    partial: State | Partial<State> | ((state: State) => State | Partial<State>),
    replace?: boolean | undefined,
  ) => void,
  get: () => State,
) => ({
  agvPosition: {},
  setAgvPosition: (position: any) => {
    set({ agvPosition: position });
  },

  refreshTaskList: 0,
  setRefreshTaskList: (count: number) => {
    set({ refreshTaskList: count });
  },

  rcsInfo: {},
  setRcsInfo: (info: any) => {
    set({ rcsInfo: info });
  },
});

export const useSingleTaskStore = create<State>()(persist(localAndMapStore, storageOptions));
