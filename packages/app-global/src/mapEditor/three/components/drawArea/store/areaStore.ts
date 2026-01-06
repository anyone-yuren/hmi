import * as THREE from 'three';
import { create } from 'zustand';

export type AreaData = {
  id: string;
  center: THREE.Vector3;
  width: number;
  height: number;
};

type EditorMode = 'idle' | 'draw-area' | 'select';

type MapEditorState = {
  mode: EditorMode;
  areas: AreaData[];
  selectedIds: string[];

  setMode: (mode: EditorMode) => void;

  addArea: (area: AreaData) => void;
  updateArea: (id: string, patch: Partial<AreaData>) => void;

  select: (ids: string[]) => void;
  clearSelection: () => void;
  clearAreas: () => void;
  contextMenuPosition: { x: 0; y: 0 };
  setContextMenuPosition: (position) => void;
  showAreaParamsDialog: boolean;
  setShowAreaParamsDialog: (show) => void;
};

export const useAreaStore = create<MapEditorState>((set) => ({
  mode: 'idle',
  areas: [],
  selectedIds: [],

  setMode: (mode) => set({ mode }),

  addArea: (area) => set((s) => ({ areas: [...s.areas, area] })),

  updateArea: (id, patch) =>
    set((s) => ({
      areas: s.areas.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    })),

  select: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
  clearAreas: () => set({ areas: [] }),

  // 上下文菜单位置
  contextMenuPosition: { x: 0, y: 0 },
  setContextMenuPosition: (position) => set({ contextMenuPosition: position }),

  // 区域参数弹窗是否显示
  showAreaParamsDialog: false,
  setShowAreaParamsDialog: (show) => set({ showAreaParamsDialog: show }),
}));
