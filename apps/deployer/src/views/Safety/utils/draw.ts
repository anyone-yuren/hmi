import Konva from 'konva';

// 工具函数
export function getRectBox(node: Konva.Rect) {
  return { x: node.x(), y: node.y(), width: node.width(), height: node.height() };
}
/**
 * 获取相对指针位置
 */
export function getRelativePointerPosition(node: Konva.Node | null) {
  if (!node) return { x: 0, y: 0 };
  const stage = node.getStage();
  const pointer = stage?.getPointerPosition();
  if (!pointer) return { x: 0, y: 0 };
  const transform = node.getAbsoluteTransform().copy();
  transform.invert();
  return transform.point(pointer);
}
/**
 * 归一化矩形
 */
export function normalizeRect(a: { x: number; y: number }, b: { x: number; y: number }) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const width = Math.abs(b.x - a.x);
  const height = Math.abs(b.y - a.y);
  return { x, y, width, height };
}
/**
 * 检查是否吸附到车
 */
export function isSnappedToCar(rect, car, snap = 1, margin = 1) {
  const rectEdges = { left: rect.x, right: rect.x + rect.width, top: rect.y, bottom: rect.y + rect.height };
  const carEdges = { left: car.x, right: car.x + car.width, top: car.y, bottom: car.y + car.height };
  const hasXOverlap = !(rectEdges.right < carEdges.left + margin || rectEdges.left > carEdges.right - margin);
  const hasYOverlap = !(rectEdges.bottom < carEdges.top + margin || rectEdges.top > carEdges.bottom - margin);
  const alignedLeft = Math.abs(rectEdges.left - carEdges.right) <= snap && hasYOverlap;
  const alignedRight = Math.abs(rectEdges.right - carEdges.left) <= snap && hasYOverlap;
  const alignedTop = Math.abs(rectEdges.top - carEdges.bottom) <= snap && hasXOverlap;
  const alignedBottom = Math.abs(rectEdges.bottom - carEdges.top) <= snap && hasXOverlap;
  return alignedLeft || alignedRight || alignedTop || alignedBottom;
}
/**
 * 检查是否吸附到任何车
 */
export function isSnappedToAnyCar(rect, carRects, snap = 1) {
  return carRects.some((car) => isSnappedToCar(rect, car, snap));
}
/**
 * 应用吸附
 */
export function applySnap(rect, carRects, snap = 5, margin = 1) {
  const newRect = { ...rect };
  const snapLines: { points: number[]; orientation: 'vertical' | 'horizontal' }[] = [];
  carRects.forEach((car) => {
    // 左对齐
    if (Math.abs(rect.x - (car.x + car.width)) <= snap) {
      newRect.x = car.x + car.width + margin;
      snapLines.push({
        points: [car.x + car.width, car.y, car.x + car.width, car.y + car.height],
        orientation: 'vertical',
      });
    }
    // 右对齐
    if (Math.abs(rect.x + rect.width - car.x) <= snap) {
      newRect.x = car.x - rect.width - margin;
      snapLines.push({
        points: [car.x, car.y, car.x, car.y + car.height],
        orientation: 'vertical',
      });
    }
    // 上对齐
    if (Math.abs(rect.y - (car.y + car.height)) <= snap) {
      newRect.y = car.y + car.height + margin;
      snapLines.push({
        points: [car.x, car.y + car.height, car.x + car.width, car.y + car.height],
        orientation: 'horizontal',
      });
    }
    // 下对齐
    if (Math.abs(rect.y + rect.height - car.y) <= snap) {
      newRect.y = car.y - rect.height - margin;
      snapLines.push({
        points: [car.x, car.y, car.x + car.width, car.y],
        orientation: 'horizontal',
      });
    }
  });
  return { newRect, snapLines };
}
/**
 * 检查是否碰撞
 */
export function hasCollision(rect, car, snapMargin = 1) {
  const snappedLeft = Math.abs(rect.x - (car.x + car.width)) <= snapMargin;
  const snappedRight = Math.abs(rect.x + rect.width - car.x) <= snapMargin;
  const snappedTop = Math.abs(rect.y - (car.y + car.height)) <= snapMargin;
  const snappedBottom = Math.abs(rect.y + rect.height - car.y) <= snapMargin;
  if (snappedLeft || snappedRight || snappedTop || snappedBottom) return false;
  return Konva.Util.haveIntersection(rect, car);
}

// ✅ 统一校验函数
export function validateRect(rect, carRects, otherRects, snap = 2) {
  const { newRect: snappedRect, snapLines } = applySnap(rect, carRects, snap);
  const isSnapped = isSnappedToAnyCar(snappedRect, carRects, snap);

  let intersecting = false;
  if (carRects.some((car) => hasCollision(snappedRect, car))) {
    intersecting = true;
  }
  if (!intersecting) {
    for (const r of otherRects) {
      if (Konva.Util.haveIntersection(r, snappedRect)) {
        intersecting = true;
        break;
      }
    }
  }
  return { rect: snappedRect, isSnapped, isIntersecting: intersecting, snapLines };
}

export type SnapLine = { points: number[]; orientation: 'vertical' | 'horizontal' };
/**
 * 构建车边缘引导线
 */
export function buildCarEdgeGuides(
  pointer: { x: number; y: number },
  carRects: Array<{ x: number; y: number; width: number; height: number }>,
  threshold: number,
): SnapLine[] {
  const lines: SnapLine[] = [];
  carRects.forEach((car) => {
    const left = car.x;
    const right = car.x + car.width;
    const top = car.y;
    const bottom = car.y + car.height;

    // 垂直边（按车体高度画线，更精准）
    if (Math.abs(pointer.x - left) <= threshold) {
      lines.push({ orientation: 'vertical', points: [left, top, left, bottom] });
    }
    if (Math.abs(pointer.x - right) <= threshold) {
      lines.push({ orientation: 'vertical', points: [right, top, right, bottom] });
    }

    // 水平边（按车体宽度画线）
    if (Math.abs(pointer.y - top) <= threshold) {
      lines.push({ orientation: 'horizontal', points: [left, top, right, top] });
    }
    if (Math.abs(pointer.y - bottom) <= threshold) {
      lines.push({ orientation: 'horizontal', points: [left, bottom, right, bottom] });
    }
  });
  return lines;
}
