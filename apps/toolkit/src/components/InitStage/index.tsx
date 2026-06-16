import { useStageEvents } from '@/views/Hybrid/hooks/useStage';
import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import Hammer from 'hammerjs';
import { memo, useEffect, useState } from 'react';
import { Stage } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import PageLoading from '../PageLoading';
import { LineGrid } from './components/LineGrid';
import { MAX_SCALE, MIN_SCALE } from './constants/config';
import useStage from './hooks/useStage'; // 假设自定义 hook.
interface IProps {
  size?: {
    width: number;
    height: number;
  };
  children: any;
  onWheelCallback?: any;
  minScale?: number;
  draggable?: boolean;
}

const InitStage = (props: IProps) => {
  const { handleTouchMove, handleTouchStart, handleTouchEnd, handleDragMove } =
    useStageEvents();
  const {
    mapLoading,
    setHybirdStage,
    beginPose,
    setRadarVisible,
    setStageScale,
    setStagePos,
    setIsDrag,
    stagePos,
    stageScale,
  } = useHybirdStore(
    useShallow((state) => ({
      mapLoading: state.mapLoading,
      setHybirdStage: state.setHybirdStage,
      beginPose: state.beginPose,
      setRadarVisible: state.setRadarVisible,
      setStageScale: state.setStageScale,
      setStagePos: state.setStagePos,
      setIsDrag: state.setIsDrag,
      stagePos: state.stagePos,
      stageScale: state.stageScale,
    })),
  );

  const {
    size = null,
    children,
    onWheelCallback,
    minScale,
    draggable = true,
    ...rest
  } = props;
  const { stageRef, onWheel } = useStage({
    onWheelCallback,
    minScale: minScale,
  });
  const [loading, setLoading] = useState(mapLoading);

  useEffect(() => {
    setLoading(mapLoading);
  }, [mapLoading]);

  // 当舞台位置或缩放变化时，强制刷新
  useEffect(() => {
    if (stageRef.current) {
      const stage = stageRef.current.getStage();
      if (stage) {
        stage.batchDraw();
      }
    }
  }, [stagePos, stageScale, stageRef]);

  useEffect(() => {
    if (!size) return;
    const stage = stageRef.current?.getStage();
    if (stage) {
      stage.batchDraw();
    }
  }, [size]);

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current?.getStage();
    if (stage) {
      setHybirdStage(stage);
      stage.batchDraw();
      setStageScale(1);
    }
  }, [stageRef.current, size]);

  useEffect(() => {
    const stage = stageRef.current;

    stage?.on('mousedown', () => {
      setRadarVisible(false);
    });
    stage?.on('mouseup', () => {
      setRadarVisible(true);
    });
    stage?.on('touchstart', () => {
      setRadarVisible(false);
    });
    stage?.on('touchend', () => {
      setRadarVisible(true);
    });
  }, [size]);

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current!;
    const hammer = new Hammer(stage.container());

    hammer.get('pinch').set({ enable: true });

    let oldScale = stage.scaleX();
    let oldPos = { x: 0, y: 0 };

    hammer.on('pinchstart', () => {
      oldScale = stage.scaleX();
      oldPos = stage.position();
    });

    hammer.on('pinchmove', (e: any) => {
      const pointer = stage.getPointerPosition(); // 获取当前指针位置
      if (!pointer) return;
      // 计算新的缩放比例
      const newScale = oldScale * e.scale;
      const mousePointTo = {
        x: (pointer.x - oldPos.x) / oldScale,
        y: (pointer.y - oldPos.y) / oldScale,
      };
      stage.scale({ x: newScale, y: newScale });
      stage.position({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      });
      stage.batchDraw();
      // 限制缩放比例在最小值和最大值之间
      if (newScale < (minScale || MIN_SCALE) || newScale > MAX_SCALE) return;
      setStageScale(newScale);
      setStagePos(stage.position());
    });

    hammer.on('pinchend', () => {
      oldScale = stage.scaleX();
      oldPos = stage.position();
    });

    return () => {
      hammer.off('pinch');
      hammer.destroy();
    };
  }, [stageRef.current]);

  return (
    <>
      {loading && <PageLoading></PageLoading>}
      {size && (
        <Stage
          width={size?.width}
          height={size?.height}
          ref={stageRef}
          draggable={!beginPose && draggable}
          onWheel={onWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDragMove={handleDragMove}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          {...rest}
        >
          {<LineGrid CanvasWidth={size?.width} CanvasHeight={size?.height} />}
          {children}
        </Stage>
      )}
    </>
  );
};

export default memo(InitStage);
