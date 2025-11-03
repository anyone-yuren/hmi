// RouteWind.tsx
import { MeshProps, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useHomeStore } from '../../../store/index';

type Point2D = { x: number; y: number; id?: number };
type Segment = {
  id: number;
  start_point: Point2D;
  control_points: Point2D[];
  end_point: Point2D;
};

const MM2M = 0.001;

function mergeSegments(segments: Segment[]) {
  const seq: Point2D[] = [];
  for (let i = 0; i < segments.length; i++) {
    const s = segments[i];
    if (i === 0) seq.push(s.start_point);
    for (const cp of s.control_points) seq.push(cp);
    const last = seq[seq.length - 1];
    const end = s.end_point;
    if (!last || last.x !== end.x || last.y !== end.y) seq.push(end);
  }
  return seq;
}

function toVector3List(points: Point2D[]) {
  return points.map((p) => new THREE.Vector3(-p.x * MM2M, 0, p.y * MM2M));
}

type RouteWindProps = {
  tubularSegments?: number;
  radius?: number;
  radialSegments?: number;
  windAmplitude?: number;
  windFrequency?: number;
} & MeshProps;

export default function RouteWind({
  tubularSegments = 600,
  radius = 0.06,
  radialSegments = 8,
  windAmplitude = 0.06,
  windFrequency = 4.0,
  ...rest
}: RouteWindProps) {
  const { segmentsInfo } = useHomeStore(
    useShallow((state) => ({
      segmentsInfo: state.segmentsInfo,
    })),
  );

  const meshRef = useRef<THREE.Mesh>(null);

  const points = useMemo(() => {
    if (!segmentsInfo?.length) return [];
    const merged = mergeSegments(segmentsInfo);
    return toVector3List(merged);
  }, [segmentsInfo]);

  const curve = useMemo(() => {
    if (!points.length) return null;
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, [points]);

  const geometry = useMemo(() => {
    if (!curve) return null;
    const geom = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, false);

    const pos = geom.attributes.position as THREE.BufferAttribute;
    const count = pos.count;
    const uAlong = new Float32Array(count);

    const rings = tubularSegments + 1;
    const vertsPerRing = count / rings;
    for (let ring = 0; ring < rings; ring++) {
      const frac = ring / (rings - 1);
      for (let v = 0; v < vertsPerRing; v++) {
        const idx = ring * vertsPerRing + v;
        uAlong[idx] = frac;
      }
    }
    geom.setAttribute('uAlong', new THREE.BufferAttribute(uAlong, 1));
    return geom;
  }, [curve, tubularSegments, radius, radialSegments]);

  /** 🎯 箭头移动用 shader */
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: windAmplitude },
      uFreq: { value: windFrequency },
      uColorA: { value: new THREE.Color('#00E6E6') },
      uColorB: { value: new THREE.Color('#004C4C') },
      uArrowSpacing: { value: 0.2 }, // 100mm
      uArrowWidth: { value: 0.1 },
      uArrowSpeed: { value: 0.3 },
    }),
    [windAmplitude, windFrequency],
  );

  const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform float uAmp;
    uniform float uFreq;
    attribute float uAlong;
    varying float vAlong;
    void main() {
      vAlong = uAlong;
      float wave = sin((uAlong * uFreq * 6.28318) - uTime * 2.0);
      vec3 displaced = position + normal * (wave * uAmp);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    precision highp float;
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uArrowSpacing;
    uniform float uArrowWidth;
    uniform float uArrowSpeed;
    varying float vAlong;

    void main() {
      // 基础颜色渐变
      vec3 base = mix(uColorA, uColorB, vAlong);

      // 箭头流动效果（100mm间隔）
      float move = fract(vAlong - uTime * uArrowSpeed);
      float arrowPattern = abs(fract(move / uArrowSpacing) - 0.5) * 2.0;
      float arrow = smoothstep(uArrowWidth, 0.0, arrowPattern);

      vec3 color = base + arrow * vec3(1.0, 1.0, 1.0);
      float alpha = 0.6 + arrow * 0.8;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const shaderMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    return mat;
  }, []);

  useFrame((state, delta) => {
    shaderMaterial.uniforms.uTime.value += delta;
  });

  const centerLine = useMemo(() => {
    if (!curve) return null;
    const pathPoints = curve.getPoints(Math.max(64, Math.floor(tubularSegments / 4)));
    const geom = new THREE.BufferGeometry().setFromPoints(pathPoints);
    return geom;
  }, [curve, tubularSegments]);

  if (!segmentsInfo?.length) return null;

  return (
    <group {...rest}>
      {geometry && <mesh ref={meshRef} geometry={geometry} material={shaderMaterial} />}
      {centerLine && (
        <line>
          <bufferGeometry attach='geometry' {...(centerLine as any)} />
          <lineBasicMaterial attach='material' color='#00FFFF' transparent opacity={0.4} />
        </line>
      )}
    </group>
  );
}
