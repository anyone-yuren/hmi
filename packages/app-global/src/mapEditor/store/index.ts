import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
export interface SelectLineData {
  id: number;
  points: { x: number; y: number; z: number }[];
  length: number;
  angle: number; // rad（或你要的 deg）
}

export interface Elevator {
  id: number;
  position: { x: number; y: number; z: number };
}
interface State {
  // 参数面板是否折叠
  paramsPanelCollapsed: boolean;
  setParamsPanelCollapsed: (paramsPanelCollapsed: boolean) => void;
  selectDrawType: string;
  setSelectDrawType: (selectDrawType: string) => void;
  selectSubDrawType: string;
  setSelectSubDrawType: (selectSubDrawType: string) => void;
  // 选中的线数据
  selectLineData: SelectLineData | null;
  setSelectLineData: (data: SelectLineData | null) => void;
  // 鼠标的坐标位置
  mousePosition: { x: number; y: number };
  setMousePosition: (position: { x: number; y: number }) => void;

  // 电梯列表
  elevatorList: Record<any, any>[];
  setElevatorList: (elevatorList: Record<any, any>[]) => void;
  // 自动门列表
  autoDoorList: Record<any, any>[];
  setAutoDoorList: (autoDoorList: Record<any, any>[]) => void;
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
      selectSubDrawType: 'elevator',
      setSelectSubDrawType: (selectSubDrawType: string) => {
        set(() => ({
          selectSubDrawType,
        }));
      },
      // 选中的线数据
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
      // 电梯列表
      elevatorList: [],
      setElevatorList: (elevatorList: Record<any, any>[]) => {
        set(() => ({
          elevatorList,
        }));
      },
      // 自动门列表
      autoDoorList: [],
      setAutoDoorList: (autoDoorList: Record<any, any>[]) => {
        set(() => ({
          autoDoorList,
        }));
      },
    }),
    {
      name: 'map-editor-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
