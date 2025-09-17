import { memo, useEffect, useMemo, useState } from 'react';

import { GizmoHelper, GizmoViewport } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import CameraController from './component/cameraController';
import Ground from './component/ground';

const mock = {
  rectangle_list: [
    {
      id: 1,
      name: 'head',
      rectangle: [0, -500, 500, 500], // 车头左上右下坐标
      is_active: false,
      associated_device: 0,
    },
    {
      id: 2,
      name: 'forkarm',
      rectangle: [-1000, -300, 0, 300], // 叉臂左上右下坐标
      is_active: true,
      associated_device: 1,
    },
  ],
  // 叉臂高度订阅 /sirius/topics/robot_status_forkarm data?.z , 点云在obsInfo的推送里
  strategy_under_fork_protection: {
    rectangle: [-1000, -500, -200, 500],
    min_forkarm_height_to_open_this: 500,
    height_start: 100, // 叉臂离地基础高度
    forkarm_height_cut: 300, // 叉臂上方裁剪高度, 保护区域高度需要叉臂高度减去height_start和forkarm_height_cut
    min_distance_to_task_point_close_this: 1500,
    associated_sensor_list: ['Lidar3d_17'],
  },
};
const generateRandomPoints = (
  count: number,
  range: number,
  spaceGeo: THREE.BufferGeometry,
  position: THREE.Vector3,
) => {
  const positions = new Float32Array(count * 3); // 每个点有 x, y, z 三个坐标
  const colors = new Float32Array(count * 3); // 每个点有 r, g, b 三个颜色分量

  // 获取 spaceGeo 的边界框
  const boundingBox = new THREE.Box3().setFromBufferAttribute(
    spaceGeo.getAttribute('position') as THREE.BufferAttribute,
  );
  boundingBox.translate(position);
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * range;
    const y = (Math.random() - 0.5) * range;
    const z = (Math.random() - 0.5) * range;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // 判断点是否在 spaceGeo 内部
    const point = new THREE.Vector3(x, y, z);
    if (boundingBox.containsPoint(point)) {
      colors[i * 3] = 1; // 红色 (r)
      colors[i * 3 + 1] = 0; // 绿色 (g)
      colors[i * 3 + 2] = 0; // 蓝色 (b)
    } else {
      colors[i * 3] = 0; // 默认颜色 (白色)
      colors[i * 3 + 1] = 0;
      colors[i * 3 + 2] = 0;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); // 添加颜色属性

  return geometry;
};

// 点云组件
const RandomPoints = memo(({ count = 1000, range = 10, spaceGeo, color = '#ffffff', spaceGeoPosition }) => {
  const pointsGeometry = useMemo(
    () => generateRandomPoints(count, range, spaceGeo, spaceGeoPosition),
    [count, range, spaceGeo, spaceGeoPosition],
  );

  return (
    <points>
      <primitive object={pointsGeometry} />
      <pointsMaterial size={0.1} vertexColors />
    </points>
  );
});

const RandomCirclePoints = memo(({ count = 1000, range = 10, spaceGeo, spaceGeoPosition }) => {
  const spheres = useMemo(() => {
    const sphereGeometry = new THREE.SphereGeometry(0.02, 10, 10); // 小球体几何体
    const boundingBox = new THREE.Box3().setFromBufferAttribute(
      spaceGeo.getAttribute('position') as THREE.BufferAttribute,
    );
    boundingBox.translate(spaceGeoPosition);

    const spheresArray = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * range;
      const y = (Math.random() - 0.5) * range;
      const z = (Math.random() - 0.5) * range;

      const position = new THREE.Vector3(x, y, z);
      const color = boundingBox.containsPoint(position) ? 'red' : 'black'; // 判断颜色

      spheresArray.push(
        <mesh key={i} position={[x, y, z]}>
          <primitive object={sphereGeometry} />
          <meshBasicMaterial color={color} />
        </mesh>,
      );
    }
    return spheresArray;
  }, [count, range, spaceGeo, spaceGeoPosition]);

  return <group>{spheres}</group>;
});
const Safety = () => {
  const { t } = useTranslation();
  const [scale, setScale] = useState(1);
  const [depth, setDepth] = useState(2);
  const [isIncreasing, setIsIncreasing] = useState(true);
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 2, 6), []);
  const spaceGeo = useMemo(() => new THREE.BoxGeometry(6, 2, depth), [depth]);
  const grayMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: '#00d1d1', transparent: true, opacity: 0.6 });
  }, []);
  const spaceGeoPosition = useMemo(() => new THREE.Vector3(-3.5, 0, depth / 2), [depth]);
  const forksMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: 'white' });
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setDepth((prevDepth) => {
        if (isIncreasing) {
          // 如果当前是增长状态，且深度小于 6，则继续增加
          if (prevDepth < 6) {
            return prevDepth + 0.1;
          } else {
            setIsIncreasing(false); // 切换为减少状态
            return prevDepth - 0.1;
          }
        } else {
          // 如果当前是减少状态，且深度大于 1，则继续减少
          if (prevDepth > 1) {
            return prevDepth - 0.1;
          } else {
            setIsIncreasing(true); // 切换为增长状态
            return prevDepth + 0.1;
          }
        }
      });
    }, 1000); // 每 100ms 更新一次

    return () => clearInterval(interval); // 清除定时器
  }, [isIncreasing]);
  return (
    <div className='w-full h-full flex flex-col'>
      <Canvas
        camera={{
          position: [0, -80, 10],
          fov: 30,
          near: 0.01,
          far: 100000,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0, 0); // 将相机朝向原点
        }}
      >
        <color attach='background' args={['#cccccc']} />
        <ambientLight intensity={1} color={'#ffffff'} />
        <directionalLight position={[3, 4, 2]} intensity={2} color='#ffffff' castShadow />
        <mesh geometry={geometry} position={[0, 0, 3]}>
          <meshStandardMaterial color='#00d1d1' />
        </mesh>
        <mesh geometry={spaceGeo} material={grayMaterial} position={spaceGeoPosition}></mesh>
        {true && (
          <RandomPoints
            count={20000}
            range={12}
            color='black'
            spaceGeo={spaceGeo}
            spaceGeoPosition={spaceGeoPosition}
          />
        )}
        {false && (
          <RandomCirclePoints
            count={20000}
            range={12}
            color='black'
            spaceGeo={spaceGeo}
            spaceGeoPosition={spaceGeoPosition}
          />
        )}

        <CameraController />
        <Ground />
        <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black' />
        </GizmoHelper>
      </Canvas>
    </div>
  );
};
export default Safety;
