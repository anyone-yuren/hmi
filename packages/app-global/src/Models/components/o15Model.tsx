import { useMemo } from 'react';
import * as THREE from 'three';

function TrapezoidBox({ width = 650, height = 550, depth = 300, isLeft = true, color = '#11d1d1' }) {
  const geometry = useMemo(() => {
    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;

    // 顶点顺序：8 个点
    const vertices = new Float32Array([
      // 底面 (z = -d)
      -w,
      -h,
      -d, // 0 左前
      w,
      -h,
      -d, // 1 右前
      w,
      -h,
      // isLeft ? d : 0.1, // 2 右后
      d,
      -w,
      -h,
      // isLeft ? d : 0.1, // 3 左后
      d,

      // 顶面 (z 收缩)
      -w,
      h,
      isLeft ? 0.1 : -d, // 4 左前
      w,
      h,
      isLeft ? 0.1 : -d, // 5 右前
      w,
      h,
      isLeft ? d : -0.1, // 6 右后
      -w,
      h,
      isLeft ? d : -0.1, // 7 左后
    ]);

    // 面索引（每个面两个三角形）
    const indices = [
      // 底面
      0, 1, 2, 0, 2, 3,
      // 顶面
      4, 6, 5, 4, 7, 6,
      // 前面
      0, 4, 5, 0, 5, 1,
      // 后面
      3, 2, 6, 3, 6, 7,
      // 左面
      0, 3, 7, 0, 7, 4,
      // 右面
      1, 5, 6, 1, 6, 2,
    ];

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    geometry.normalizeNormals();
    return geometry;
  }, [width, height, depth, isLeft]);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.6} flatShading />
    </mesh>
  );
}

// 绘制O15车辆
function O15Model() {
  const SCALE = 0.001; // 毫米转米
  return (
    <group position={[0, 0, -3]}>
      {/* Forklift body */}
      <group position={[(650 * SCALE) / 2, (1100 * SCALE) / 2, 0]}>
        <group>
          <mesh castShadow receiveShadow position={[0, (550 * SCALE) / 2, 0]}>
            <boxGeometry args={[650 * SCALE, 550 * SCALE, 760 * SCALE]} />
            <meshStandardMaterial color={'#888'} metalness={0.3} roughness={0.6} />
          </mesh>
          <group position={[0, (350 * SCALE) / 2, ((760 + 300) * SCALE) / 2]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[650 * SCALE, 350 * SCALE, 300 * SCALE]} />
              <meshStandardMaterial color={'#11d1d1'} metalness={0.3} roughness={0.6} />
            </mesh>
            <group position={[0, (350 * SCALE) / 2 + (200 * SCALE) / 2, 0]}>
              <TrapezoidBox
                width={650 * SCALE}
                height={200 * SCALE}
                depth={300 * SCALE}
                isLeft={false} // 顶部深度收缩 60%
                color='#11d1d1'
              />
            </group>
          </group>
          <group position={[0, (350 * SCALE) / 2, -((760 + 300) * SCALE) / 2]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[650 * SCALE, 350 * SCALE, 300 * SCALE]} />
              <meshStandardMaterial color={'#11d1d1'} metalness={0.3} roughness={0.6} />
            </mesh>
            <group position={[0, (350 * SCALE) / 2 + (200 * SCALE) / 2, 0]}>
              <TrapezoidBox
                width={650 * SCALE}
                height={200 * SCALE}
                depth={300 * SCALE}
                isLeft={true} // 顶部深度收缩 60%
                color='#11d1d1'
              />
            </group>
          </group>
        </group>
        <mesh castShadow receiveShadow position={[0, -(550 * SCALE) / 2, 0]}>
          <boxGeometry args={[650 * SCALE, 550 * SCALE, 1360 * SCALE]} />
          <meshStandardMaterial color={'#888'} metalness={0.3} roughness={0.6} />
        </mesh>
        {/* 雷达杆 1000 */}
        <mesh position={[0, (1100 * SCALE) / 2 + 0.2, 0]} castShadow receiveShadow>
          {/* radiusTop, radiusBottom, height, radialSegments */}
          {/* <cylinderGeometry args={[0.02, 0.01, 1, 32]} /> */}
          <boxGeometry args={[0.26, 0.4, 0.5]} />
          <meshStandardMaterial color='#888' metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[0, (1100 * SCALE) / 2 + 0.75, 0]} castShadow receiveShadow>
          {/* radiusTop, radiusBottom, height, radialSegments */}
          {/* <cylinderGeometry args={[0.02, 0.01, 1, 32]} /> */}
          <boxGeometry args={[0.26, 0.7, 0.5]} />
          <meshStandardMaterial color='#11d1d1' metalness={0.3} roughness={0.5} />
        </mesh>
        {/* 顶部面200mm */}
        <mesh position={[0, (1300 * SCALE) / 2 + 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.02, 0.2]} />
          <meshStandardMaterial color={'#555'} metalness={0.3} roughness={0.6} />
        </mesh>
        {/* 顶部面200mm */}
        <mesh position={[0, (1300 * SCALE) / 2 + 1 + 0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 32]} />
          <meshStandardMaterial color={'#ff0000'} metalness={0.3} roughness={0.6} />
        </mesh>
      </group>

      <group position={[0, 0, 0]}>
        {/* Left fork arm */}
        <mesh castShadow receiveShadow position={[-0.6, 0.03, -0.235]}>
          <boxGeometry args={[1.206, 0.07, 0.13]} />
          <meshStandardMaterial color={'#888'} metalness={0.4} roughness={0.5} />
        </mesh>

        {/* Right fork arm */}
        <mesh castShadow receiveShadow position={[-0.6, 0.03, 0.235]}>
          <boxGeometry args={[1.206, 0.07, 0.13]} />
          <meshStandardMaterial color={'#888'} metalness={0.4} roughness={0.5} />
        </mesh>
      </group>

      {/* 外叉臂 */}
      <group position={[0, 0, 0]}>
        {/* Left fork arm */}
        <mesh castShadow receiveShadow position={[-0.4, 0.15, -0.503]}>
          <boxGeometry args={[0.8, 0.3, 0.3]} />
          <meshStandardMaterial color={'#888'} metalness={0.4} roughness={0.5} />
        </mesh>

        {/* Right fork arm */}
        <mesh castShadow receiveShadow position={[-0.4, 0.15, 0.503]}>
          <boxGeometry args={[0.8, 0.3, 0.3]} />
          <meshStandardMaterial color={'#888'} metalness={0.4} roughness={0.5} />
        </mesh>
      </group>

      {/* 机械臂 */}
      <group position={[0, (2100 * SCALE) / 2, 0]}>
        <mesh castShadow receiveShadow position={[-0.15 / 2, 0, -0.3 + 0.15 / 2]}>
          <boxGeometry args={[0.15, 2100 * SCALE, 0.15]} />
          <meshStandardMaterial color={'#555'} metalness={0.3} roughness={0.6} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.15 / 2, 0, 0.3 - 0.15 / 2]}>
          <boxGeometry args={[0.15, 2100 * SCALE, 0.15]} />
          <meshStandardMaterial color={'#555'} metalness={0.3} roughness={0.6} />
        </mesh>
        {/* 顶部连杆 */}
        <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
          <boxGeometry args={[0.15, 0.15 / 2, 0.6]} />
          <meshStandardMaterial color={'#555'} metalness={0.3} roughness={0.6} />
        </mesh>
        {/* 绘制一个黄色的轮子，半径110，宽度120 */}
        <group position={[-0.12, -(2040 * SCALE) / 2 + 0.12, 0]}>
          <mesh position={[0, 0, -0.465]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.12, 32]} />
            <meshStandardMaterial color={'#ff0'} metalness={0.4} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.465]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.12, 32]} />
            <meshStandardMaterial color={'#ff0'} metalness={0.4} roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
export default O15Model;
