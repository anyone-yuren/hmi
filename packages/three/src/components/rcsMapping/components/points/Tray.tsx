import { Box } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
// 创建一个田字托盘
const Tray = (props) => {
  const { position, rotation, scale } = props;
  const traySize = 1;
  const thickness = 0.05;
  // 使用 useMemo 来存储托盘几何体和材质，避免每次重新创建
  const trayGeometry = useMemo(() => new THREE.BoxGeometry(traySize, traySize, thickness), [traySize, thickness]);

  const trayMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: 'brown' }), []);

  return (
    <group rotation={rotation} position={position}>
      {/* 田托外框 */}
      <Box
        position={[0, 0, -thickness / 2]}
        geometry={trayGeometry}
        material={trayMaterial}
        args={[traySize, traySize, thickness]}
      ></Box>
      {/* 中间横线 */}
      <Box
        geometry={trayGeometry}
        material={trayMaterial}
        position={[0, traySize / 2 - thickness / 2, 0]}
        args={[traySize, thickness, thickness]}
      ></Box>

      {/* 中间竖线 */}
      <Box
        geometry={trayGeometry}
        material={trayMaterial}
        position={[traySize / 2 - thickness / 2, 0, 0]}
        args={[thickness, traySize, thickness]}
      ></Box>
    </group>
  );
};
export default Tray;
