import RBush from 'rbush';
import { SelectableItem } from './type';

/**
 * R-Tree 索引实例
 */
const tree = new RBush<SelectableItem>();

/**
 * 重建空间索引
 * ⚠️ 适合 points 变化不频繁的场景
 */
export function rebuildSpatialIndex(items: SelectableItem[]) {
  tree.clear();
  tree.load(items);
}

/**
 * 查询当前视口内的元素
 */
export function querySpatialIndex(bounds: {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}): SelectableItem[] {
  return tree.search(bounds);
}
