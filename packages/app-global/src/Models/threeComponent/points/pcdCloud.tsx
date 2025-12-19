import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';

const vertexShader = `
uniform float uTime;
varying vec3 vColor;

void main() {
  vColor = color;

  vec3 pos = position;

  // 轻微稳定扰动（适合百万点）
  float offset =
    sin(
      uTime * 1.5 +
      position.x * 4.0 +
      position.z * 4.0
    ) * 0.03;

  pos.y += offset;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // 固定屏幕像素大小（不随距离变）
  gl_PointSize = 2.0;
}
`;

const fragmentShader = `
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
`;

function PCDModel({ url, rotation = [-Math.PI / 2, 0, -Math.PI / 2] }: { url: string; rotation?: number[] }) {
  const points = useLoader(PCDLoader, url) as THREE.Points;

  const materialRef = useRef<THREE.ShaderMaterial>(null);

  /** ---------- ShaderMaterial ---------- */
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
        },
        vertexColors: true,
        depthTest: true,
        depthWrite: true,
        transparent: false,
      }),
    [],
  );

  /** ---------- 初始化几何 & 颜色 ---------- */
  useEffect(() => {
    const geometry = points.geometry;
    geometry.computeBoundingSphere();

    points.frustumCulled = true;
    points.material = material;

    const position = geometry.attributes.position as THREE.BufferAttribute;

    // ===== 高度着色 =====
    const colors = new Float32Array(position.count * 3);

    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    const range = maxY - minY + 1e-6;

    for (let i = 0; i < position.count; i++) {
      const y = position.getY(i);
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

  /** ---------- 每帧只更新 uniform ---------- */
  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <primitive
      object={points}
      material={material}
      rotation={rotation}
      position={[0, 0.2, 0]}
      ref={(obj) => {
        if (obj) materialRef.current = material;
      }}
    />
  );
}

export default PCDModel;
