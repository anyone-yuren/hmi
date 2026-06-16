import { animated, useSpring } from '@react-spring/three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';
import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../../store';

/* ======================= Shader ======================= */

const vertexShader = `
uniform float uTime;

varying vec3 vColor;
varying float vDist;

void main() {
  vColor = color;

  vec3 pos = position;

  float offset =
    sin(
      uTime * 1.5 +
      position.x * 4.0 +
      position.z * 4.0
    ) * 0.03;

  pos.y += offset;

  // 点到模型原点距离
  vDist = length(pos);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.0;
}
`;

const fragmentShader = `
uniform float uNear;
uniform float uFar;
uniform bool uEnableClip;

varying vec3 vColor;
varying float vDist;

void main() {
  if (uEnableClip) {
    if (vDist < uNear || vDist > uFar) {
      discard;
    }
  }

  gl_FragColor = vec4(vColor, 1.0);
}
`;
/* ======================= Component ======================= */

function PCDModel({
  url,
  rotation = [-Math.PI / 2, 0, -Math.PI / 2],
}: {
  url: string;
  rotation?: [number, number, number];
}) {
  const points = useLoader(PCDLoader, url) as THREE.Points;

  const { position, pitch, yaw, roll, near, far, enableClip } = useModelStore(
    useShallow((state) => ({
      position: state.cameraPosition,
      pitch: state.cameraPitch,
      yaw: state.cameraYaw,
      roll: state.cameraRoll,
      near: state.cameraClip?.near,
      far: state.cameraClip?.far,
      enableClip: state.enableClip,
    })),
  );

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const deg2rad = (deg?: number) => ((deg ?? 0) * Math.PI) / 180;

  /* ---------- ShaderMaterial ---------- */
  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uNear: { value: 0 },
        uFar: { value: 100 },
        uEnableClip: { value: true }, // ⭐ 新增
      },
      vertexColors: true,
      depthTest: true,
      depthWrite: true,
      transparent: false,
    });
    materialRef.current = mat;
    return mat;
  }, []);

  /* ---------- spring：位姿动画 ---------- */
  const spring = useSpring({
    position: position ? [position.x / 1000, position.y / 1000, position.z / 1000] : [0, 0, 0],
    rotation: [
      roll != null ? deg2rad(roll) : rotation[0],
      pitch != null ? deg2rad(pitch) : rotation[1],
      yaw != null ? deg2rad(yaw) : rotation[2],
    ],
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    },
  });

  /* ---------- 初始化几何 & 高度着色 ---------- */
  useEffect(() => {
    const geometry = points.geometry;
    geometry.computeBoundingSphere();

    points.frustumCulled = true;
    points.material = material;
    // ⭐⭐⭐ 核心：点云不参与拾取
    points.raycast = () => {};

    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(posAttr.count * 3);

    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    const range = maxY - minY + 1e-6;

    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const t = (y - minY) / range;

      const color = new THREE.Color();
      color.setHSL((1.0 - t) * 0.6, 1.0, 0.5);

      const i3 = i * 3;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }, [points, material]);

  /* ---------- 每帧更新 uniform ---------- */
  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    const uniforms = materialRef.current.uniforms;
    uniforms.uTime.value = clock.elapsedTime;
    // ⭐⭐ 核心：同步裁剪开关
    uniforms.uEnableClip.value = !!enableClip;

    // ⭐ 单位统一：mm → m
    if (enableClip) {
      if (near != null) uniforms.uNear.value = near / 1000;
      if (far != null) uniforms.uFar.value = far / 1000;
    }
  });

  return <animated.primitive object={points} position={spring.position} rotation={spring.rotation} />;
}

export default PCDModel;
