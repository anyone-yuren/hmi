import { Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Vector3 } from 'three';

const DynamicLine = ({ points, color = 'yellow' }: { points: Vector3[]; color: string }) => {
  const lineRef = useRef<any>();
  const { camera } = useThree();
  const [lineWidth, setLineWidth] = useState(1);

  useFrame(() => {
    if (!lineRef.current || points.length === 0) return;
    // 计算线中心
    const center = points.reduce((acc, p) => acc.add(p), new Vector3(0, 0, 0)).divideScalar(points.length);

    const distance = camera.position.distanceTo(center);
    // 根据距离动态调整线宽（你可以自定义这个公式）
    const newWidth = Math.min(4, Math.max(0.5, 200 / distance)); // 距离越远，线越粗
    setLineWidth(newWidth);
  });

  return <Line ref={lineRef} points={points} color={color} lineWidth={lineWidth} transparent depthTest={false} />;
};

export default DynamicLine;
