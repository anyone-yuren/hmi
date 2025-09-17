import { LineGrid } from '@/components/InitStage/components/LineGrid';
import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import { useRequest, useSize } from 'ahooks';
import { ConfigProvider, Drawer, theme } from 'antd';
import Hammer from 'hammerjs';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import CarModel from './component/newCarComponents/carModel';
import DrawerContent from './component/newCarComponents/drawerContent';
import Maphandles from './component/newCarComponents/mapHandles';
import ObsInfoPanel from './component/newCarComponents/obsInfo';
import SafetyHeader from './component/newCarComponents/safetyHeader';
import WsContainer from './component/WsContainer';
import { safetyConfig } from './service';
import { buildCarEdgeGuides, getRectBox, getRelativePointerPosition, normalizeRect, validateRect } from './utils/draw';

export default function RectDrawer() {
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const ref = useRef<HTMLDivElement>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const size = useSize(ref);
  const [isDark, setIsDark] = useState(false);
  const { setStageScale } = useHybirdStore(useShallow((store) => ({ setStageScale: store.setStageScale })));
  const [show, setShow] = useState(true);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [preview, setPreview] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [rects, setRects] = useState<Array<{ id: string; x: number; y: number; width: number; height: number }>>([
    {
      id: 'rect_1757730358977',
      x: -479.3291688305644,
      y: -443.44736089214314,
      width: 278.3291688305644,
      height: 152.88503639988755,
    },
    {
      id: 'rect_1757730361831',
      x: 201,
      y: -470.8882648613537,
      width: 262.64865227673,
      height: 156.80516553834622,
    },
    {
      id: 'rect_1757730364464',
      x: -480.6902019382337,
      y: 242.57523833812138,
      width: 309.6902019382337,
      height: 184.24606950755685,
    },
  ]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isUseFullRect, setIsUseFullRect] = useState(false);
  const [scale, setScale] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // 绘制吸附辅助线
  const [snapLines, setSnapLines] = useState<{ points: number[]; orientation: 'vertical' | 'horizontal' }[]>([]);
  const lastValidRectRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const [reRenderLineGrid, setReRenderLineGrid] = useState<boolean>(false);
  /** -------------鼠标右键 start -------------- */
  const isPanningRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const stageStartPosRef = useRef<{ x: number; y: number } | null>(null);
  /** -------------鼠标右键 end -------------- */
  /** -------------避障方案调整 start -------------- */
  const [openUpdateObsDrawer, setOpenUpdateObsDrawer] = useState(false);

  const reRenderLineGridFn = () => {
    setReRenderLineGrid(!reRenderLineGrid);
  };
  /** -------------避障方案调整 end -------------- */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const container = stage.container();

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        // 右键
        e.preventDefault(); // 阻止默认右键菜单
        isPanningRef.current = true;
        setReRenderLineGrid(true);
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        stageStartPosRef.current = { x: stage.x(), y: stage.y() };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanningRef.current || !lastPosRef.current || !stageStartPosRef.current) return;

      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;

      stage.x(stageStartPosRef.current.x + dx);
      stage.y(stageStartPosRef.current.y + dy);
      stage.batchDraw();
    };

    const handleMouseUp = () => {
      isPanningRef.current = false;
      setReRenderLineGrid(false);
      lastPosRef.current = null;
      stageStartPosRef.current = null;
    };

    // 阻止默认右键菜单
    container.addEventListener('contextmenu', (e) => e.preventDefault());

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);
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
    if (!noData) return;
    if (e.target === e.target.getStage()) setSelectedId(null);
    if (e.target instanceof Konva.Rect && e.target.parent?.attrs?.className === 'rect') {
      setSelectedId(e.target.id());
      setOpenUpdateObsDrawer(true);
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
      const stage = stageRef.current;
      if (!stage) return;

      const pos = getRelativePointerPosition(layerRef.current);
      if (!pos) return;

      const carLayer = stage.find<Konva.Layer>('.car')[0];
      const carNodes = carLayer ? carLayer.find<Konva.Rect>('Rect') : [];
      const carRects = carNodes.map(getRectBox);

      // ① 无论是否在绘制，都先计算“悬停靠近车体边缘”的辅助线
      const hoverLines = buildCarEdgeGuides(pos, carRects, snap);

      // 👉 根据是否有 hoverLines 来决定鼠标样式
      if (hoverLines.length > 0) {
        stage.container().style.cursor = 'crosshair';
      } else {
        stage.container().style.cursor = 'default';
      }

      // ② 未在绘制：只显示悬停辅助线，然后返回
      if (!isDrawing || !startPoint) {
        setSnapLines(hoverLines);
        return;
      }

      // ③ 正在绘制：沿用你的原有逻辑 + 合并悬停辅助线
      let { x, y, width, height } = normalizeRect(startPoint, pos);

      if (e.evt.shiftKey) {
        const size = Math.max(width, height);
        x = startPoint.x <= pos.x ? startPoint.x : startPoint.x - size;
        y = startPoint.y <= pos.y ? startPoint.y : startPoint.y - size;
        width = size;
        height = size;
      }

      const {
        rect: snappedRect,
        isSnapped,
        isIntersecting,
        snapLines: rectSnapLines,
      } = validateRect({ x, y, width, height }, carRects, rects, snap);

      if (isIntersecting) {
        if (lastValidRectRef.current) setPreview(lastValidRectRef.current);
        // 发生碰撞时也给出悬停线（可选）
        setSnapLines(hoverLines);
        return;
      }

      setPreview(snappedRect);
      lastValidRectRef.current = snappedRect;
      setIsUseFullRect(isSnapped);
      setIsIntersecting(isIntersecting);

      // 合并：吸附线 + 悬停线
      setSnapLines([...rectSnapLines, ...hoverLines]);
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
    setSnapLines([]);
    // 拖拽结束后，清除最后合法位置
    lastValidRectRef.current = null;
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
        snapLines,
      } = validateRect(
        rawRect,
        carRects,
        rects.filter((r) => r.id !== id),
        snap,
      );
      setSnapLines(snapLines);
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
            node.setAttrs({
              fill: 'rgba(255,211,61,0.2)',
              stroke: '#ffd33d',
              startPos: null,
            });
            // ✅ 回退完成后清除吸附线
            setSnapLines([]);
          },
        }).play();
      } else {
        setSnapLines([]);
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
        snapLines,
      } = validateRect(
        rawRect,
        carRects,
        rects.filter((r) => r.id !== id),
        snap,
      );
      setSnapLines(snapLines);

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
            // ✅ 回退完成后清除吸附线
            setSnapLines([]);
          },
        }).play();
      } else {
        setSnapLines([]);
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
      scaleX: 0.5,
      scaleY: 0.5,
      onFinish: () => {
        setScale(0.5);
        setReRenderLineGrid(!reRenderLineGrid);
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

  //兼容移动端
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    if (!isMobile) {
      // PC 端：禁用 Hammer，直接返回
      return;
    }

    const hammer = new Hammer(stage.container());

    // 允许双指缩放
    hammer.get('pinch').set({ enable: true });
    // 允许单指拖拽
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    let lastCenter = null;
    let lastDist = 0;
    let lastPan = { x: 0, y: 0 };

    // 单指平移
    hammer.on('panstart', () => {
      const pos = stage.position();
      lastPan = { x: pos.x, y: pos.y };
    });

    hammer.on('panmove', (ev) => {
      stage.position({
        x: lastPan.x + ev.deltaX,
        y: lastPan.y + ev.deltaY,
      });
      stage.batchDraw();
    });
    hammer.on('panend', () => {
      reRenderLineGridFn();
    });

    return () => {
      hammer.destroy();
    };
  }, []);

  const { data: obstacleData, loading: obstacleDataLoading, run: refreshObstacleData } = useRequest(safetyConfig);

  // 定义一个state控制无数据不可操作。
  const [noData, setNoData] = useState(true);
  // useEffect(() => {
  //   if (obstacleData?.data?.length) {
  //     setNoData(true);
  //   } else {
  //     setNoData(false);
  //   }
  // }, [obstacleData]);

  return (
    <div
      className={`w-full h-full flex flex-col !absolute left-0 top-0 bg-white text-black ${isDark ? '!bg-black text-white' : ''}`}
    >
      {/* {obstacleDataLoading && <PanelLoading isDark={isDark} />} */}
      <ConfigProvider
        theme={{
          algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <SafetyHeader
          isDark={isDark}
          setIsDark={setIsDark}
          show={show}
          setShow={setShow}
          setOpenUpdateObsDrawer={setOpenUpdateObsDrawer}
          obsData={obstacleData?.data ?? []}
          loading={obstacleDataLoading}
        />
        {/* 避障信息 */}
        {/* <ObsInfoPanel setOpenUpdateObsDrawer={setOpenUpdateObsDrawer} /> */}

        <div className='flex-1 w-full relative'>
          <div className='h-full flex'>
            <ObsInfoPanel setOpenUpdateObsDrawer={setOpenUpdateObsDrawer} show={show} isDark={isDark} />
            <div className='relative h-full flex-1 min-w-0' ref={ref}>
              <Maphandles centerOriginWithAnimation={centerOriginWithAnimation} />
              <div className='p-2 flex items-center gap-3 absolute bottom-0 left-0 right-0'>
                {isMobile ? (
                  <div className='text-sm opacity-80'>绘制与编辑安全区域，请使用PC进行操作</div>
                ) : (
                  <>
                    <span className='text-sm opacity-80'>左键拖拽绘制矩形；按住 Shift 约束为正方形；Esc 取消。</span>
                    <span className='ml-auto text-sm opacity-60'>当前缩放：{Math.round(scale * 100)}%</span>
                  </>
                )}
              </div>
              <Stage
                ref={stageRef}
                width={size?.width}
                height={size?.height}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onWheel={handleWheel}
                style={stageStyle}
              >
                <LineGrid CanvasWidth={size?.width} CanvasHeight={size?.height} lastPos={reRenderLineGrid} />
                <CarModel />
                <Layer ref={layerRef}>
                  {/* 绘制矩形 */}
                  {rects.map((r) => (
                    <Group key={r.id} className='rect'>
                      {/* 坐标和尺寸提示 */}
                      {selectedId === r.id && (
                        <>
                          <Text
                            text={`(${0 - Math.round(r.y)}, ${0 - Math.round(r.x)}) ${Math.round(r.width)}x${Math.round(r.height)}`}
                            x={Math.round(r.x)}
                            y={Math.round(r.y) - 12} // 显示在矩形上方
                            fontSize={10}
                            fill={isDark ? '#fff' : '#000'}
                            listening={false} // 不可交互
                          />
                          {/* 显示右下角坐标 */}
                          <Text
                            text={`(${0 - Math.round(r.y + r.height)}, ${0 - Math.round(r.x + r.width)})`}
                            x={Math.round(r.x + r.width)}
                            y={Math.round(r.y + r.height)}
                            fontSize={10}
                            fill={isDark ? '#fff' : '#000'}
                          />
                        </>
                      )}
                      <Rect
                        id={r.id}
                        x={r.x}
                        y={r.y}
                        width={r.width}
                        height={r.height}
                        stroke={selectedId === r.id ? '#22d3ee' : '#ffd33d'}
                        strokeWidth={selectedId === r.id ? 1.5 : 2}
                        dash={[4, 4]}
                        fill={'rgba(255,211,61,0.2)'}
                        draggable={noData}
                        onTransform={handleTransform}
                        onTransformStart={handleTransformStart}
                        onTransformEnd={handleTransformEnd}
                        onDragMove={handleDragMove}
                        onDragEnd={handleDragEnd}
                        onClick={() => noData && setSelectedId(r.id)}
                        onTap={() => noData && setSelectedId(r.id)}
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
                        text={`(${0 - Math.round(preview.y)}, ${0 - Math.round(preview.x)})${Math.round(preview.width)}x${Math.round(preview.height)}`}
                        x={Math.round(preview.x)}
                        y={Math.round(preview.y) - 10}
                        fontSize={10}
                        fill={isDark ? '#fff' : '#000'}
                      />
                      {/* 显示右下角坐标 */}
                      <Text
                        text={`(${0 - Math.round(preview.y + preview.height)}, ${0 - Math.round(preview.x + preview.width)})`}
                        x={Math.round(preview.x + preview.width)}
                        y={Math.round(preview.y + preview.height)}
                        fontSize={10}
                        fill={isDark ? '#fff' : '#000'}
                      />
                      <Rect
                        x={preview.x}
                        y={preview.y}
                        width={preview.width}
                        height={preview.height}
                        stroke={
                          isUseFullRect && !isIntersecting ? 'rgba(0,150,136,0.6)' : isIntersecting ? 'red' : '#22d3ee'
                        }
                        strokeWidth={2}
                        dash={[8, 6]}
                        fill={
                          isUseFullRect && !isIntersecting
                            ? 'rgba(0,150,136,0.4)'
                            : isIntersecting
                              ? 'rgba(255,0,0,0.2)'
                              : 'rgba(255,211,61,0.2)'
                        }
                        listening={false}
                      />
                    </Group>
                  )}
                  {snapLines.map((line, idx) => (
                    <Line
                      key={idx}
                      points={line.points}
                      stroke='rgba(0,150,136,0.8)'
                      strokeWidth={2.5}
                      dash={[6, 4]}
                      listening={false}
                    />
                  ))}
                  {/* 形变 */}
                  <Transformer
                    ref={transformerRef}
                    rotateEnabled={false}
                    anchorStroke='#22d3ee'
                    anchorFill='#ffffff'
                    anchorCornerRadius={4} // 圆角
                    anchorStrokeWidth={2}
                    borderStroke='#22d3ee' // 外框描边
                    borderStrokeWidth={1.5}
                    borderDash={[6, 4]}
                    borderCornerRadius={4} // 外框圆角
                    name='transformer'
                    boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5 ? oldBox : newBox)}
                  />
                </Layer>
              </Stage>
            </div>
          </div>
        </div>

        <Drawer
          title='避障方案调整'
          open={openUpdateObsDrawer}
          onClose={() => setOpenUpdateObsDrawer(false)}
          width={'360px'}
          mask={false}
          rootClassName={isDark ? 'text-white' : 'text-black'}
          classNames={{
            body: `mb-12`,
          }}
          destroyOnHidden
        >
          <DrawerContent
            rects={rects}
            setRects={setRects}
            setSelectedId={setSelectedId}
            selectedId={selectedId}
            stage={stageRef?.current}
            size={size}
            setReRenderLineGrid={setReRenderLineGrid}
            reRenderLineGrid={reRenderLineGrid}
            setOpenUpdateObsDrawer={setOpenUpdateObsDrawer}
            isDark={isDark}
          />
        </Drawer>
      </ConfigProvider>
      <WsContainer>
        <></>
      </WsContainer>
    </div>
  );
}
