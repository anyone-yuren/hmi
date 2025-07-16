import { useRequest } from 'ahooks';
import Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Circle, FastLayer } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { pointCloudDiag } from '../../service';
import { useHybirdStore } from '../../store/hybird.store';

export default function PointsCloudDiag() {
  const { run, data: pointCloudData } = useRequest(pointCloudDiag, {
    manual: true,
    // pollingInterval: 1000,
  });

  const [minIntensity, setMinIntensity] = useState(0);
  const [maxIntensity, setMaxIntensity] = useState(0);

  const layerRef = useRef<Konva.FastLayer>(null);

  useEffect(() => {
    const data = pointCloudData?.point_cloud || [];
    if (data && data.length > 0) {
      const intensities = data.map((point: any) => point.intensity);
      setMinIntensity(Math.min(...intensities));
      setMaxIntensity(Math.max(...intensities));
    }
  }, [pointCloudData]);

  // 将强度映射到红橙黄绿青蓝紫
  const getColorFromIntensity = (intensity: number) => {
    const normalized = (intensity - minIntensity) / (maxIntensity - minIntensity); // 归一化到 0-1
    const hue = normalized * 300; // 映射到 HSL 的 0-300（红橙黄绿青蓝紫）
    return `hsl(${hue}, 100%, 50%)`; // 高饱和度和中等亮度
  };

  const { showPointCloudDiag } = useHybirdStore(
    useShallow((state) => ({
      showPointCloudDiag: state.showPointCloudDiag,
    })),
  );

  useEffect(() => {
    if (showPointCloudDiag) {
      run();
    }
  }, [showPointCloudDiag]);

  return (
    <FastLayer ref={layerRef} gpuAcceleration hitGraphEnabled={false} draggable={false}>
      {showPointCloudDiag &&
        pointCloudData?.point_cloud?.map((point, index) => {
          if (index % 5 === 0 || point.intensity > 1000) {
            console.log(point.intensity);

            return (
              // <Rect
              //   key={index}
              //   x={point.x / 50} // 放大以适应画布
              //   y={0 - point.y / 50}
              //   width={2}
              //   height={2}
              //   fill={getColorFromIntensity(point.intensity)} // 设置亮度颜色
              //   // shadowBlur={1}
              //   listening={false}
              //   draggable={false}
              //   gpuAcceleration
              // />
              <Circle
                key={index}
                x={point.x / 50}
                y={0 - point.y / 50}
                radius={1}
                fill={getColorFromIntensity(point.intensity)}
              ></Circle>
            );
          }
        })}
    </FastLayer>
  );
}
