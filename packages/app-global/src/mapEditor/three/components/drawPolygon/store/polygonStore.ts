import * as THREE from 'three';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type PolygonData = {
  id: string;
  center: THREE.Vector3;
  width: number;
  height: number;
  name: string;
};

type EditorMode = 'idle' | 'draw-polygon' | 'select';

type MapEditorState = {
  mode: EditorMode;
  polygons: PolygonData[];
  selectedIds: string[];

  setMode: (mode: EditorMode) => void;

  addPolygon: (polygon: PolygonData) => void;
  updatePolygon: (id: string, patch: Partial<PolygonData>) => void;

  select: (ids: string[]) => void;
  clearSelection: () => void;
  clearPolygons: () => void;
  contextMenuPosition: { x: 0; y: 0 };
  setContextMenuPosition: (position) => void;
  showPolygonParamsDialog: boolean;
  setShowPolygonParamsDialog: (show) => void;
};

export const usePolygonStore = create<MapEditorState>()(
  persist(
    (set, get) => ({
      mode: 'idle',
      polygons: [],
      selectedIds: [],

      setMode: (mode) => set({ mode }),

      addPolygon: (polygon) => set((s) => ({ polygons: [...s.polygons, polygon] })),

      updatePolygon: (id, patch) =>
        set((s) => ({
          polygons: s.polygons.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      select: (ids) => set({ selectedIds: ids }),
      clearSelection: () => set({ selectedIds: [] }),
      clearPolygons: () => set({ polygons: [] }),

      // 上下文菜单位置
      contextMenuPosition: { x: 0, y: 0 },
      setContextMenuPosition: (position) => set({ contextMenuPosition: position }),

      // 区域参数弹窗是否显示
      showPolygonParamsDialog: false,
      setShowPolygonParamsDialog: (show) => set({ showPolygonParamsDialog: show }),
    }),
    {
      name: 'map-editor-Polygon-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
