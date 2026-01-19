import RBush from 'rbush';
import { useMemo } from 'react';
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

function pointInPolygon(point: { x: number; y: number }, polygon: { x: number; y: number }[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x,
      yi = polygon[i].y;
    const xj = polygon[j].x,
      yj = polygon[j].y;

    const intersect = yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * ⭐ 纯函数：任意地方可用
 */
export function queryPointsInPolygon(polygon: { x: number; y: number }[]): SelectableItem[] {
  if (!polygon || polygon.length < 3) return [];

  // 1️⃣ polygon → bbox
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of polygon) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  // 2️⃣ RBush 初筛
  const candidates = querySpatialIndex({
    minX,
    minY,
    maxX,
    maxY,
  });

  // 3️⃣ 精筛
  return candidates.filter((item) => pointInPolygon({ x: item.position?.x ?? 0, y: item.position?.y ?? 0 }, polygon));
}

export function useAreaQuery(polygon: { x: number; y: number }[] | null) {
  return useMemo(() => {
    if (!polygon) return [];
    return queryPointsInPolygon(polygon);
  }, [polygon]);
}
