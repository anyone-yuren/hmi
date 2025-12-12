import isEqual from 'lodash-es/isEqual';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  mode: any;
  setMode: (mode: any) => void;
  // 定位状态
  camera: any;
  setCamera: (camera: any) => void;
  threeControl: any;
  setThreeControl: (threeControl: any) => void;
}

export const useModelStore = create<State>()(
  persist(
    (set, get) => ({
      mode: 'editor',
      setMode: (mode: any) => {
        const currentMode = get().mode;
        // 如果缓存开关开着，且值有变化，才更新
        if (!isEqual(mode, currentMode)) {
          set(() => ({
            mode,
          }));
        }
      },
      camera: null,
      setCamera: (camera: any) => {
        set(() => ({
          camera,
        }));
      },
      threeControl: null,
      setThreeControl: (threeControl: any) => {
        set(() => ({
          threeControl,
        }));
      },
    }),
    {
      name: 'model-store',
      partialize: (state) => ({
        // 只持久化 mode、camera
        mode: state.mode,
        camera: state.camera,
      }),
    },
  ),
);
