import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import { flatten } from 'lodash';
import { Group, Line, Rect, Text } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { cellSize, rulerSize, size, toStageValue } from '../constants/config';

const RulerDraw = () => {
  const fontSizeMax = 12;
  const { hybirdStage, stageScale, stagePos } = useHybirdStore(
    useShallow((store) => {
      return {
        hybirdStage: store.hybirdStage,
        stageScale: store.stageScale,
        stagePos: store.stagePos,
      };
    }),
  );

  if (typeof hybirdStage !== 'object') return null;

  const stageState: any = {
    width: hybirdStage?.width(),
    height: hybirdStage?.height(),
    scale: hybirdStage?.scaleX() || 1,
    x: hybirdStage?.x(),
    y: hybirdStage?.y(),
  };

  // 列数
  const LenX = Math.ceil(toStageValue(stageState.width) / cellSize);

  // 行数
  const LenY = Math.ceil(toStageValue(stageState.height) / cellSize);

  const startX = Math.ceil(toStageValue(stageState.x) / cellSize);
  const startY = Math.ceil(toStageValue(stageState.y) / cellSize);

  // Memoize the drawing logic for X-axis
  const drawX = () => {
    const lines: JSX.Element[] = [];

    // Draw X axis lines and labels
    for (let i = LenX + startX - 1; i >= -100; i--) {
      const nx = toStageValue(0 - stageState.x + size) + i * cellSize;
      const long = toStageValue(size / 5) * 4;
      const short = toStageValue(size / 5) * 3;

      if (nx >= 0) {
        lines.push(
          <Line
            key={`ruler-x-${i}`}
            name={`ruler-x-${i}`}
            points={flatten([
              [nx, i % 5 ? long : short],
              [nx, toStageValue(size)],
            ])}
            stroke='#999'
            strokeWidth={1}
            listening={false}
          />,
        );
      }

      if (i % 5 === 0) {
        const text = (
          <Text
            key={`ruler-x-text-${i}`}
            x={nx - 2}
            y={toStageValue(size / 2 - fontSizeMax)}
            text={((i * cellSize) / 100).toString()}
            fontSize={toStageValue(fontSizeMax)}
            fill='#999'
            align='center'
            verticalAlign='middle'
            lineHeight={1.6}
          />
        );

        lines.push(text);
      }
    }

    return lines;
  };

  // Memoize the drawing logic for Y-axis
  const drawY = () => {
    const lines: JSX.Element[] = [];

    // Draw Y axis lines and labels
    for (let i = LenY + startY - 1; i >= -100; i--) {
      const ny = toStageValue(-stageState.y + size) + i * cellSize;
      const long = toStageValue(size / 5) * 4;
      const short = toStageValue(size / 5) * 3;

      if (ny >= 0) {
        lines.push(
          <Line
            key={`ruler-y-${i}`}
            name={`ruler-y-${i}`}
            points={flatten([
              [i % 5 ? long : short, ny],
              [toStageValue(size), ny],
            ])}
            stroke='#999'
            strokeWidth={1}
            listening={false}
          />,
        );
      }

      if (i % 5 === 0) {
        const text = (
          <Text
            key={`ruler-y-text-${i}`}
            x={0}
            y={ny - 2}
            text={((i * cellSize) / 100).toString()}
            fontSize={toStageValue(fontSizeMax)}
            fill='#999'
            align='right'
            verticalAlign='middle'
            lineHeight={1.6}
          />
        );

        lines.push(text);
      }
    }

    return lines;
  };

  return (
    <>
      {/* 上边的标尺 */}
      <Group
        name='ruler-top'
        x={toStageValue(-stageState.x + size)}
        y={toStageValue(-stageState.y)}
        width={toStageValue(stageState.width - size + rulerSize)}
        height={toStageValue(size)}
      >
        <Rect
          name='ruler-top-line'
          x={0}
          y={0}
          width={toStageValue(stageState.width - size + rulerSize)}
          height={toStageValue(size)}
          fill='#ddd'
        />
        {drawX()}
      </Group>

      {/* 左边的标尺 */}
      <Group
        name='ruler-left'
        x={toStageValue(-stageState.x)}
        y={toStageValue(-stageState.y + size)}
        width={toStageValue(size)}
        height={toStageValue(stageState.height - size + rulerSize)}
      >
        <Rect
          name='ruler-left-line'
          x={0}
          y={0}
          width={toStageValue(size)}
          height={toStageValue(stageState.height - size + rulerSize)}
          fill='#ddd'
        />
        {drawY()}
      </Group>
    </>
  );
};

export default RulerDraw;
