import { Line } from '@react-three/drei';
import { memo, useMemo } from 'react';
import { generateRectanglePoints } from '../../utils/index';

function SafetyObsLines(props: any) {
  const { lines } = props;

  // 提前处理点位数据
  const lineSegments = useMemo(() => {
    return lines.flatMap((line, index) => {
      const points = generateRectanglePoints(line.rectangle);

      // 每个矩形的四条边
      return [
        [
          [points[0][0], points[0][1], 0], // 左上 -> 右上
          [points[1][0], points[1][1], 0],
        ],
        [
          [points[1][0], points[1][1], 0], // 右上 -> 右下
          [points[2][0], points[2][1], 0],
        ],
        [
          [points[2][0], points[2][1], 0], // 右下 -> 左下
          [points[3][0], points[3][1], 0],
        ],
        [
          [points[3][0], points[3][1], 0], // 左下 -> 左上
          [points[0][0], points[0][1], 0],
        ],
      ].map((segment) => ({ segment, color: line.color || 'yellow' })); // 为每条线段绑定颜色
    });
  }, [lines]);

  return (
    <>
      {/* 直接渲染所有线段 */}
      {lineSegments.map(({ segment, color }, index) => {
        return (
          <Line
            key={index}
            points={segment}
            color={color} // 使用动态颜色
            lineWidth={2} // 设置线宽
            depthTest={false}
          />
        );
      })}
    </>
  );
}

export default memo(SafetyObsLines);
