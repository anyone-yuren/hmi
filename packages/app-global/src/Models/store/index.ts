import isEqual from 'lodash-es/isEqual';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  mode: any;
  setMode: (mode: any) => void;
  modelSelect: any;
  setModelSelect: (modelSelect: any) => void;
  // 定位状态
  camera: any;
  setCamera: (camera: any) => void;
  threeControl: any;
  setThreeControl: (threeControl: any) => void;
  showPoints: boolean;
  setShowPoints: (showPoints: boolean) => void;

  // selectedPart 选中的部分
  selectedPart: any;
  setSelectedPart: (selectedPart: any) => void;

  // 相机的位置
  cameraPosition: any;
  setCameraPosition: (cameraPosition: any) => void;
  //相机的裁剪范围
  cameraClip: any;
  setCameraClip: (cameraClip: any) => void;
  // 相机的俯仰角
  cameraPitch: any;
  setCameraPitch: (cameraPitch: any) => void;
  // 相机的偏航角
  cameraYaw: any;
  setCameraYaw: (cameraYaw: any) => void;
  // 相机的横滚角
  cameraRoll: any;
  setCameraRoll: (cameraRoll: any) => void;

  // 是否开启裁剪
  enableClip: boolean;
  setEnableClip: (enableClip: boolean) => void;
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
      showPoints: false,
      setShowPoints: (showPoints: boolean) => {
        set(() => ({
          showPoints,
        }));
      },
      modelSelect: 'radar1',
      setModelSelect: (modelSelect: any) => {
        set(() => ({
          modelSelect,
        }));
      },
      cameraPosition: null,
      setCameraPosition: (cameraPosition: any) => {
        set(() => ({
          cameraPosition,
        }));
      },
      cameraClip: null,
      setCameraClip: (cameraClip: any) => {
        set(() => ({
          cameraClip,
        }));
      },
      cameraPitch: null,
      setCameraPitch: (cameraPitch: any) => {
        set(() => ({
          cameraPitch,
        }));
      },
      cameraYaw: null,
      setCameraYaw: (cameraYaw: any) => {
        set(() => ({
          cameraYaw,
        }));
      },
      cameraRoll: null,
      setCameraRoll: (cameraRoll: any) => {
        set(() => ({
          cameraRoll,
        }));
      },
      enableClip: false,
      setEnableClip: (enableClip: boolean) => {
        set(() => ({
          enableClip,
        }));
      },
      // selectedPart 选中的部分
      selectedPart: null,
      setSelectedPart: (selectedPart: any) => {
        set(() => ({
          selectedPart,
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
