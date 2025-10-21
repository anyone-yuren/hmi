// SafetyPointCloud.tsx
import { useSafetyStore } from '@/views/Safety/store/safety.store';
import { Sphere } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { getProjectArea } from '../../utils/index';
interface SafetyPointCloudProps {
  projectArea: { rectangle: number[] }[];
  forksUnderRect?: any;
  vehicleRect?: any;
}

const MAX_RENDERED_POINTS = 60000;
const MIN_POINT_SIZE = 0.02;
const MAX_POINT_SIZE = 0.14;
const BASE_POINT_SIZE = 0.06;
const ACTIVE_POINT_SIZE = 0.5;
const ACTIVE_POINT_RADIUS = 1;

function SafetyPointCloud({ projectArea, forksUnderRect, vehicleRect }: SafetyPointCloudProps) {
  const { camera, size } = useThree();
  const { forksHeight, sensorPoints, obsInfo } = useSafetyStore(
    useShallow((store) => ({
      forksHeight: store.forksHeight,
      sensorPoints: store.sensorPoints,
      obsInfo: store.obsInfo,
    })),
  );

  const [excludeOutsidePoints] = useState(false);

  const vehicleOutline = useMemo(() => {
    const obj = vehicleRect.find((item) => item.name === 'head');
    return obj?.rectangle;
  }, [vehicleRect]);

  const forksUnderProjectArea = useMemo(() => {
    if (!forksUnderRect) return null;
    return getProjectArea(forksUnderRect, forksHeight);
  }, [forksUnderRect, forksHeight]);

  const activePoints: any = useMemo(() => {
    return [obsInfo?.x || 0, obsInfo?.y || 0, obsInfo?.z || 0];
  }, [obsInfo?.x, obsInfo?.y, obsInfo?.z]);

  useEffect(() => {
    console.log('activePoints', activePoints);
    const positions = new Float32Array(activePoints);
    activePointGeometry.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [activePoints]);
  // 原始点数据

  const rawPoints = useMemo(() => {
    const arr: number[] = [];

    Object.values(sensorPoints || {}).forEach((list: any) => {
      (list as { x: number; y: number; z: number }[]).forEach((p) => {
        arr.push(p.x, p.y, p.z);
      });
    });

    return new Float32Array(arr);
  }, [sensorPoints]);

  const geometryRef = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const activePointGeometry = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const activePointMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: 0xff0000, // 红色
      size: ACTIVE_POINT_SIZE, // 点的大小
      sizeAttenuation: true, // 启用深度衰减
    });
  }, []);

  const shaderMaterialRef = useRef<THREE.ShaderMaterial>();

  const tempVec = useMemo(() => new THREE.Vector3(), []);
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), []);

  // ShaderMaterial
  const shaderMaterial = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      uniforms: {
        uSize: { value: BASE_POINT_SIZE },
        uPixelRatio: { value: window.devicePixelRatio || 1 },
        uMaxSize: { value: MAX_POINT_SIZE },
        uMinSize: { value: MIN_POINT_SIZE },
      },
      vertexShader: `
        varying vec3 vColor;
        uniform float uSize;
        uniform float uPixelRatio;
        uniform float uMaxSize;
        uniform float uMinSize;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float dist = length(mvPosition.xyz);
          float size = uSize * (1.0 / (0.02 * dist + 0.4));
          size = clamp(size, uMinSize, uMaxSize);
          gl_PointSize = size * (uPixelRatio * 60.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 cxy = 2.0 * gl_PointCoord - 1.0;
          float r = dot(cxy, cxy);
          if (r > 1.0) discard;
          float alpha = 1.0 - smoothstep(0.7, 1.0, r);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });
    shaderMaterialRef.current = mat;
    return mat;
  }, []);

  useEffect(() => {
    if (!geometryRef.current || rawPoints.length === 0) return;
    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(rawPoints, 3));
  }, [geometryRef.current, rawPoints]);

  // useFrame 动态更新点云
  useFrame(() => {
    if (!geometryRef.current || rawPoints.length === 0) return;
    // 更新 frustum
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);

    const positions: number[] = [];
    const colors: number[] = [];
    // 计算屏幕像素密度下的采样率
    // 屏幕总像素数
    const pixelCount = size.width * size.height;
    // 目标点数 = min(像素数 * k, MAX_RENDERED_POINTS)
    const stride = 1 / 3;
    let box: THREE.Box3 | null = null;
    if (forksUnderProjectArea) {
      const sizeVec = new THREE.Vector3(
        forksUnderProjectArea.width,
        forksUnderProjectArea.height,
        forksUnderProjectArea.depth,
      );
      const center = new THREE.Vector3(
        forksUnderProjectArea.position[0],
        forksUnderProjectArea.position[1],
        forksUnderProjectArea.position[2],
      );
      box = new THREE.Box3().setFromCenterAndSize(center, sizeVec);
    }
    for (let i = 0; i < rawPoints.length; i += 3) {
      const x = rawPoints[i];
      const y = rawPoints[i + 1];
      const z = rawPoints[i + 2];
      tempVec.set(x, y, z);
      // if (!frustum.containsPoint(tempVec)) continue;
      // const insideBox = box?.containsPoint(tempVec) ?? false;
      // const insideRect = projectArea.some((a) => isPointInRectangle(tempVec.x, tempVec.y, a.rectangle));
      // const insideVehicle = isPointInVehicle(tempVec.x, tempVec.y, tempVec.z, vehicleOutline);
      // const inside = insideBox || insideRect || insideVehicle;
      // if (!excludeOutsidePoints || inside) {
      positions.push(x, y, z);
      colors.push(1, 1, 1);
      //   if (inside) colors.push(1, 0, 0);
      //   else colors.push(1, 1, 1);
      // }
    }
    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometryRef.current.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  });

  return (
    <>
      <points geometry={geometryRef.current} material={shaderMaterial} frustumCulled={false} />
      <Sphere args={[0.1, 32, 32]} position={activePoints}>
        <meshBasicMaterial color={'red'} transparent opacity={0.8} />
      </Sphere>
    </>
  );
}

export default memo(SafetyPointCloud);
