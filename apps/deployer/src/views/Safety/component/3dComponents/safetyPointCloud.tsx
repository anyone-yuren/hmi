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
  sensors: any[];
}

const MAX_RENDERED_POINTS = 60000;
const MIN_POINT_SIZE = 0.02;
const MAX_POINT_SIZE = 0.14;
const BASE_POINT_SIZE = 0.06;
const ACTIVE_POINT_SIZE = 0.5;
const ACTIVE_POINT_RADIUS = 1;

function SafetyPointCloud({ projectArea, forksUnderRect, vehicleRect, sensors }: SafetyPointCloudProps) {
  const { camera, size } = useThree();
  const { forksHeight, sensorPoints, obsInfo, sensorPointsKey } = useSafetyStore(
    useShallow((store) => ({
      forksHeight: store.forksHeight,
      sensorPoints: store.sensorPoints,
      obsInfo: store.obsInfo,
      sensorPointsKey: store.sensorPointsKey,
    })),
  );

  const [excludeOutsidePoints] = useState(false);

  const activeSensor = useMemo(() => {
    return obsInfo?.sensor_description || [];
  }, [obsInfo?.sensor_description]);

  const vehicleOutline = useMemo(() => {
    const obj = vehicleRect?.find((item: any) => item.name === 'head');
    return obj?.rectangle;
  }, [vehicleRect]);

  const forksUnderProjectArea = useMemo(() => {
    if (!forksUnderRect) return null;
    return getProjectArea(forksUnderRect, forksHeight);
  }, [forksUnderRect, forksHeight]);

  const activePoints: any = useMemo(() => {
    return [obsInfo?.x || 0, obsInfo?.y || 0, obsInfo?.z || 0];
  }, [obsInfo?.x, obsInfo?.y, obsInfo?.z]);

  const geometryRef = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const activePointGeometry = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const activePointMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: 0xff0000,
      size: ACTIVE_POINT_SIZE,
      sizeAttenuation: true,
    });
  }, []);

  useEffect(() => {
    const positions = new Float32Array(activePoints);
    activePointGeometry.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [activePoints]);

  // helper: convert degrees to radians if input looks like degrees
  const toRadIfNeeded = (v: number) => {
    if (!isFinite(v)) return 0;
    // if absolute value greater than 2π, treat as degrees and convert
    if (Math.abs(v) > 2 * Math.PI) return THREE.MathUtils.degToRad(v);
    return v;
  };

  // =============================
  // 核心：点云偏移 + 使用 Matrix4 (避免 Euler 问题)
  // =============================
  const rawPointsAndColors = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    // 临时对象复用（注意每次设置后立即 apply，不会被其他传感器复用造成污染）
    const tempVec = new THREE.Vector3();
    const rotX = new THREE.Matrix4();
    const rotY = new THREE.Matrix4();
    const rotZ = new THREE.Matrix4();
    const tmpMat = new THREE.Matrix4();

    Object.keys(sensorPoints || {})
      ?.filter((key) => sensorPointsKey.includes(key))
      .forEach((key: any) => {
        // key 可能形如 <prefix>_<sensorName>
        const ary = key.split(/_(.*)/, 2);
        const sensorName = ary[1];
        const isSensorActive = sensorName ? activeSensor.includes(sensorName) : false;

        // 找到对应传感器的原始姿态信息
        const obj = sensors.find((origin) => origin.name === sensorName);
        if (!obj) {
          // 如果没有找到对应传感器信息，直接把点按原样加入
          (sensorPoints[key] as { x: number; y: number; z: number }[]).forEach((p) => {
            positions.push(p.x, p.y, p.z);
            if (isSensorActive) colors.push(1, 0, 0);
            else colors.push(1, 1, 1);
          });
          return;
        }

        const { x = 0, y = 0, z = 0, pitch = 0, roll = 0, yaw = 0 } = obj;

        // 将角度值智能转换为弧度（如果输入是度数）
        const pitchRad = toRadIfNeeded(pitch);
        const rollRad = toRadIfNeeded(roll);
        const yawRad = toRadIfNeeded(yaw);

        // 构造旋转矩阵（不使用 Euler），顺序：Z (yaw) -> Y (pitch) -> X (roll)
        // 注意顺序可以根据你的传感器定义调整
        rotZ.makeRotationZ(yawRad);
        rotY.makeRotationY(pitchRad);
        rotX.makeRotationX(rollRad);

        // tmpMat = rotZ * rotY * rotX
        tmpMat.identity();
        tmpMat.multiply(rotZ);
        tmpMat.multiply(rotY);
        tmpMat.multiply(rotX);

        // 把平移放到矩阵中（注意 setPosition 会替换矩阵的第四列）
        tmpMat.setPosition(new THREE.Vector3(x, y, z));

        // 对该传感器下的每个点，应用矩阵
        (sensorPoints[key] as { x: number; y: number; z: number }[]).forEach((p) => {
          tempVec.set(p.x, p.y, p.z);
          tempVec.applyMatrix4(tmpMat); // 局部 -> 世界
          positions.push(tempVec.x, tempVec.y, tempVec.z);

          if (isSensorActive) {
            colors.push(1, 0, 0);
          } else {
            colors.push(1, 1, 1);
          }
        });
      });

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
    };
  }, [sensorPoints, sensorPointsKey, activeSensor, sensors]);

  const shaderMaterialRef = useRef<THREE.ShaderMaterial>();

  const tempVecForFrustum = useMemo(() => new THREE.Vector3(), []);
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
    if (!geometryRef.current) return;
    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(rawPointsAndColors.positions, 3));
    geometryRef.current.setAttribute('color', new THREE.Float32BufferAttribute(rawPointsAndColors.colors, 3));
    // 标记几何体需要更新（WebGL buffers）
    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.color.needsUpdate = true;
  }, [rawPointsAndColors]);

  useFrame(() => {
    if (!geometryRef.current) return;
    // 更新视锥（如果以后要做剪裁）
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);

    // 目前直接使用 precomputed rawPointsAndColors（如果需要做帧内动态过滤可以扩展）
    geometryRef.current.setAttribute('position', new THREE.Float32BufferAttribute(rawPointsAndColors.positions, 3));
    geometryRef.current.setAttribute('color', new THREE.Float32BufferAttribute(rawPointsAndColors.colors, 3));
    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.color.needsUpdate = true;
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
