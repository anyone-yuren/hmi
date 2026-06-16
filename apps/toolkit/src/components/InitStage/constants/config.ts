import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
export const cellSize = 20;
export const rulerSize = 40;
export const size = 20;
export const MIN_SCALE = 0.5;
export const MAX_SCALE = 5;
export const toStageValue = (value: number) => {
  return value / useHybirdStore.getState().stageScale;
};
