import { useStageEvents } from '@/views/Hybrid/hooks/useStage';
import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import Hammer from 'hammerjs';
import { memo, useEffect, useState } from 'react';
import { Stage } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import PageLoading from '../PageLoading';
import { LineGrid } from './components/LineGrid';
import { MAX_SCALE, MIN_SCALE } from './constants/config';
import useStage from './hooks/useStage'; // 假设自定义 hook

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
  const { handleTouchMove, handleTouchStart, handleTouchEnd, handleDragMove } = useStageEvents();
  const { mapLoading, setHybirdStage, beginPose, setRadarVisible, setStageScale, setStagePos } = useHybirdStore(
    useShallow((state) => ({
      mapLoading: state.mapLoading,
      setHybirdStage: state.setHybirdStage,
      beginPose: state.beginPose,
      setRadarVisible: state.setRadarVisible,
      setStageScale: state.setStageScale,
      setStagePos: state.setStagePos,
    })),
  );

  const { size = null, children, onWheelCallback, minScale, draggable = true, ...rest } = props;
  const { stageRef, onWheel } = useStage({
    onWheelCallback,
    minScale: minScale,
  });
  const [loading, setLoading] = useState(mapLoading);
  useEffect(() => {
    setLoading(mapLoading);
  }, [mapLoading]);

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
      const newScale = oldScale * e.scale;
      const scaled = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

      // 捏合 1 点位
      const pointer1 = {
        x: e.pointers[0].clientX,
        y: e.pointers[0].clientY,
      };
      // 捏合 2 点位
      const pointer2 = {
        x: e.pointers[1].clientX,
        y: e.pointers[1].clientY,
      };
      // 计算捏合中心点
      const newCenter = {
        x: (pointer1.x + pointer2.x) / 2,
        y: (pointer1.y + pointer2.y) / 2,
      };

      // 计算新的位置
      const newPosX = oldPos.x - (newCenter.x - oldPos.x) * (scaled / oldScale - 1);
      const newPosY = oldPos.y - (newCenter.y - oldPos.y) * (scaled / oldScale - 1);

      stage.stopDrag();
      stage.draggable(false);
      stage.scale({ x: scaled, y: scaled });
      stage.position({ x: newPosX, y: newPosY });
      setStagePos({ x: newPosX, y: newPosY });
      stage.draggable(true);
      setStageScale(scaled);
      stage.batchDraw();
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
          <LineGrid CanvasWidth={size?.width} CanvasHeight={size?.height} />
          {children}
        </Stage>
      )}
    </>
  );
};

export default memo(InitStage);
