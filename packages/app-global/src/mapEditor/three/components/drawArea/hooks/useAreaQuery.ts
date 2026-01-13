import { useMemo } from 'react';
import { isPointInPolygon } from '../spatial/pointInPolygon';
import { spatialIndex } from '../spatial/spatialIndex';

export function useAreaQuery(areaPoints: { x: number; y: number }[]) {
  return useMemo(() => {
    if (areaPoints.length < 3) return [];

    // 1️⃣ 计算 Bounding Box
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const p of areaPoints) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    }

    // 2️⃣ 空间索引过滤
    const candidates = spatialIndex.searchBBox({
      minX,
      minY,
      maxX,
      maxY,
    });

    // 3️⃣ 精确判断
    return candidates.filter((p) => isPointInPolygon({ x: p.x, y: p.y }, areaPoints));
  }, [areaPoints]);
}
