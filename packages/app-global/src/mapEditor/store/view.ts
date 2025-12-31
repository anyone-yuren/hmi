import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
  // 参数面板是否折叠
  pointsView: [];
  setPointsView: (pointsView: []) => void;
  // 筛选是否显示线类型
  linesView: [];
  setLinesView: (linesView: []) => void;
  gridVisible: boolean;
  setGridVisible: (gridVisible: boolean) => void;
  // 筛选显示设备
  devicesView: [];
  setDevicesView: (devicesView: []) => void;
  // 显示地图编辑器
  showMapEditor: boolean;
  setShowMapEditor: (showMapEditor: boolean) => void;
  //设置楼层的偏移量
  floorOffset: [number, number];
  setFloorOffset: (floorOffset: [number, number]) => void;
  floorRotation: number;
  setFloorRotation: (floorRotation: number) => void;
  floorColor: string;
  setFloorColor: (floorColor: string) => void;
  // 选择的楼层
  selectFloor: string;
  setSelectFloor: (selectFloor: string) => void;
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
      gridVisible: false,
      setGridVisible: (gridVisible: boolean) => {
        set(() => ({
          gridVisible,
        }));
      },
      floorOffset: [0, 0],
      setFloorOffset: (floorOffset: [number, number]) => {
        set(() => ({
          floorOffset,
        }));
      },
      floorRotation: 0,
      setFloorRotation: (floorRotation: number) => {
        set(() => ({
          floorRotation,
        }));
      },
      floorColor: '#1677ff',
      setFloorColor: (floorColor: string) => {
        set(() => ({
          floorColor,
        }));
      },
      // 选择的楼层
      selectFloor: 'map-1',
      setSelectFloor: (selectFloor: string) => {
        set(() => ({
          selectFloor,
        }));
      },
    }),
    {
      name: 'map-editor-view-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
