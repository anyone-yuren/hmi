import { memo } from 'react';
import { Arrow, Group, Text } from 'react-konva';

const SafetyCoordinate = () => {
  const axisLength = 80; // 坐标轴长度
  return (
    <Group name='coordinateSystem'>
      {/* 绘制 X 轴箭头 */}
      <Arrow
        points={[0, 0, -axisLength, 0]} // 反向箭头
        pointerLength={5}
        pointerWidth={6}
        stroke='green'
        strokeWidth={4}
      />
      {/* 标记X轴 */}
      <Text y={-axisLength - 22} x={-4} fontSize={16} text='x (mm)' fill='red' stroke='red' strokeWidth={1}></Text>
      <Arrow
        points={[0, 0, 0, -axisLength]} // 反向箭头
        pointerLength={5}
        pointerWidth={6}
        stroke='red'
        strokeWidth={4}
      />
      {/* 标记Y轴 */}
      <Text y={-10} x={-axisLength - 64} fontSize={16} text='y (mm)' fill='green' stroke='green' strokeWidth={1}></Text>
    </Group>
  );
};

export default memo(SafetyCoordinate);
