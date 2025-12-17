import { create } from 'zustand';
import { SelectableItem } from './type';
interface SelectionStore {
  // 已选
  selectedIds: Set<number | string>;

  // 框选候选
  candidates: SelectableItem[];

  // UI
  filterOpen: boolean;

  setSelectedIds: (ids: Set<number | string>) => void;
  setCandidates: (items: SelectableItem[]) => void;
  openFilter: () => void;
  closeFilter: () => void;
  startSelection: boolean;
  setStartSelection: (start) => void;
}
export const useSelectionStore = create<SelectionStore>((set) => ({
  selectedIds: new Set(),
  candidates: [],
  filterOpen: false,

  setSelectedIds: (ids) => set({ selectedIds: new Set(ids) }),
  setCandidates: (items) => set({ candidates: items }),
  openFilter: () => set({ filterOpen: true }),
  closeFilter: () => set({ filterOpen: false }),
  startSelection: false,
  setStartSelection: (start) => set({ startSelection: start }),
}));
