import { animated, useSpring } from '@react-spring/three';
import { Detailed } from '@react-three/drei';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorViewStore } from '../../../store/view';

export function SlamPointCloud({
  url,
  color = '#ffffff',
  rotateX = -Math.PI / 2,
}: {
  url: string;
  color?: THREE.ColorRepresentation;
  rotateX?: number;
}) {
  const geometry = useLoader(PLYLoader, url);
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();
  const { floorOffset } = useMapEditorViewStore(
    useShallow((state) => {
      return {
        floorOffset: state.floorOffset,
      };
    }),
  );

  // Shader 材质
  const materials = useMemo(() => {
    const base = {
      uniforms: {
        color: { value: new THREE.Color(color) },
        size: { value: 0.15 },
        step: { value: 1 }, // 默认不稀释
      },
      vertexShader: `
        uniform float size;
        uniform float step;

        void main() {
          int idx = int(gl_VertexID);
          if (idx % int(step) != 0) {
            gl_Position = vec4(0.0, 0.0, 0.0, 0.0);
            gl_PointSize = 0.0;
            return;
          }

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (150.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          if(d>0.5) discard;
          gl_FragColor = vec4(color,1.0);
        }
      `,
      transparent: true,
      depthWrite: false,
    };

    return [
      new THREE.ShaderMaterial({ ...base }),
      new THREE.ShaderMaterial({ ...base, uniforms: { ...base.uniforms, size: { value: 1.5 } } }),
      new THREE.ShaderMaterial({ ...base, uniforms: { ...base.uniforms, size: { value: 2.5 } } }),
    ];
  }, [color]);

  // 根据 camera.zoom 动态调整 step
  const lastZoomRef = useRef<number>(camera.zoom);

  useFrame(() => {
    if (!pointsRef.current) return;

    const zoom = camera.zoom;
    if (zoom === lastZoomRef.current) return; // zoom 没变化，直接跳过

    lastZoomRef.current = zoom; // 更新记录

    let step = 1;
    if (zoom < 20) step = 10;
    else if (zoom < 40) step = 3;
    else step = 1;
    materials.forEach((mat) => {
      mat.uniforms.step.value = step;
    });
  });

  /* ---------- spring：位姿动画 ---------- */
  const spring = useSpring({
    position: floorOffset ? [floorOffset[0] / 1000, floorOffset[1] / 1000, 0] : [0, 0, 0],
    // rotation: [
    //   roll != null ? deg2rad(roll) : rotation[0],
    //   pitch != null ? deg2rad(pitch) : rotation[1],
    //   yaw != null ? deg2rad(yaw) : rotation[2],
    // ],
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    },
  });

  console.log(floorOffset);
  return (
    <animated.group rotation={[0, 0, 0]} position={spring.position ?? [0, 0, 0]}>
      <Detailed distances={[30, 15, 0]}>
        <points ref={pointsRef} geometry={geometry} material={materials[0]} />
        <points geometry={geometry} material={materials[1]} />
        <points geometry={geometry} material={materials[2]} />
      </Detailed>
    </animated.group>
  );
}
