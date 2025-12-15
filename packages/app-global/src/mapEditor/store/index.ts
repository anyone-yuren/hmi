import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
  // 参数面板是否折叠
  paramsPanelCollapsed: boolean;
  setParamsPanelCollapsed: (paramsPanelCollapsed: boolean) => void;
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
    }),
    {
      name: 'map-editor-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
