import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
export interface SelectLineData {
  id: number;
  points: { x: number; y: number; z: number }[];
  length: number;
  angle: number; // rad（或你要的 deg）
}
interface State {
  // 参数面板是否折叠
  paramsPanelCollapsed: boolean;
  setParamsPanelCollapsed: (paramsPanelCollapsed: boolean) => void;
  selectDrawType: string;
  setSelectDrawType: (selectDrawType: string) => void;
  selectLineData: SelectLineData | null;
  setSelectLineData: (data: SelectLineData | null) => void;
  // 鼠标的坐标位置
  mousePosition: { x: number; y: number };
  setMousePosition: (position: { x: number; y: number }) => void;
}

export const useMapEditorStore = create<State>()(
  persist(
    (set, get) => ({
      paramsPanelCollapsed: true,
      setParamsPanelCollapsed: (paramsPanelCollapsed: boolean) => {
        set(() => ({
          paramsPanelCollapsed,
        }));
      },
      selectDrawType: 'point',
      setSelectDrawType: (selectDrawType: string) => {
        set(() => ({
          selectDrawType,
        }));
      },
      selectLineData: null,
      setSelectLineData: (data: SelectLineData | null) => {
        set(() => ({
          selectLineData: data,
        }));
      },
      // 鼠标的坐标位置
      mousePosition: { x: 0, y: 0 },
      setMousePosition: (position: { x: number; y: number }) => {
        set(() => ({
          mousePosition: position,
        }));
      },
    }),
    {
      name: 'map-editor-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
