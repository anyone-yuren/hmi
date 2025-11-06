import { useMemo } from 'react';
import * as THREE from 'three';

const SCALE = 0.001;
/**
 * TrapezoidBox
 * - width, height, depth: 全尺寸（同底面）
 * - shrink: 顶部深度相对于底面深度的比例 (0..1)，越小越收窄
 * - offsetZ: 顶面整体在 z 轴上的偏移（用于左/右方向控制）
 * - color: 颜色
 */
function TrapezoidBox({ width = 0.65, height = 0.2, depth = 0.3, shrink = 0.6, offsetZ = 0, color = '#11d1d1' }) {
  const geometry = useMemo(() => {
    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;

    // 顶面收缩后的半深度
    const td = d * shrink;

    // 顶面 z 偏移（整体搬动顶面）
    const oz = offsetZ; // 正负皆可

    // 顶点按顺序：底面 0-3, 顶面 4-7
    const vertices = new Float32Array([
      // bottom (y = -h)
      -w,
      -h,
      -d,
      w,
      -h,
      -d,
      w,
      -h,
      d,
      -w,
      -h,
      d,
      // top (y = +h)  —— 顶面被收缩到 [-td, +td] 并可以整体偏移 offsetZ
      -w,
      h,
      -td + oz,
      w,
      h,
      -td + oz,
      w,
      h,
      td + oz,
      -w,
      h,
      td + oz,
    ]);

    // faces (每个矩形拆成两个三角形)，顺序一致，法线会正确计算
    const indices = [
      // bottom
      0, 1, 2, 0, 2, 3,
      // top
      4, 6, 5, 4, 7, 6,
      // front (negative z)
      0, 4, 5, 0, 5, 1,
      // back (positive z)
      3, 2, 6, 3, 6, 7,
      // left
      0, 3, 7, 0, 7, 4,
      // right
      1, 5, 6, 1, 6, 2,
    ];

    const geo = new THREE.BufferGeometry();
    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.computeVertexNormals();
    geo.normalizeNormals();
    return geo;
  }, [width, height, depth, shrink, offsetZ]);

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color, metalness: 0.3, roughness: 0.6, flatShading: true }),
    [color],
  );

  return <mesh geometry={geometry} material={material} receiveShadow />;
}

/* -------------------
   ForkliftBody 组件
   ------------------- */
function ForkliftBody({ scale = 0.001, colorMain = '#888', colorAccent = '#11d1d1' }) {
  // 基准尺寸（mm）
  const dims = useMemo(
    () => ({
      base: [650, 550, 1360],
      middle: [650, 550, 760],
      sideTop: [650, 350, 300],
      top: [650, 200, 300],
      overallHeightForPositioning: 1100, // 用于计算 top group 的基准位置
    }),
    [],
  );

  const s = scale;

  return (
    <group position={[(dims.base[0] * s) / 2, (dims.overallHeightForPositioning * s) / 2, 0]} rotation={[0, 0, 0]}>
      {/* 中段主体 */}
      <mesh castShadow receiveShadow position={[0, (dims.middle[1] * s) / 2, 0]}>
        <boxGeometry args={dims.middle.map((v) => v * s)} />
        <meshStandardMaterial color={colorMain} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* 前/后 两块顶部结构（包含收窄的 Trapezoid） */}
      {[
        { key: 'front', zSign: 1, offsetZ: 0.06 }, // front: 顶面偏向 +z（样例）
        { key: 'rear', zSign: -1, offsetZ: -0.06 }, // rear: 顶面偏向 -z
      ].map(({ key, zSign, offsetZ }) => (
        <group
          key={key}
          position={[0, (dims.sideTop[1] * s) / 2, 0 - (zSign * ((dims.middle[2] + dims.sideTop[2]) * s)) / 2]}
        >
          <mesh castShadow>
            <boxGeometry args={dims.sideTop.map((v) => v * s)} />
            <meshStandardMaterial color={colorAccent} metalness={0.3} roughness={0.6} />
          </mesh>

          <group position={[0, (dims.sideTop[1] * s) / 2 + (dims.top[1] * s) / 2, 0]}>
            <TrapezoidBox
              width={dims.top[0] * s}
              height={dims.top[1] * s}
              depth={dims.top[2] * s}
              shrink={0.6}
              offsetZ={offsetZ} // 通过偏移来控制“左/右侧收窄”的视觉效果
              color={colorAccent}
            />
          </group>
        </group>
      ))}

      {/* 底盘 */}
      <mesh castShadow receiveShadow position={[0, -(dims.base[1] * s) / 2, 0]}>
        <boxGeometry args={dims.base.map((v) => v * s)} />
        <meshStandardMaterial color={colorMain} metalness={0.3} roughness={0.6} />
      </mesh>

      {/* 雷达杆（示例，位置相对于 body 顶部） */}
      <mesh position={[0, (dims.overallHeightForPositioning * s) / 2 + 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.4, 0.5]} />
        <meshStandardMaterial color={colorMain} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, (dims.overallHeightForPositioning * s) / 2 + 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.7, 0.5]} />
        <meshStandardMaterial color={colorAccent} metalness={0.3} roughness={0.5} />
      </mesh>

      {/* 顶部装饰 & 指示灯 */}
      <mesh position={[0, (dims.overallHeightForPositioning * s) / 2 + 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.02, 0.2]} />
        <meshStandardMaterial color={'#555'} metalness={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0, (dims.overallHeightForPositioning * s) / 2 + 1.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 32]} />
        <meshStandardMaterial color={'#ff0000'} metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* -------------------
   ForkArms 组件（内/外叉合并）
   ------------------- */
function ForkArms(props) {
  const { forkHeight, forkX } = props;
  const armColor = '#888';
  const nodes = [
    { pos: [-0.65 - forkX * SCALE, 0.03 + forkHeight * SCALE, -0.15], size: [1, 0.07, 0.13] },
    { pos: [-0.65 - forkX * SCALE, 0.03 + forkHeight * SCALE, 0.15], size: [1, 0.07, 0.13] },
    { pos: [-0.4, 0.15, -0.503], size: [0.8, 0.3, 0.3] },
    { pos: [-0.4, 0.15, 0.503], size: [0.8, 0.3, 0.3] },
  ];

  return (
    <group>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos} castShadow receiveShadow>
          <boxGeometry args={n.size} />
          <meshStandardMaterial color={armColor} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------
   MechanicalArm 组件
   ------------------- */
function MechanicalArm({ scale = 0.001, forkX, forkHeight }) {
  const armColor = '#555';
  const wheelColor = '#ff0';
  const s = scale;
  const forkH = forkHeight * SCALE;

  return (
    <group position={[0, (2000 * s) / 2, 0]}>
      {/* 两根竖柱（保持间距） */}
      <group position={[0 - forkX * SCALE, 0, 0]}>
        <group position={[-0.075, 0, -0.15]}>
          <mesh castShadow receiveShadow position={[0, forkHeight > 2 ? 1 + (forkH - 2) / 2 : 0, -0.05]}>
            <cylinderGeometry args={[0.02, 0.02, forkHeight > 2 ? forkH - 2 : 0, 32]} />
            <meshStandardMaterial
              color={'#ffffff'}
              opacity={0.2}
              metalness={0.3}
              roughness={0.6}
            ></meshStandardMaterial>
          </mesh>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.15, 2000 * s, 0.15]} />
            <meshStandardMaterial color={armColor} metalness={0.3} roughness={0.6} />
          </mesh>
        </group>
        {/* 右边 */}
        <group position={[-0.075, 0, 0.15]}>
          <mesh castShadow receiveShadow position={[0, forkHeight > 2 ? 1 + (forkH - 2) / 2 : 0, 0.05]}>
            <cylinderGeometry args={[0.02, 0.02, forkHeight > 2 ? forkH - 2 : 0, 32]} />
            <meshStandardMaterial
              color={'#ffffff'}
              opacity={0.2}
              metalness={0.3}
              roughness={0.6}
            ></meshStandardMaterial>
          </mesh>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.15, 2000 * s, 0.15]} />
            <meshStandardMaterial color={armColor} metalness={0.3} roughness={0.6} />
          </mesh>
        </group>

        {/* 顶部连杆 */}
        <mesh castShadow receiveShadow position={[-0.08, forkH > 2 ? 1 + (forkH - 2) : 1, 0]}>
          <boxGeometry args={[0.15, 0.075, 0.6]} />
          <meshStandardMaterial color={armColor} metalness={0.3} roughness={0.6} />
        </mesh>
      </group>

      {/* 底部轮子（两个圆柱） */}
      <group position={[-0.12, -(2040 * s) / 2 + 0.12, 0]}>
        {[-0.465, 0.465].map((z, i) => (
          <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.12, 32]} />
            <meshStandardMaterial color={wheelColor} metalness={0.4} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* -------------------
   主导出组件 O15Model
   ------------------- */
export default function O15Model(props) {
  const { forkHeight = 1000, forkX = 0 } = props;
  const SCALE = 0.001; // 毫米 -> 米
  return (
    <group position={[-0.1, 0, 0]} rotation={[0, Math.PI, 0]}>
      <ForkliftBody scale={SCALE} />
      <ForkArms forkHeight={forkHeight} forkX={forkX} />
      <MechanicalArm scale={SCALE} forkX={forkX} forkHeight={forkHeight} />
    </group>
  );
}
