import Konva from 'konva';
import { useRef } from 'react';
import { FastLayer, Line } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { useHybirdStore } from '../../store/hybird.store';

export default function PointsCloudV1() {
  const layerRef = useRef<Konva.FastLayer>(null);
  const { showPointCloud, pointCloudV1Data } = useHybirdStore(
    useShallow((state) => ({
      showPointCloud: state.showPointCloud,
      pointCloudV1Data: state.pointCloudV1Data,
    })),
  );
  // 转换点数据为 Konva Line 接受的格式
  const points = pointCloudV1Data?.flatMap((point) => [point.x / 50, 0 - point.y / 50]) || [];

  return (
    <FastLayer ref={layerRef} gpuAcceleration hitGraphEnabled={false} draggable={false}>
      {showPointCloud &&
        points.length >= 6 && ( // 至少3个点，6个数
          <Line points={points} closed={true} fill='#00d1d1' opacity={0.3} strokeWidth={1} />
        )}
    </FastLayer>
  );
}
