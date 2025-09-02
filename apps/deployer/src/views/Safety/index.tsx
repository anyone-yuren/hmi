import { useSize } from 'ahooks';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

// 小工具：获取指针在某个节点（通常是 Layer）坐标系中的位置，考虑缩放/平移
function getRelativePointerPosition(node: Konva.Node | null) {
  if (!node) return { x: 0, y: 0 };
  const stage = node.getStage();
  const pointer = stage?.getPointerPosition();
  if (!pointer) return { x: 0, y: 0 };
  const transform = node.getAbsoluteTransform().copy();
  transform.invert();
  const pos = transform.point(pointer);
  return pos;
}

// 归一化矩形（处理从右下↖等方向绘制时 x/y/width/height 的正负问题）
function normalizeRect(a: { x: number; y: number }, b: { x: number; y: number }) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const width = Math.abs(b.x - a.x);
  const height = Math.abs(b.y - a.y);
  return { x, y, width, height };
}

export default function RectDrawer() {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [rects, setRects] = useState<Array<{ id: string; x: number; y: number; width: number; height: number }>>([]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [scale, setScale] = useState(1);

  const stageWidth = typeof window !== 'undefined' ? window.innerWidth - 32 : 1200;
  const stageHeight = typeof window !== 'undefined' ? window.innerHeight * 0.7 : 600;

  // ESC 取消当前绘制
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

      // Shift 约束为正方形
      if (e.evt.shiftKey) {
        const size = Math.max(width, height);
        x = startPoint.x <= pos.x ? startPoint.x : startPoint.x - size;
        y = startPoint.y <= pos.y ? startPoint.y : startPoint.y - size;
        width = size;
        height = size;
      }

      // 边界检测
      const stage = stageRef.current;
      const maxX = stage ? stage.width() / (stage.scaleX() || 1) : stageWidth / scale;
      const maxY = stage ? stage.height() / (stage.scaleY() || 1) : stageHeight / scale;
      x = Math.max(0, x);
      y = Math.max(0, y);
      if (x + width > maxX) width = Math.max(0, maxX - x);
      if (y + height > maxY) height = Math.max(0, maxY - y);

      // 相交检测
      let intersecting = false;
      let newRect = { x, y, width, height };

      rects.forEach((r) => {
        if (Konva.Util.haveIntersection({ x: r.x, y: r.y, width: r.width, height: r.height }, newRect)) {
          intersecting = true;

          const overlapX1 = Math.max(r.x, newRect.x);
          const overlapY1 = Math.max(r.y, newRect.y);
          const overlapX2 = Math.min(r.x + r.width, newRect.x + newRect.width);
          const overlapY2 = Math.min(r.y + r.height, newRect.y + newRect.height);

          if (overlapX1 < overlapX2 && overlapY1 < overlapY2) {
            // 横向卡边
            if (pos.x > startPoint.x) {
              newRect.width = Math.max(0, r.x - newRect.x);
            } else {
              const rightEdge = r.x + r.width;
              newRect.x = rightEdge;
              newRect.width = Math.max(0, pos.x - rightEdge);
            }
            // 纵向卡边
            if (pos.y > startPoint.y) {
              newRect.height = Math.max(0, r.y - newRect.y);
            } else {
              const bottomEdge = r.y + r.height;
              newRect.y = bottomEdge;
              newRect.height = Math.max(0, pos.y - bottomEdge);
            }
          }
        }
      });

      setIsIntersecting(intersecting);
      setPreview(newRect);
    },
    [isDrawing, startPoint, scale, stageWidth, stageHeight, rects],
  );

  const handleMouseUp = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!isDrawing || !startPoint || !preview) return;
      if (preview.width > 1 && preview.height > 1 && !isIntersecting) {
        setRects((prev) => [...prev, { id: `rect_${Date.now()}`, ...preview }]);
      }
      setIsDrawing(false);
      setStartPoint(null);
      setPreview(null);
      setIsIntersecting(false);
    },
    [isDrawing, startPoint, preview, isIntersecting],
  );

  // 缩放处理
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
              <Rect
                x={preview.x}
                y={preview.y}
                width={preview.width}
                height={preview.height}
                stroke={isIntersecting ? 'red' : '#22d3ee'}
                strokeWidth={2}
                dash={[8, 6]}
                fill={isIntersecting ? 'rgba(255,0,0,0.2)' : 'transparent'}
                listening={false}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
