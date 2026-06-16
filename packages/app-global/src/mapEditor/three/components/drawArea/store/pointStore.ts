import { create } from 'zustand';
import { spatialIndex } from '../spatial/spatialIndex';

export type ScenePoint = {
  id: string;
  x: number;
  y: number;
};

type State = {
  points: ScenePoint[];
  setPoints: (pts: ScenePoint[]) => void;
};

export const usePointStore = create<State>((set) => ({
  points: [],
  setPoints: (pts) => {
    spatialIndex.build(pts); // ⭐ 构建空间索引
    set({ points: pts });
  },
}));
