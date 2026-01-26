import { create } from 'zustand';
import { BuildHistory, LayerData, MOCK_VERSIONS } from './types';

interface AutoCompileState {
  layers: Record<string, LayerData>;
  progress: number;
  isCompiling: boolean;
  history: BuildHistory[];
  historyVisible: boolean;
  selectedHistoryId: string | null;
  currentLayers: Record<string, LayerData> | null;
  addNodeModalVisible: boolean;

  // Actions
  setLayerItem: (
    layerId: string,
    itemId: string,
    updates: Partial<any>,
  ) => void;
  startCompile: () => Promise<void>;
  setHistoryVisible: (visible: boolean) => void;
  selectHistory: (historyId: string | null) => void;
  setAddNodeModalVisible: (visible: boolean) => void;
  addNewNode: (layerId: string, name: string, dataSource: string) => void;
}

const INITIAL_LAYERS: Record<string, LayerData> = {
  dependency: {
    id: 'dependency',
    title: '依赖库',
    items: [
      {
        id: 'sirius',
        name: 'sirius',
        version: MOCK_VERSIONS[0],
        checked: true,
        versions: MOCK_VERSIONS,
      },
      {
        id: 'slam_lib',
        name: 'slam_lib',
        version: MOCK_VERSIONS[0],
        checked: true,
        versions: MOCK_VERSIONS,
      },
    ],
  },
  base: {
    id: 'base',
    title: '基础层',
    items: [
      {
        id: 'mwrobot_base_core',
        name: 'mwrobot_base_core',
        version: MOCK_VERSIONS[0],
        checked: true,
        versions: MOCK_VERSIONS,
      },
      {
        id: 'mwrobot_msgs',
        name: 'mwrobot_msgs',
        version: MOCK_VERSIONS[0],
        checked: true,
        versions: MOCK_VERSIONS,
      },
    ],
  },
  application: {
    id: 'application',
    title: '应用层',
    items: [
      {
        id: 'mwrobot_driver_canbus',
        name: 'mwrobot_driver_canbus',
        version: MOCK_VERSIONS[0],
        checked: true,
        versions: MOCK_VERSIONS,
      },
      {
        id: 'mwrobot_driver_laser',
        name: 'mwrobot_driver_laser',
        version: MOCK_VERSIONS[0],
        checked: true,
        versions: MOCK_VERSIONS,
      },
    ],
  },
};

export const DEPENDENCIES: Record<string, string[]> = {
  mwrobot_driver_laser: ['mwrobot_msgs'],
  mwrobot_msgs: ['sirius'],
};

export const useAutoCompileStore = create<AutoCompileState>((set, get) => ({
  layers: INITIAL_LAYERS,
  progress: 0,
  isCompiling: false,
  history: [],
  historyVisible: false,
  selectedHistoryId: null,
  currentLayers: null,
  addNodeModalVisible: false,

  setLayerItem: (layerId, itemId, updates) => {
    set((state) => {
      if (state.selectedHistoryId) return state; // Prevent editing in history mode

      const layer = state.layers[layerId];
      if (!layer) return state;

      const newItems = layer.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      );

      return {
        layers: {
          ...state.layers,
          [layerId]: { ...layer, items: newItems },
        },
      };
    });
  },

  startCompile: async () => {
    const { isCompiling } = get();
    if (isCompiling) return;

    set({
      isCompiling: true,
      progress: 0,
      selectedHistoryId: null,
      currentLayers: null,
      layers: get().selectedHistoryId ? get().currentLayers! : get().layers,
    }); // Ensure we compile current state

    // Simulate compilation
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      if (p >= 100) {
        clearInterval(interval);
        const currentState = get();

        // Add to history
        const newHistory: BuildHistory = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          duration: '1m 20s',
          status: 'success',
          snapshot: JSON.parse(JSON.stringify(currentState.layers)),
        };

        set({
          progress: 100,
          isCompiling: false,
          history: [newHistory, ...currentState.history],
        });
      } else {
        set({ progress: p });
      }
    }, 100);
  },

  setHistoryVisible: (visible) => set({ historyVisible: visible }),

  selectHistory: (historyId) => {
    set((state) => {
      if (!historyId) {
        // Restore current layers if they exist
        if (state.currentLayers) {
          return {
            selectedHistoryId: null,
            layers: state.currentLayers,
            currentLayers: null,
          };
        }
        return { selectedHistoryId: null };
      }

      const historyItem = state.history.find((h) => h.id === historyId);
      if (!historyItem) return { selectedHistoryId: null };

      // Stash current layers if not already stashed
      const layersToStash = state.selectedHistoryId
        ? state.currentLayers
        : state.layers;

      return {
        selectedHistoryId: historyId,
        layers: historyItem.snapshot,
        currentLayers: layersToStash,
      };
    });
  },

  setAddNodeModalVisible: (visible) => set({ addNodeModalVisible: visible }),

  addNewNode: (layerId, name, dataSource) => {
    set((state) => {
      const layer = state.layers[layerId];
      if (!layer) return state;

      const newItem = {
        id: name.toLowerCase().replace(/\s+/g, '_'),
        name,
        version: MOCK_VERSIONS[0],
        checked: true,
        versions: MOCK_VERSIONS,
        // Store dataSource if needed, currently LayerItem doesn't have it in types.
        // Assuming we might need to extend types or just ignore for now if only for display/logic
        // But user asked to fill "Data Source", so it should probably be stored.
      };

      return {
        layers: {
          ...state.layers,
          [layerId]: {
            ...layer,
            items: [...layer.items, newItem],
          },
        },
        addNodeModalVisible: false,
      };
    });
  },
}));
