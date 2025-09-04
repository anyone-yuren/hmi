import SafetyCoordinate from '@/components/InitStage/components/safetyCoordinate';
import { Layer, Rect } from 'react-konva';

const CarModel = () => {
  // 车身矩形（禁止进入）
  const carRect = { x: 0, y: 0, width: 200, height: 100 };
  // 叉臂矩形
  const armRect = { x: 30, y: 100, width: 140, height: 300 };
  return (
    <Layer name='car'>
      <Rect
        name='car-header'
        x={carRect.x}
        y={carRect.y}
        width={carRect.width}
        height={carRect.height}
        fill='rgba(0,255,255,0.3)'
      />
      {/* 叉臂 */}
      <Rect
        name='car-arm'
        x={armRect.x}
        y={armRect.y}
        width={armRect.width}
        height={armRect.height}
        fill='rgba(255,0,0,0.3)'
      />
      <SafetyCoordinate />
    </Layer>
  );
};

export default CarModel;
