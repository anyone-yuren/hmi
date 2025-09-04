import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import { flatten } from 'lodash';
import { useMemo, useRef } from 'react';
import { Layer, Line } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';

export const LineGrid = (props: any) => {
  const { lastPos } = props;

  const lineRef = useRef<any>(null);
  const cellSize = 20;
  const { stagePos, hybirdStage, stageScale } = useHybirdStore(
    useShallow((store) => {
      return {
        hybirdStage: store.hybirdStage,
        stagePos: store.stagePos,
        stageScale: store.stageScale,
      };
    }),
  );

  const render = {
    rulerSize: 40,
  };

  const renderGrid = useMemo(() => {
    if (!lineRef.current) return;
    const stage = lineRef.current.getStage();
    if (typeof stage !== 'object') return;
    const stageDatas = {
      width: stage?.width(),
      height: stage?.height(),
      scale: stage?.scaleX(),
      x: stage?.x(),
      y: stage?.y(),
    };

    const toStageValue = (value: number) => {
      return value / stageDatas?.scale;
    };

    // 列数
    const LenX = Math.ceil(toStageValue(stageDatas.width + render.rulerSize)) / cellSize;

    // 行数
    const LenY = Math.ceil(toStageValue(stageDatas.height + render.rulerSize)) / cellSize;

    const startX = -Math.ceil(toStageValue(stageDatas.x) / cellSize);
    const startY = -Math.ceil(toStageValue(stageDatas.y) / cellSize);

    // 需要插入的网格 components
    const gridComponents: any[] = [];

    for (let x = startX; x < LenX + startX + 2; x++) {
      gridComponents.push(
        <Line
          name={`gridLineX${x}`}
          key={`gridLineX${x}`}
          points={flatten([
            [cellSize * x, toStageValue(-stageDatas.y)],
            [cellSize * x, toStageValue(stageDatas.height - stageDatas.y)],
          ])}
          stroke={'#e6e6e6'}
          strokeWidth={1}
          opacity={x % 5 === 0 ? 1 : 0.3}
          listening={false}
        />,
      );
    }

    for (let y = startY; y < LenY + startY + 2; y++) {
      gridComponents.push(
        <Line
          name={`gridLineY${y}`}
          key={`gridLineY${y}`}
          points={flatten([
            [toStageValue(-stageDatas.x), cellSize * y],
            [toStageValue(stageDatas.width - stageDatas.x), cellSize * y],
          ])}
          stroke={'#e6e6e6'}
          strokeWidth={1}
          opacity={y % 5 === 0 ? 1 : 0.3}
          listening={false}
        />,
      );
    }
    return gridComponents;
  }, [stagePos, hybirdStage, stageScale, lineRef.current, lastPos]);

  return (
    <Layer listening={false} ref={lineRef}>
      {/* <RulerDraw /> */}
      {renderGrid}
    </Layer>
  );
};
