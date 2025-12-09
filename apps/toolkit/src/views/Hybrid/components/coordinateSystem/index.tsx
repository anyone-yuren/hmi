import React, { memo } from "react";
import { Arrow, Group, Line, Text } from "react-konva";

const CoordinateSystem = () => {
  const axisLength = 100; // 坐标轴长度

  return (
    <Group name="coordinateSystem">
      {/* 绘制 X 轴箭头 */}
      <Arrow
        points={[0, 0, axisLength, 0]} // 反向箭头
        pointerLength={5}
        pointerWidth={5}
        stroke="red"
        strokeWidth={4}
      />
      <Arrow
        points={[0, 0, 0, -axisLength]} // 反向箭头
        pointerLength={5}
        pointerWidth={5}
        stroke="green"
        strokeWidth={4}
      />
    </Group>
  );
};

export default memo(CoordinateSystem);
