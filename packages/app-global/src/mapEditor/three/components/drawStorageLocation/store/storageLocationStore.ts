import * as THREE from 'three';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ShelfLayer = {
  key: number | string;
  height: number;
  offsetX: number;
  offsetY: number;
  angle: number;
};

export type ShelfConfig = {
  layers: ShelfLayer[];
};

export type StorageLocationData = {
  id: string;
  position: THREE.Vector3; // Serialized as object in JSON, but hydrated to Vector3 usually if manual, here we stick to simple object for persistence or handle it
  name: string;
  vehicleModelIds?: string[];
  allowedVehicleModelIds?: string[];
  parkingRuleId?: string;
  type: 'storage' | 'shelf';
  storageType?: string;
  shelfConfig?: ShelfConfig;
};

// Use simple object for position in persistence to avoid issues, or handle reconstruction
export type SerializedStorageLocationData = Omit<
  StorageLocationData,
  'position'
> & {
  position: { x: number; y: number; z: number };
};

type EditorMode = 'idle' | 'draw-storage-location' | 'select';

type StorageLocationState = {
  mode: EditorMode;
  storageLocations: SerializedStorageLocationData[];
  selectedIds: string[];

  setMode: (mode: EditorMode) => void;

  addStorageLocation: (location: SerializedStorageLocationData) => void;
  updateStorageLocation: (
    id: string,
    patch: Partial<SerializedStorageLocationData>,
  ) => void;
  removeStorageLocation: (id: string) => void;

  select: (ids: string[]) => void;
  clearSelection: () => void;
  clearStorageLocations: () => void;

  // Context Menu
  contextMenuPosition: { x: number; y: number } | null;
  setContextMenuPosition: (position: { x: number; y: number } | null) => void;

  // Shelf Config Panel
  showShelfConfigDialog: boolean;
  setShowShelfConfigDialog: (show: boolean) => void;
  currentConfigId: string | null;
  setCurrentConfigId: (id: string | null) => void;

  // Bind Vehicle Modal
  showBindVehicleDialog: boolean;
  setShowBindVehicleDialog: (show: boolean) => void;

  // Editing Point (for offset)
  editingPoint: any | null;
  setEditingPoint: (point: any | null) => void;

  // Camera Focus
  focusTarget: string | null;
  setFocusTarget: (id: string | null) => void;
};

export const useStorageLocationStore = create<StorageLocationState>()(
  persist(
    (set, get) => ({
      mode: 'idle',
      storageLocations: [],
      selectedIds: [],

      setMode: (mode) => set({ mode }),

      addStorageLocation: (location) =>
        set((s) => ({ storageLocations: [...s.storageLocations, location] })),

      updateStorageLocation: (id, patch) =>
        set((s) => ({
          storageLocations: s.storageLocations.map((a) =>
            a.id === id ? { ...a, ...patch } : a,
          ),
        })),

      removeStorageLocation: (id) =>
        set((s) => ({
          storageLocations: s.storageLocations.filter((a) => a.id !== id),
        })),

      select: (ids) => set({ selectedIds: ids }),
      clearSelection: () => set({ selectedIds: [] }),
      clearStorageLocations: () => set({ storageLocations: [] }),

      contextMenuPosition: null,
      setContextMenuPosition: (position) =>
        set({ contextMenuPosition: position }),

      showShelfConfigDialog: false,
      setShowShelfConfigDialog: (show) => set({ showShelfConfigDialog: show }),
      currentConfigId: null,
      setCurrentConfigId: (id) => set({ currentConfigId: id }),

      showBindVehicleDialog: false,
      setShowBindVehicleDialog: (show) => set({ showBindVehicleDialog: show }),

      editingPoint: null,
      setEditingPoint: (point) => set({ editingPoint: point }),

      focusTarget: null,
      setFocusTarget: (id) => set({ focusTarget: id }),
    }),
    {
      name: 'storage-location-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        storageLocations: state.storageLocations,
      }),
    },
  ),
);
