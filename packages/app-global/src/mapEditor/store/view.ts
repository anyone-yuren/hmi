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
  // 显示地图编辑器
  showMapEditor: boolean;
  setShowMapEditor: (showMapEditor: boolean) => void;
  //设置楼层的偏移量
  floorOffset: [number, number];
  setFloorOffset: (floorOffset: [number, number]) => void;
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
      showMapEditor: false,
      setShowMapEditor: (showMapEditor: boolean) => {
        set(() => ({
          showMapEditor,
        }));
      },
      floorOffset: [0, 0],
      setFloorOffset: (floorOffset: [number, number]) => {
        set(() => ({
          floorOffset,
        }));
      },
    }),
    {
      name: 'map-editor-view-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
