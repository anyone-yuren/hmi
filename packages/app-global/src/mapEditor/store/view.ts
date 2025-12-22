import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
  // 参数面板是否折叠
  pointsView: [];
  setPointsView: (pointsView: []) => void;
  // 筛选是否显示线类型
  linesView: [];
  setLinesView: (linesView: []) => void;
  // 筛选显示设备
  devicesView: [];
  setDevicesView: (devicesView: []) => void;
}

export const useMapEditorViewStore = create<State>()(
  persist(
    (set, get) => ({
      pointsView: [],
      setPointsView: (pointsView: []) => {
        set(() => ({
          pointsView,
        }));
      },
      linesView: [],
      setLinesView: (linesView: []) => {
        set(() => ({
          linesView,
        }));
      },
      devicesView: [],
      setDevicesView: (devicesView: []) => {
        set(() => ({
          devicesView,
        }));
      },
    }),
    {
      name: 'map-editor-view-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
