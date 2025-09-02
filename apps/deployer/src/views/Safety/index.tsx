import { LineGrid } from '@/components/InitStage/components/LineGrid';
import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import { useSize } from 'ahooks';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Layer, Rect, Stage, Text } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
// 工具函数：取 Konva.Rect 的边界盒
function getRectBox(node: Konva.Rect) {
  return {
    x: node.x(),
    y: node.y(),
    width: node.width(),
    height: node.height(),
  };
}
// 获取指针相对坐标
function getRelativePointerPosition(node: Konva.Node | null) {
  if (!node) return { x: 0, y: 0 };
  const stage = node.getStage();
  const pointer = stage?.getPointerPosition();
  if (!pointer) return { x: 0, y: 0 };
  const transform = node.getAbsoluteTransform().copy();
  transform.invert();
  return transform.point(pointer);
}

// 归一化矩形
function normalizeRect(a: { x: number; y: number }, b: { x: number; y: number }) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const width = Math.abs(b.x - a.x);
  const height = Math.abs(b.y - a.y);
  return { x, y, width, height };
}

// 判断是否贴着 carRect 的某一条边，并且有交集
// 判断是否贴着 carRect 的某一条边，并且有交集（带 margin）
function isSnappedToCar(
  rect: { x: number; y: number; width: number; height: number },
  car: { x: number; y: number; width: number; height: number },
  snap = 1,
  margin = 1, // 吸附后保留间距
) {
  const rectEdges = {
    left: rect.x,
    right: rect.x + rect.width,
    top: rect.y,
    bottom: rect.y + rect.height,
  };
  const carEdges = {
    left: car.x,
    right: car.x + car.width,
    top: car.y,
    bottom: car.y + car.height,
  };

  // 判断区间是否有交集（考虑 margin）
  const hasXOverlap = !(rectEdges.right < carEdges.left + margin || rectEdges.left > carEdges.right - margin);
  const hasYOverlap = !(rectEdges.bottom < carEdges.top + margin || rectEdges.top > carEdges.bottom - margin);

  // 四种情况：边贴合 + 对应方向必须有交集
  const alignedLeft = Math.abs(rectEdges.left - carEdges.right) <= snap && hasYOverlap; // 矩形左边贴 car 的右边
  const alignedRight = Math.abs(rectEdges.right - carEdges.left) <= snap && hasYOverlap; // 矩形右边贴 car 的左边
  const alignedTop = Math.abs(rectEdges.top - carEdges.bottom) <= snap && hasXOverlap; // 矩形上边贴 car 的下边
  const alignedBottom = Math.abs(rectEdges.bottom - carEdges.top) <= snap && hasXOverlap; // 矩形下边贴 car 的上边

  return alignedLeft || alignedRight || alignedTop || alignedBottom;
}

// 判断是否贴边到任意车体部件
function isSnappedToAnyCar(
  rect: { x: number; y: number; width: number; height: number },
  carRects: Array<{ x: number; y: number; width: number; height: number }>,
  snap = 1,
) {
  return carRects.some((car) => isSnappedToCar(rect, car, snap));
}

// 吸附函数：靠近车体边时自动对齐
function applySnap(
  rect: { x: number; y: number; width: number; height: number },
  carRects: Array<{ x: number; y: number; width: number; height: number }>,
  snap = 5,
  margin = 1, // 🚀 新增参数：吸附后保持间隔
) {
  const newRect = { ...rect };

  carRects.forEach((car) => {
    // 左边吸附到 car.right
    if (Math.abs(rect.x - (car.x + car.width)) <= snap) {
      newRect.x = car.x + car.width + margin;
    }

    // 右边吸附到 car.left
    if (Math.abs(rect.x + rect.width - car.x) <= snap) {
      newRect.x = car.x - rect.width - margin;
    }

    // 上边吸附到 car.bottom
    if (Math.abs(rect.y - (car.y + car.height)) <= snap) {
      newRect.y = car.y + car.height + margin;
    }

    // 下边吸附到 car.top
    if (Math.abs(rect.y + rect.height - car.y) <= snap) {
      newRect.y = car.y - rect.height - margin;
    }
  });

  return newRect;
}

// 碰撞检测增加 margin
function hasCollision(
  rect: { x: number; y: number; width: number; height: number },
  car: { x: number; y: number; width: number; height: number },
  snapMargin = 1,
) {
  // 如果矩形正好贴边，则允许
  const snappedLeft = Math.abs(rect.x - (car.x + car.width)) <= snapMargin;
  const snappedRight = Math.abs(rect.x + rect.width - car.x) <= snapMargin;
  const snappedTop = Math.abs(rect.y - (car.y + car.height)) <= snapMargin;
  const snappedBottom = Math.abs(rect.y + rect.height - car.y) <= snapMargin;

  if (snappedLeft || snappedRight || snappedTop || snappedBottom) {
    return false; // 贴边吸附时不算碰撞
  }

  // 否则正常碰撞检测
  return Konva.Util.haveIntersection(rect, car);
}

export default function RectDrawer() {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const { setStageScale } = useHybirdStore(
    useShallow((store) => {
      return {
        setStageScale: store.setStageScale,
      };
    }),
  );

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [rects, setRects] = useState<Array<{ id: string; x: number; y: number; width: number; height: number }>>([]);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const [isUseFullRect, setIsUseFullRect] = useState(false);
  const [scale, setScale] = useState(1);

  // 车身矩形（禁止进入）
  const carRect = { x: 0, y: 0, width: 200, height: 100 };
  // 叉臂矩形
  const armRect = { x: 30, y: 100, width: 140, height: 300 };
  const snap = 2;

  // ESC 取消绘制
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawing(false);
        setPreview(null);
        setStartPoint(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (e.evt.button !== 0) return;
    const pos = getRelativePointerPosition(layerRef.current);
    setStartPoint(pos);
    setPreview({ x: pos.x, y: pos.y, width: 0, height: 0 });
    setIsDrawing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isDrawing || !startPoint) return;

      const pos = getRelativePointerPosition(layerRef.current);
      let { x, y, width, height } = normalizeRect(startPoint, pos);

      // Shift 约束正方形
      if (e.evt.shiftKey) {
        const size = Math.max(width, height);
        x = startPoint.x <= pos.x ? startPoint.x : startPoint.x - size;
        y = startPoint.y <= pos.y ? startPoint.y : startPoint.y - size;
        width = size;
        height = size;
      }

      let newRect = { x, y, width, height };
      const stage = stageRef.current;
      if (!stage) return;

      // 获取所有车体部件
      const carNodes = stage.find<Konva.Layer>('.car')[0].find<Konva.Rect>('Rect');
      const carRects = carNodes.map(getRectBox);

      // 吸附处理
      const snappedRect = applySnap(newRect, carRects, snap);

      // 判断是否贴边
      const isSnapped = isSnappedToAnyCar(snappedRect, carRects, snap);
      setIsUseFullRect(isSnapped);

      // 统一碰撞检测（车体 + 已有矩形）
      let intersecting = false;

      // 与车体碰撞
      if (carRects.some((car) => hasCollision(snappedRect, car))) {
        intersecting = true;
      }

      // 与已有矩形碰撞
      if (!intersecting) {
        for (const r of rects) {
          if (Konva.Util.haveIntersection(r, snappedRect)) {
            intersecting = true;
            break;
          }
        }
      }

      setIsIntersecting(intersecting);
      setPreview(snappedRect);
    },
    [isDrawing, startPoint, rects],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !startPoint || !preview) return;

    const stage = stageRef.current;
    if (!stage) return;

    // 获取所有车体部件
    const carNodes = stage.find<Konva.Layer>('.car')[0].find<Konva.Rect>('Rect');
    const carRects = carNodes.map(getRectBox);

    // 吸附后的矩形
    const snappedRect = applySnap(preview, carRects, snap);

    // 判断是否贴边
    const isSnapped = isSnappedToAnyCar(snappedRect, carRects, snap);

    // 碰撞检测（车体 + 已有矩形）
    let intersecting = false;

    if (carRects.some((car) => hasCollision(snappedRect, car))) {
      intersecting = true;
    }

    if (!intersecting) {
      for (const r of rects) {
        if (Konva.Util.haveIntersection(r, snappedRect)) {
          intersecting = true;
          break;
        }
      }
    }

    setIsIntersecting(intersecting);

    // 仅在尺寸足够、贴边、无碰撞时才添加
    if (snappedRect.width > 1 && snappedRect.height > 1 && isSnapped && !intersecting) {
      setRects((prev) => [...prev, { id: `rect_${Date.now()}`, ...snappedRect }]);
    }

    // 重置绘制状态
    setIsDrawing(false);
    setStartPoint(null);
    setPreview(null);
  }, [isDrawing, startPoint, preview, rects]);

  // 缩放
  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX() || 1;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = { x: (pointer.x - stage.x()) / oldScale, y: (pointer.y - stage.y()) / oldScale };
    const scaleBy = 1.05;
    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    stage.scale({ x: newScale, y: newScale });
    stage.position({ x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale });
    stage.batchDraw();
    setScale(newScale);
  }, []);

  // 将 (0,0) 移动到视图中心
  function centerOriginWithAnimation() {
    const stage = stageRef.current;
    if (!stage || !size) return;

    const { width, height } = size;

    // 目标位置: 让 (0,0) 落在画布中心
    const targetX = width / 2;
    const targetY = height / 2;
    console.log('targetX', targetX);
    console.log('targetY', targetY);

    const tween = new Konva.Tween({
      node: stage,
      duration: 0.6, // 动画时长 (秒)
      easing: Konva.Easings.EaseInOut,
      x: targetX,
      y: targetY,
      onFinish: () => {
        setStageScale(0.99);
      },
    });
    tween.play();
  }
  useEffect(() => {
    centerOriginWithAnimation();
  }, [size]);
  useEffect(() => {
    setStageScale(scale);
  }, [scale]);

  const stageStyle = useMemo(() => ({ cursor: isDrawing ? 'crosshair' : 'default' }), [isDrawing]);
  return (
    <div className='w-full h-full flex flex-col !absolute left-0 top-0'>
      <div className='mb-3 flex items-center gap-3'>
        <span className='text-sm opacity-80'>
          左键拖拽绘制矩形；按住 Shift 约束为正方形；Esc 取消；滚轮缩放（以鼠标为中心）。
        </span>
        <span className='ml-auto text-sm opacity-60'>当前缩放：{Math.round(scale * 100)}%</span>
      </div>
      <div className='flex-1 bg-white' ref={ref}>
        <Stage
          ref={stageRef}
          width={size?.width}
          height={size?.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          style={stageStyle}
        >
          {/* 车身 */}
          <Layer name='car'>
            <Rect
              name='car-header'
              x={carRect.x}
              y={carRect.y}
              width={carRect.width}
              height={carRect.height}
              fill='rgba(0,255,255,0.3)'
            />
            {/* 叉臂 */}
            <Rect
              name='car-arm'
              x={armRect.x}
              y={armRect.y}
              width={armRect.width}
              height={armRect.height}
              fill='rgba(255,0,0,0.3)'
            />
          </Layer>
          <LineGrid CanvasWidth={size?.width} CanvasHeight={size?.height} />
          {/* 绘制 */}
          <Layer ref={layerRef}>
            {rects.map((r) => (
              <Rect
                key={r.id}
                x={r.x}
                y={r.y}
                width={r.width}
                height={r.height}
                stroke='#ffd33d'
                strokeWidth={2}
                dash={[4, 4]}
                listening={false}
              />
            ))}
            {preview && (
              <Group name='preview'>
                {/* 显示起点坐标与长宽 */}
                <Text
                  text={`(${Math.round(preview.x)}, ${Math.round(preview.y)})${Math.round(preview.width)}x${Math.round(preview.height)}`}
                  x={Math.round(preview.x)}
                  y={Math.round(preview.y) - 10}
                  fontSize={10}
                  fill='black'
                />
                <Rect
                  x={preview.x}
                  y={preview.y}
                  width={preview.width}
                  height={preview.height}
                  stroke={isUseFullRect && !isIntersecting ? 'green' : isIntersecting ? 'red' : '#22d3ee'}
                  strokeWidth={2}
                  dash={[8, 6]}
                  fill={isIntersecting ? 'rgba(255,0,0,0.2)' : 'transparent'}
                  listening={false}
                />
              </Group>
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
