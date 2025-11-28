// SafetyPointCloud.tsx
import { useSafetyStore } from '@/views/Safety/store/safety.store';
import { Sphere } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';

interface SafetyPointCloudProps {
  projectArea: { rectangle: number[] }[];
  forksUnderRect?: any;
  vehicleRect?: any;
  sensors: any[];
}

const MIN_POINT_SIZE = 0.02;
const MAX_POINT_SIZE = 0.14;
const BASE_POINT_SIZE = 0.06;

function SafetyPointCloud({ sensors }: SafetyPointCloudProps) {
  const { camera } = useThree();
  const { sensorPoints, obsInfo, sensorPointsKey, pointCloudFilter } = useSafetyStore(
    useShallow((store) => ({
      sensorPoints: store.sensorPoints,
      obsInfo: store.obsInfo,
      sensorPointsKey: store.sensorPointsKey,
      pointCloudFilter: store.pointCloudFilter,
    })),
  );

  const activeSensor = useMemo(() => {
    return obsInfo?.sensor_description || [];
  }, [obsInfo?.sensor_description]);

  const activePoints: any = useMemo(() => {
    return [obsInfo?.x || 0, obsInfo?.y || 0, obsInfo?.z || 0];
  }, [obsInfo?.x, obsInfo?.y, obsInfo?.z]);

  const geometryRef = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());
  const activePointGeometry = useRef<THREE.BufferGeometry>(new THREE.BufferGeometry());

  useEffect(() => {
    const positions = new Float32Array(activePoints);
    activePointGeometry.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [activePoints]);

  const toRadIfNeeded = (v: number) => {
    if (!isFinite(v)) return 0;
    if (Math.abs(v) > 2 * Math.PI) return THREE.MathUtils.degToRad(v);
    return v;
  };
  const rawPointsAndColors = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    const tempVec = new THREE.Vector3();
    const rotX = new THREE.Matrix4();
    const rotY = new THREE.Matrix4();
    const rotZ = new THREE.Matrix4();
    const tmpMat = new THREE.Matrix4();
    const { minY, maxY } = pointCloudFilter;
    Object.keys(sensorPoints || {})
      ?.filter((key) => sensorPointsKey.includes(key))
      .forEach((key: any) => {
        const ary = key.split(/_(.*)/, 2);
        const sensorName = ary[1];
        const isSensorActive = sensorName ? activeSensor.includes(sensorName) : false;

        const obj = sensors.find((origin) => origin.name === sensorName);
        if (!obj) {
          (sensorPoints[key] as { x: number; y: number; z: number }[]).forEach((p) => {
            positions.push(p.x, p.y, p.z);
            if (isSensorActive) colors.push(1, 0, 0);
            else colors.push(1, 1, 1);
          });
          return;
        }

        const { x = 0, y = 0, z = 0, pitch = 0, roll = 0, yaw = 0 } = obj;

        const pitchRad = toRadIfNeeded(pitch);
        const rollRad = toRadIfNeeded(roll);
        const yawRad = toRadIfNeeded(yaw);

        rotZ.makeRotationZ(yawRad);
        rotY.makeRotationY(pitchRad);
        rotX.makeRotationX(rollRad);

        tmpMat.identity();
        tmpMat.multiply(rotZ);
        tmpMat.multiply(rotY);
        tmpMat.multiply(rotX);

        tmpMat.setPosition(new THREE.Vector3(x, y, z));

        (sensorPoints[key] as { x: number; y: number; z: number }[]).forEach((p) => {
          tempVec.set(p.x, p.y, p.z);
          tempVec.applyMatrix4(tmpMat);
          if (minY <= tempVec.z && tempVec.z <= maxY) {
            positions.push(tempVec.x, tempVec.y, tempVec.z);
          }

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
  }, [sensorPoints, sensorPointsKey, activeSensor, sensors, pointCloudFilter]);

  const shaderMaterialRef = useRef<THREE.ShaderMaterial>();

  const tempVecForFrustum = useMemo(() => new THREE.Vector3(), []);
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const projScreenMatrix = useMemo(() => new THREE.Matrix4(), []);

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
    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.color.needsUpdate = true;
  }, [rawPointsAndColors]);

  useFrame(() => {
    if (!geometryRef.current) return;
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(projScreenMatrix);

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
