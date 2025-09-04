import { LineGrid } from '@/components/InitStage/components/LineGrid';
import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import { useSize } from 'ahooks';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Layer, Rect, Stage, Text, Transformer } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import CarModel from './component/newCarComponents/carModel';

// 工具函数
function getRectBox(node: Konva.Rect) {
  return { x: node.x(), y: node.y(), width: node.width(), height: node.height() };
}
/**
 * 获取相对指针位置
 */
function getRelativePointerPosition(node: Konva.Node | null) {
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
function normalizeRect(a: { x: number; y: number }, b: { x: number; y: number }) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const width = Math.abs(b.x - a.x);
  const height = Math.abs(b.y - a.y);
  return { x, y, width, height };
}
/**
 * 检查是否吸附到车
 */
function isSnappedToCar(rect, car, snap = 1, margin = 1) {
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
function isSnappedToAnyCar(rect, carRects, snap = 1) {
  return carRects.some((car) => isSnappedToCar(rect, car, snap));
}
/**
 * 应用吸附
 */
function applySnap(rect, carRects, snap = 5, margin = 1) {
  const newRect = { ...rect };
  carRects.forEach((car) => {
    if (Math.abs(rect.x - (car.x + car.width)) <= snap) newRect.x = car.x + car.width + margin;
    if (Math.abs(rect.x + rect.width - car.x) <= snap) newRect.x = car.x - rect.width - margin;
    if (Math.abs(rect.y - (car.y + car.height)) <= snap) newRect.y = car.y + car.height + margin;
    if (Math.abs(rect.y + rect.height - car.y) <= snap) newRect.y = car.y - rect.height - margin;
  });
  return newRect;
}
/**
 * 检查是否碰撞
 */
function hasCollision(rect, car, snapMargin = 1) {
  const snappedLeft = Math.abs(rect.x - (car.x + car.width)) <= snapMargin;
  const snappedRight = Math.abs(rect.x + rect.width - car.x) <= snapMargin;
  const snappedTop = Math.abs(rect.y - (car.y + car.height)) <= snapMargin;
  const snappedBottom = Math.abs(rect.y + rect.height - car.y) <= snapMargin;
  if (snappedLeft || snappedRight || snappedTop || snappedBottom) return false;
  return Konva.Util.haveIntersection(rect, car);
}

// ✅ 统一校验函数
function validateRect(rect, carRects, otherRects, snap = 2) {
  const snappedRect = applySnap(rect, carRects, snap);
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
  return { rect: snappedRect, isSnapped, isIntersecting: intersecting };
}

export default function RectDrawer() {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const ref = useRef<HTMLDivElement>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const size = useSize(ref);
  const { setStageScale } = useHybirdStore(useShallow((store) => ({ setStageScale: store.setStageScale })));

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [rects, setRects] = useState<Array<{ id: string; x: number; y: number; width: number; height: number }>>([]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isUseFullRect, setIsUseFullRect] = useState(false);
  const [scale, setScale] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const snap = 2;

  // Esc 取消绘制
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

  // 绘制 - MouseDown
  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) setSelectedId(null);
    if (e.target instanceof Konva.Rect && e.target.parent?.attrs?.className === 'rect') {
      setSelectedId(e.target.id());
      return;
    }
    // 判断是否是缩放的Rect
    if (e.target instanceof Konva.Rect && e.target.parent?.attrs?.name === 'transformer') {
      return;
    }
    if (e.target instanceof Konva.Transformer) return;
    if (e.evt.button !== 0) return;
    const pos = getRelativePointerPosition(layerRef.current);
    setStartPoint(pos);
    setPreview({ x: pos.x, y: pos.y, width: 0, height: 0 });
    setIsDrawing(true);
  }, []);

  // 绘制 - MouseMove
  const handleMouseMove = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isDrawing || !startPoint) return;
      const pos = getRelativePointerPosition(layerRef.current);
      let { x, y, width, height } = normalizeRect(startPoint, pos);
      if (e.evt.shiftKey) {
        const size = Math.max(width, height);
        x = startPoint.x <= pos.x ? startPoint.x : startPoint.x - size;
        y = startPoint.y <= pos.y ? startPoint.y : startPoint.y - size;
        width = size;
        height = size;
      }
      const stage = stageRef.current;
      if (!stage) return;
      const carNodes = stage.find<Konva.Layer>('.car')[0].find<Konva.Rect>('Rect');
      const carRects = carNodes.map(getRectBox);

      const {
        rect: snappedRect,
        isSnapped,
        isIntersecting,
      } = validateRect({ x, y, width, height }, carRects, rects, snap);
      setPreview(snappedRect);
      setIsUseFullRect(isSnapped);
      setIsIntersecting(isIntersecting);
    },
    [isDrawing, startPoint, rects],
  );

  // 绘制 - MouseUp
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !startPoint || !preview) return;
    const stage = stageRef.current;
    if (!stage) return;
    const carNodes = stage.find<Konva.Layer>('.car')[0].find<Konva.Rect>('Rect');
    const carRects = carNodes.map(getRectBox);
    const { rect: snappedRect, isSnapped, isIntersecting } = validateRect(preview, carRects, rects, snap);
    setIsIntersecting(isIntersecting);
    if (snappedRect.width > 1 && snappedRect.height > 1 && isSnapped && !isIntersecting) {
      setRects((prev) => [...prev, { id: `rect_${Date.now()}`, ...snappedRect }]);
    }
    setIsDrawing(false);
    setStartPoint(null);
    setPreview(null);
  }, [isDrawing, startPoint, preview, rects]);

  // 拖拽
  const handleDragMove = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const node = e.target as Konva.Rect;
      const id = node.id();
      const stage = stageRef.current;
      if (!stage) return;
      const carNodes = stage.find<Konva.Layer>('.car')[0].find<Konva.Rect>('Rect');
      const carRects = carNodes.map(getRectBox);
      const rawRect = { x: node.x(), y: node.y(), width: node.width(), height: node.height() };
      const {
        rect: snappedRect,
        isSnapped,
        isIntersecting,
      } = validateRect(
        rawRect,
        carRects,
        rects.filter((r) => r.id !== id),
        snap,
      );

      // 如果矩形不在贴靠状态，松开后需要回到拖拽开始的位置
      if (!isSnapped || isIntersecting) {
        node.stroke(isIntersecting ? 'red' : '#22d3ee');
        node.fill(isIntersecting ? 'rgba(255,0,0,0.2)' : 'rgba(255,211,61,0.2)');
      } else {
        node.position({ x: snappedRect.x, y: snappedRect.y });
        node.stroke('green');
        node.fill('rgba(255,211,61,0.2)');
      }

      setRects((prev) => prev.map((r) => (r.id === id ? { ...r, x: node.x(), y: node.y() } : r)));
    },
    [rects],
  );

  // 拖拽结束 - 判断是否需要回到起始位置（加动画）
  const handleDragEnd = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const node = e.target as Konva.Rect;
      const startPos = node.getAttr('startPos');
      if (!startPos) return;

      const id = node.id();
      const stage = stageRef.current;
      if (!stage) return;
      const carNodes = stage.find<Konva.Layer>('.car')[0].find<Konva.Rect>('Rect');
      const carRects = carNodes.map(getRectBox);

      const rawRect = { x: node.x(), y: node.y(), width: node.width(), height: node.height() };
      const { isSnapped, isIntersecting } = validateRect(
        rawRect,
        carRects,
        rects.filter((r) => r.id !== id),
        snap,
      );

      if (!isSnapped || isIntersecting) {
        new Konva.Tween({
          node,
          duration: 0.3,
          easing: Konva.Easings.EaseInOut,
          x: startPos.x,
          y: startPos.y,
          onFinish: () => {
            setRects((prev) => prev.map((r) => (r.id === id ? { ...r, x: startPos.x, y: startPos.y } : r)));
            // 移除 startPos 属性
            node.setAttr('startPos', null);
            node.setAttr('fill', 'rgba(255,211,61,0.2)');
            node.setAttr('stroke', '#ffd33d');
          },
        }).play();
      }
    },
    [rects],
  );

  // Transformer 缩放
  const handleTransform = useCallback(
    (e: KonvaEventObject<Event>) => {
      const node = e.target as Konva.Rect;
      const id = node.id();
      const stage = stageRef.current;
      if (!stage) return;

      const carNodes = stage.find<Konva.Layer>('.car')[0].find<Konva.Rect>('Rect');
      const carRects = carNodes.map(getRectBox);

      // 缩放后的宽高（考虑 scaleX/Y）
      const rawRect = {
        x: node.x(),
        y: node.y(),
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY(),
      };

      const {
        rect: snappedRect,
        isSnapped,
        isIntersecting,
      } = validateRect(
        rawRect,
        carRects,
        rects.filter((r) => r.id !== id),
        snap,
      );

      // 更新外观反馈
      node.position({ x: snappedRect.x, y: snappedRect.y });
      node.width(snappedRect.width);
      node.height(snappedRect.height);
      node.stroke(isSnapped && !isIntersecting ? 'green' : isIntersecting ? 'red' : '#22d3ee');
      node.fill(isIntersecting ? 'rgba(255,0,0,0.2)' : 'rgba(255,211,61,0.2)');

      // 更新 rects
      setRects((prev) => prev.map((r) => (r.id === id ? { ...r, ...snappedRect } : r)));

      // 清理 scale，避免累计缩放
      node.scaleX(1);
      node.scaleY(1);
    },
    [rects],
  );

  // Tramsformer 开始缩放
  const handleTransformStart = useCallback((e: KonvaEventObject<Event>) => {
    const node = e.target as Konva.Rect;
    node.setAttr('startPos', { x: node.x(), y: node.y(), width: node.width(), height: node.height() });
    // node.setAttr('startScaleY', node.scaleY());
  }, []);

  // Transformer 缩放结束
  const handleTransformEnd = useCallback(
    (e: KonvaEventObject<Event>) => {
      debugger;
      const node = e.target as Konva.Rect;
      const id = node.id();
      const stage = stageRef.current;
      if (!stage) return;

      const carNodes = stage.find<Konva.Layer>('.car')[0].find<Konva.Rect>('Rect');
      const carRects = carNodes.map(getRectBox);

      const rawRect = {
        x: node.x(),
        y: node.y(),
        width: node.width(),
        height: node.height(),
      };

      const { isSnapped, isIntersecting } = validateRect(
        rawRect,
        carRects,
        rects.filter((r) => r.id !== id),
        snap,
      );

      if (!isSnapped || isIntersecting) {
        // 回退动画
        const startPos = node.getAttr('startPos');
        if (!startPos) return;
        new Konva.Tween({
          node,
          duration: 0.3,
          easing: Konva.Easings.EaseInOut,
          x: startPos.x,
          y: startPos.y,
          width: startPos.width,
          height: startPos.height,
          onFinish: () => {
            node.setAttrs({
              stroke: '#ffd33d',
              fill: 'rgba(255,211,61,0.2)',
            });
          },
        }).play();
      }
    },
    [rects],
  );

  // Transformer 绑定
  useEffect(() => {
    if (transformerRef.current && selectedId) {
      const stage = stageRef.current;
      if (!stage) return;
      const selectedNode = stage.findOne(`#${selectedId}`);
      transformerRef.current.nodes(selectedNode ? [selectedNode] : []);
    } else if (transformerRef.current && !selectedId) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId]);

  // 缩放滚轮
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

  // (0,0) 居中
  function centerOriginWithAnimation() {
    const stage = stageRef.current;
    if (!stage || !size) return;
    const { width, height } = size;
    const tween = new Konva.Tween({
      node: stage,
      duration: 0.6,
      easing: Konva.Easings.EaseInOut,
      x: width / 2,
      y: height / 2,
      onFinish: () => setStageScale(0.99),
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
      <div className='p-2 flex items-center gap-3 absolute bottom-0 left-0 right-0'>
        <span className='text-sm opacity-80'>左键拖拽绘制矩形；按住 Shift 约束为正方形；Esc 取消。</span>
        <span className='ml-auto text-sm opacity-60'>当前缩放：{Math.round(scale * 100)}%</span>
      </div>
      <div className='flex-1' ref={ref}>
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
          <LineGrid CanvasWidth={size?.width} CanvasHeight={size?.height} />
          <CarModel />
          <Layer ref={layerRef}>
            {/* 绘制矩形 */}
            {rects.map((r) => (
              <Group key={r.id} className='rect'>
                <Rect
                  id={r.id}
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  stroke='#ffd33d'
                  strokeWidth={2}
                  dash={[4, 4]}
                  fill='rgba(255,211,61,0.2)'
                  draggable
                  onTransform={handleTransform}
                  onTransformStart={handleTransformStart}
                  onTransformEnd={handleTransformEnd}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                  onClick={() => setSelectedId(r.id)}
                  onTap={() => setSelectedId(r.id)}
                  onDragStart={(e) => {
                    const node = e.target as Konva.Rect;
                    node.setAttrs({
                      startPos: {
                        x: node.x(),
                        y: node.y(),
                      },
                    });
                  }}
                />
              </Group>
            ))}
            {/* 绘制 */}
            {preview && (
              <Group name='preview'>
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
            {/* 形变 */}
            <Transformer
              ref={transformerRef}
              rotateEnabled={false}
              name='transformer'
              boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5 ? oldBox : newBox)}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
