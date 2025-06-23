'use client';

import { useVehicleStore } from '@/store/vehicleStore';
import { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { useShallow } from 'zustand/react/shallow';

type PointData = {
  x: number;
  y: number;
  z?: number;
};

type PointCloudProps = {
  color?: string;
  size?: number;
};

export const meterToPixel = (meter: number) => {
  return Math.floor(meter * 100);
};

const PointCloud = ({ color = '#00ff00', size = 0.05 }: PointCloudProps) => {
  const { seniorPoints } = useVehicleStore(
    useShallow((state) => ({
      seniorPoints: state.seniorPoints,
    })),
  );
  // 转换成 Float32Array 的 position 缓冲数据
  const geometry = useMemo(() => {
    const geom = new BufferGeometry();
    const positions = seniorPoints.flatMap(({ x, y, z = 0 }) => [meterToPixel(x - 1), meterToPixel(y), 0]);
    geom.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geom;
  }, [seniorPoints]);

  return (
    <points geometry={geometry}>
      <pointsMaterial color={color} size={size} sizeAttenuation />
    </points>
  );
};

export default PointCloud;
