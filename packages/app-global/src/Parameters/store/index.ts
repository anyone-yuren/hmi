import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ParameterState {
  contextMenuPosition: { x: number; y: number } | null;

  showContextMenu: (x: number, y: number) => void;
  hideContextMenu: () => void;
}

export const useParameterMenuStore = create<ParameterState>()(
  persist(
    (set, get) => ({
      contextMenuPosition: null,

      showContextMenu: (x, y) =>
        set({
          contextMenuPosition: { x, y },
        }),

      hideContextMenu: () =>
        set({
          contextMenuPosition: null,
        }),
    }),
    {
      name: 'parameters-menu-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
