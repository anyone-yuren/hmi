import { Line, Text } from '@react-three/drei';
import { memo, useMemo, useRef } from 'react';
import * as THREE from 'three';
import CanvasText from './canvasText';
interface ISensor {
  x: number;
  y: number;
  z: number;
  pitch: number; // 绕X轴旋转（弧度）
  roll: number; // 绕Z轴旋转（弧度）
  yaw: number; // 绕Y轴旋转（弧度）
  name: string; // 传感器名称
}

interface IProps {
  sensors: ISensor[];
}

function SafetySensors({ sensors }: IProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(sensors.length * 3);
    sensors.forEach((sensor, index) => {
      arr[index * 3] = sensor.x;
      arr[index * 3 + 1] = sensor.y;
      arr[index * 3 + 2] = sensor.z;
    });
    return arr;
  }, [sensors]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  const Axes = ({
    position,
    pitch,
    roll,
    yaw,
    name,
  }: {
    position: [number, number, number];
    pitch: number;
    roll: number;
    yaw: number;
    name: string;
  }) => {
    const length = 0.5;

    const xAxisPoints = useMemo(() => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0)], [length]);
    const yAxisPoints = useMemo(() => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0)], [length]);
    const zAxisPoints = useMemo(() => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length)], [length]);

    const rotationQuaternion = useMemo(() => {
      const q = new THREE.Quaternion();
      const qx = new THREE.Quaternion();
      qx.setFromAxisAngle(new THREE.Vector3(1, 0, 0), roll);
      const qy = new THREE.Quaternion();
      qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), pitch);
      const qz = new THREE.Quaternion();
      qz.setFromAxisAngle(new THREE.Vector3(0, 0, 1), yaw);
      q.multiply(qz).multiply(qy).multiply(qx);
      return q;
    }, [roll, pitch, yaw]);

    return (
      <group>
        <group position={position} quaternion={rotationQuaternion}>
          <Line points={xAxisPoints} color='red' lineWidth={3} />
          <Line points={yAxisPoints} color='lime' lineWidth={3} />
          <Line points={zAxisPoints} color='blue' lineWidth={3} />
        </group>
        <CanvasText text={name} position={[position[0], position[1] - 0.1, position[2]]} fontSize={'4px'} />
        {false && (
          <Text
            position={[position[0], position[1] - 0.1, position[2]]} // 在坐标轴下方显示名称
            color='white'
            fontSize={0.15}
            anchorX='center'
            anchorY='middle'
            rotation={[Math.PI / 2, 0, 0]}
          >
            {name}
          </Text>
        )}
      </group>
    );
  };

  return (
    <>
      {false && (
        <points ref={pointsRef}>
          <primitive object={geometry} attach='geometry' />
          <pointsMaterial color='green' size={0.4} sizeAttenuation depthTest={false} />
        </points>
      )}

      {sensors.map((sensor, index) => (
        <Axes
          key={index}
          position={[sensor.x, sensor.y, sensor.z]}
          pitch={sensor.pitch}
          roll={sensor.roll}
          yaw={sensor.yaw}
          name={sensor.name}
        />
      ))}
    </>
  );
}

export default memo(SafetySensors);
