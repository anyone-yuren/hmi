// 智能重定位
import { memo } from 'react';
import { Circle, Group, Line } from 'react-konva';

const NewAgv = (props: any) => {
  const { x = 0, y = 0, rotation = 0, offsetX = 0, offsetY = 0, radius = 5, stroke = 'red', id } = props;
  const arrowLength = radius * 3.5;

  return (
    <Group
      x={x}
      y={y}
      name={id}
      rotation={rotation}
      offsetX={offsetX}
      offsetY={offsetY}
      // listening={false}
    >
      <Circle radius={radius} fill='#ffffff00' offsetX={-offsetX} offsetY={-offsetY} stroke={stroke} strokeWidth={1} />
      <Line points={[-radius, 0, radius, 0]} offsetX={-offsetX} offsetY={-offsetY} stroke={stroke} strokeWidth={1} />
      <Line
        points={[0, -arrowLength, 0, radius]}
        offsetX={-offsetX}
        offsetY={-offsetY}
        stroke={stroke}
        strokeWidth={1}
      />
      <Line
        points={[radius - 3, -(arrowLength - 8), 0, -arrowLength, -(radius - 3), -(arrowLength - 8)]}
        offsetX={-offsetX}
        offsetY={-offsetY}
        stroke={stroke}
        strokeWidth={1}
      />
    </Group>
  );
};

export default memo(NewAgv);
