import { create } from 'zustand';

export interface StoragePoint {
  id: string;
  position: [number, number, number]; // [x, y, z] - but z will be 0 for XY plane
  offset: { x: number; y: number };
}

interface EditModalState {
  visible: boolean;
  x: number;
  y: number;
  targetIds: string[]; // Supports multiple or single
}

interface OffsetTableState {
  points: StoragePoint[];
  setPoints: (
    points: StoragePoint[] | ((prev: StoragePoint[]) => StoragePoint[]),
  ) => void;

  selectedIds: Set<string>;
  setSelectedIds: (ids: Set<string>) => void;

  editModal: EditModalState;
  setEditModal: (state: EditModalState) => void;
  closeEditModal: () => void;

  // Update offset for specific IDs
  updateOffset: (ids: string[], offset: { x: number; y: number }) => void;
}

// Mock Data Generator
const generateTestPoints = (rows: number, cols: number): StoragePoint[] => {
  const points: StoragePoint[] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // X-Y Plane: z is 0
      points.push({
        id: `point-${i}-${j}`,
        position: [i * 2 - (rows * 2) / 2, j * 2 - (cols * 2) / 2, 0],
        offset: { x: 0, y: 0 },
      });
    }
  }
  return points;
};

export const useOffsetTableStore = create<OffsetTableState>((set) => ({
  points: generateTestPoints(100, 100),
  setPoints: (points) =>
    set((state) => ({
      points: typeof points === 'function' ? points(state.points) : points,
    })),

  selectedIds: new Set(),
  setSelectedIds: (selectedIds) => set({ selectedIds }),

  editModal: { visible: false, x: 0, y: 0, targetIds: [] },
  setEditModal: (editModal) => set({ editModal }),
  closeEditModal: () =>
    set({ editModal: { visible: false, x: 0, y: 0, targetIds: [] } }),

  updateOffset: (ids, offset) =>
    set((state) => ({
      points: state.points.map((p) =>
        ids.includes(p.id) ? { ...p, offset: { ...offset } } : p,
      ),
    })),
}));
