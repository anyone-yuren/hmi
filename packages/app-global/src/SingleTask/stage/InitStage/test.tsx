import { memo, useEffect } from 'react';
import { Circle, Group, Layer, Stage } from 'react-konva';
import { RCS_POINTS_GROUP } from './constants/konvas';
import { PointData } from './data';

import useStage from './hooks/useStage';
import IInitStage from './index.d';

const coordinates = {
  UpRight: {
    X: 82750,
    Y: 19640,
  },
  DownLeft: {
    X: -9000,
    Y: -9000,
  },
};

const InitStage = (props: IInitStage) => {
  const { size = { width: 400, height: 400 } } = props;
  const { stageRef, onWheel } = useStage();

  const width = coordinates.UpRight.X - coordinates.DownLeft.X;
  const height = coordinates.UpRight.Y - coordinates.DownLeft.Y;

  const mapPointToCanvas = (pointX: number, pointY: number) => {
    const relativeX = pointX - coordinates.DownLeft.X;
    const relativeY = coordinates.UpRight.Y - pointY; // 翻转Y轴
    return { x: relativeX, y: relativeY };
  };
  useEffect(() => {
    const stage = stageRef.current?.getStage();
    // 根据size大小缩放scale让图形全部显示
    const scale = Math.min(size.width / width, size.height / height);
    if (stage) {
      stage.scale({ x: scale, y: scale });
      stage.position({ y: (size.height - height * scale) / 2 });
      stage.batchDraw();
    }
  }, [size]);

  return (
    <>
      <Stage width={size.width} height={size.height} onWheel={onWheel} draggable ref={stageRef}>
        <Layer>
          {/* <Rect width={width} height={height} stroke='blue' strokeWidth={2} fill='rgba(0,0,0,0.3)' /> */}
          <Group name={RCS_POINTS_GROUP}>
            {PointData.map(({ id, position }) => {
              const { x, y } = mapPointToCanvas(position.X, position.Y);
              return <Circle key={id} x={x} y={y} radius={80} fill={'red'} />;
            })}
          </Group>
        </Layer>
      </Stage>
    </>
  );
};

export default memo(InitStage);
