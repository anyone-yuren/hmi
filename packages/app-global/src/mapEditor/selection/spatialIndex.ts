import RBush from 'rbush';
import { SelectableItem } from './type';

export const spatialIndex = new RBush<SelectableItem>();
export function rebuildSpatialIndex(items: SelectableItem[]) {
  spatialIndex.clear();
  spatialIndex.load(items);
}
