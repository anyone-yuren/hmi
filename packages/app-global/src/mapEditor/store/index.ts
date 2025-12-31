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
  // 静态点数据
  staticPoints: Record<any, any>[];
  setStaticPoints: (staticPoints: Record<any, any>[]) => void;
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
      // 静态点数据
      staticPoints: [
        {
          id: 1,
          position: {
            x: 0.2593765306538583,
            y: -1.1200000000005597,
            z: 0,
          },
        },
        {
          id: 2,
          position: {
            x: 1.1575476268519693,
            y: -1.1200000000005597,
            z: 0,
          },
        },
        {
          id: 3,
          position: {
            x: 0.19735854823610643,
            y: -1.8100000000009044,
            z: 0,
          },
        },
        {
          id: 4,
          position: {
            x: -0.772712801260752,
            y: -1.8500000000009247,
            z: 0,
          },
        },
        {
          id: 5,
          position: {
            x: -5.353391643546619,
            y: -3.22278991178781,
            z: 0,
          },
        },
        {
          id: 6,
          position: {
            x: 3.564334361112884,
            y: -8.908255443570273,
            z: 0,
          },
        },
        {
          id: 7,
          position: {
            x: -2.5832044192043937,
            y: -8.945229201370621,
            z: 0,
          },
        },
        {
          id: 8,
          position: {
            x: 2.274110172282798,
            y: -3.4427907330362513,
            z: 0,
          },
        },
      ],
      setStaticPoints: (staticPoints: Record<any, any>[]) => {
        set(() => ({
          staticPoints,
        }));
      },
    }),
    {
      name: 'map-editor-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
