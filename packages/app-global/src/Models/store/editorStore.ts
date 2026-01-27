import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface EditorState {
  selected: THREE.Object3D | null;

  // ⭐ 右键菜单
  contextMenuVisible: boolean;
  contextMenuPosition: { x: number; y: number } | null;

  // ⭐ 面板
  panelType:
    | null
    | 'clip'
    | 'density'
    | 'focus'
    | 'calibration'
    | 'fork'
    | 'body';
  panelVisible: boolean;
  panelTab: string | null;
  setPanelTab: (panelTab: string | null) => void;
  showPanel: (type: EditorState['panelType']) => void;
  hidePanel: () => void;

  selectObject: (obj: THREE.Object3D | null) => void;
  showContextMenu: (x: number, y: number) => void;
  hideContextMenu: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // 显示的策略数组
      selected: null,

      contextMenuVisible: false,
      contextMenuPosition: null,

      panelType: null,
      panelVisible: false,
      panelTab: null,

      setPanelTab: (panelTab) => set({ panelTab }),

      showPanel: (type) =>
        set({
          panelType: type,
          panelVisible: true,
        }),

      hidePanel: () =>
        set({
          panelVisible: false,
          panelType: null,
          panelTab: null,
        }),

      selectObject: (obj) => set({ selected: obj }),

      showContextMenu: (x, y) =>
        set({
          contextMenuVisible: true,
          contextMenuPosition: { x, y },
        }),

      hideContextMenu: () =>
        set({
          contextMenuVisible: false,
          contextMenuPosition: null,
        }),
    }),
    {
      name: 'editor-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
