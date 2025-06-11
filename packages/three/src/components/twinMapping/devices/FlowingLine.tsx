import { Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function FlowingLine({ points, key }: { points: THREE.Vector3[]; key: string }) {
  const lineRef = useRef<any>(null);
  const { camera } = useThree();
  const [lineWidth, setLineWidth] = useState(1);

  useFrame((_, delta) => {
    if (!lineRef.current || points.length === 0) return;
    if (lineRef.current) {
      lineRef.current.material.dashOffset -= delta * 0.5; // 控制流动速度
    }
    // 计算线中心
    const center = points.reduce((acc, p) => acc.add(p), new THREE.Vector3(0, 0, 0)).divideScalar(points.length);

    const distance = camera.position.distanceTo(center);
    // 根据距离动态调整线宽（你可以自定义这个公式）
    const newWidth = Math.min(10, Math.max(2, 60 / distance)); // 距离越远，线越粗
    setLineWidth(newWidth);
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color='#ff8c00'
      lineWidth={lineWidth}
      transparent
      depthTest={false}
      dashed // 开启虚线模式
      dashSize={0.4} // 虚线的长度
      gapSize={0.1} // 虚线之间的间隔
    />
  );
}

export default FlowingLine;
