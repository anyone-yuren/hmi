// 智能重定位
import { memo } from 'react';
import { Circle, Group, Line, Rect } from 'react-konva';

const NewAgv = (props: any) => {
  const {
    x = 0,
    y = 0,
    rotation = 0,
    offsetX = 0,
    offsetY = 0,
    radius = 8,
    stroke = 'red',
    id,
    showRect = false,
  } = props;
  const arrowLength = radius * 3.5;
  // 计算框框的宽度和高度
  const boxWidth = radius * 2 + 2; // 圆形直径
  const boxHeight = arrowLength + radius + 2; // 箭头长度 + 半径
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
      {showRect && (
        <Rect
          x={-boxWidth / 2} // 框框左上角的 x 坐标
          y={-boxHeight} // 框框左上角的 y 坐标
          width={boxWidth} // 框框的宽度
          height={boxHeight} // 框框的高度
          stroke='black' // 框框的颜色
          strokeWidth={1} // 框框的线条宽度
          offsetX={-offsetX}
          offsetY={-offsetY - radius - 1}
        />
      )}
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
        points={[radius - 3, -(arrowLength - 10), 0, -arrowLength, -(radius - 3), -(arrowLength - 10)]}
        offsetX={-offsetX}
        offsetY={-offsetY}
        stroke={stroke}
        strokeWidth={1}
      />
    </Group>
  );
};

export default memo(NewAgv);
