import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import { useEffect, useState } from 'react';
import { Group, Line } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';

const GridGroup = ({ width, height, gridSize, scale }: any) => {
  console.log(scale, 'fffff');
  const { hybirdStage } = useHybirdStore(
    useShallow((store) => {
      return {
        hybirdStage: store.hybirdStage,
      };
    }),
  );

  const [gridLines, setGridLines] = useState([]);

  // 网格间距
  const baseGridSize = 50;

  // 计算网格线
  const calculateGrid = () => {
    const stage = hybirdStage;

    if (!stage) return;

    const { width, height } = stage.size();
    const scale = stage.scaleX(); // 假设 scaleX 和 scaleY 相同
    const offsetX = stage.x();
    const offsetY = stage.y();

    const gridSize = baseGridSize * scale; // 根据缩放调整网格间距

    // 计算可视区域范围
    const startX = Math.floor(-offsetX / gridSize) * gridSize;
    const endX = Math.ceil((width - offsetX) / gridSize) * gridSize;
    const startY = Math.floor(-offsetY / gridSize) * gridSize;
    const endY = Math.ceil((height - offsetY) / gridSize) * gridSize;

    const lines: any[] = [];

    // 垂直线
    for (let x = startX; x <= endX; x += gridSize) {
      lines.push({
        points: [x, startY, x, endY],
        color: '#ddd',
      });
    }

    // 水平线
    for (let y = startY; y <= endY; y += gridSize) {
      lines.push({
        points: [startX, y, endX, y],
        color: '#ddd',
      });
    }

    setGridLines(lines);
  };

  useEffect(() => {
    if (typeof hybirdStage !== 'object') return;

    calculateGrid();
  }, [hybirdStage]);

  return (
    <Group name='grid-group'>
      {/* 绘制水平网格线 */}
      {gridLines?.map((line, index) => <Line key={index} points={line.points} stroke={line.color} strokeWidth={0.5} />)}
    </Group>
  );
};

export default GridGroup;
