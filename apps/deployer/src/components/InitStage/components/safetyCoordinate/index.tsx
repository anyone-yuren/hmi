import React, { memo } from "react";
import { Arrow, Group, Line, Text } from "react-konva";

const SafetyCoordinate = () => {
  const axisLength = 40; // 坐标轴长度
  return (
    <Group name="coordinateSystem">
      {/* 绘制 X 轴箭头 */}
      <Arrow
        points={[0, 0, -axisLength, 0]} // 反向箭头
        pointerLength={5}
        pointerWidth={3}
        stroke="red"
        strokeWidth={2}
      />
      {/* 标记X轴 */}
      <Text
        y={-axisLength - 12}
        x={-4}
        fontSize={10}
        text="x (m)"
        fill="green"
        stroke="green"
        strokeWidth={1}
      ></Text>
      <Arrow
        points={[0, 0, 0, -axisLength]} // 反向箭头
        pointerLength={5}
        pointerWidth={3}
        stroke="green"
        strokeWidth={2}
      />
      {/* 标记Y轴 */}
      <Text
        y={-5}
        x={-axisLength - 24}
        fontSize={10}
        text="y (m)"
        fill="red"
        stroke="red"
        strokeWidth={1}
      ></Text>
    </Group>
  );
};

export default memo(SafetyCoordinate);
