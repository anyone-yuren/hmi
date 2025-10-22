import { Line, Text } from '@react-three/drei';
import { memo, useMemo, useRef } from 'react';
import * as THREE from 'three';

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
  console.log('SafetySensors', sensors);
  // 将传感器数据转换为 Float32Array 格式
  const positions = useMemo(() => {
    const arr = new Float32Array(sensors.length * 3);
    sensors.forEach((sensor, index) => {
      arr[index * 3] = sensor.x;
      arr[index * 3 + 1] = sensor.y;
      arr[index * 3 + 2] = sensor.z;
    });
    return arr;
  }, [sensors]);

  // 创建几何体
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  // 创建坐标轴组件
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

    // 定义三个坐标轴的端点（相对于局部坐标系）
    const xAxisPoints = useMemo(() => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0)], [length]);
    const yAxisPoints = useMemo(() => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0)], [length]);
    const zAxisPoints = useMemo(() => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length)], [length]);

    // 创建欧拉角旋转
    const rotation = useMemo(() => {
      // 注意：欧拉角的顺序通常是 YXZ（yaw, pitch, roll）
      // yaw 是绕 Z 轴旋转 roll X 轴旋转 pitch Y 轴旋转
      // return new THREE.Euler(degreesToRadians(0), degreesToRadians(0), degreesToRadians(166), 'XYZ');
      return new THREE.Euler(roll, pitch, yaw, 'XYZ'); // 参数已经是弧度
    }, [pitch, roll, yaw]);

    const rotationQuaternion = useMemo(() => {
      const q = new THREE.Quaternion();

      // 绕世界 X 轴旋转
      const qx = new THREE.Quaternion();
      qx.setFromAxisAngle(new THREE.Vector3(1, 0, 0), roll);

      // 绕世界 Y 轴旋转
      const qy = new THREE.Quaternion();
      qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), pitch);

      // 绕世界 Z 轴旋转
      const qz = new THREE.Quaternion();
      qz.setFromAxisAngle(new THREE.Vector3(0, 0, 1), yaw);

      // 顺序：Z → Y → X（即世界坐标顺序）
      q.multiply(qz).multiply(qy).multiply(qx);

      return q;
    }, [roll, pitch, yaw]);

    return (
      <group>
        {/* 旋转的坐标轴部分 */}
        <group position={position} quaternion={rotationQuaternion}>
          {/* X轴 - 红色 */}
          <Line points={xAxisPoints} color='red' lineWidth={3} />

          {/* Y轴 - 蓝色 */}
          <Line points={yAxisPoints} color='lime' lineWidth={3} />

          {/* Z轴 - 绿色 */}
          <Line points={zAxisPoints} color='blue' lineWidth={3} />
        </group>

        {/* 不参与旋转的传感器名称 */}
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
      </group>
    );
  };

  return (
    <>
      {/* 传感器点 */}
      {false && (
        <points ref={pointsRef}>
          <primitive object={geometry} attach='geometry' />
          <pointsMaterial color='green' size={0.4} sizeAttenuation depthTest={false} />
        </points>
      )}

      {/* 为每个传感器点添加坐标轴 */}
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
