/**
 * @todo 车辆动画还需优化
 * @param {string}
 */
import x20 from '@/assets/img/topViewX20.png';
import { animated, useSpring } from '@react-spring/three';
import { PivotControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { Material } from 'three';

export function setMaterialProps(material: Material | Material[], props: Partial<Material>) {
  if (Array.isArray(material)) {
    material.forEach((m) => Object.assign(m, props));
  } else {
    Object.assign(material, props);
  }
}

// import { Locations } from '../warehouse/locations'

import { useHybridStore } from '@/store/hyBridStore';
import { Box, Image } from '@react-three/drei';
import { useShallow } from 'zustand/react/shallow';
import PointCloud from './pointCloud';

export interface IMxwCar {
  // id: number;
  hasLocations?: boolean; // 是否有货
  position?: THREE.Vector3;
  rotationY: number;
  width?: number;
  height?: number;
  depth?: number;
  onClick?: (id: number) => void;
}
/**
 * 计算最短旋转路径的角度
 * @param current 当前角度
 * @param target 目标角度
 * @returns 最短路径的旋转角度
 */
const calculateShortestAngle = (target: number): number => {
  const delta = ((target + 180) % 360) - 180;
  return delta;
};

/**
 * 将角度从度数转换为弧度。
 * @param degrees 角度值
 * @returns 弧度值
 */
const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};
/**
 * 在 3D 场景中渲染汽车模型的组件。
 * - 测试文档
 * @param {IMxwCar} props - The props object for configuring the car.
 * @param {boolean} props.hasLocations - Determines whether the car has goods. Default is true.
 * @param {number[]} props.position - The position of the car in 3D space. Default is [35, 0, -5].
 * @param {number} props.rotationY- The rotation angle of the car. Default is 0.
 * @return {JSX.Element} - The rendered car component.
 */
function MxwCar(props: IMxwCar) {
  const { rotationY = 0, width = 0.82, height = 1.99, depth = 1.6, onClick, image } = props;

  const { agvPosition } = useHybridStore(
    useShallow((state) => ({
      agvPosition: state.agvPosition,
    })),
  );
  const position = [agvPosition?.x / 1000 || 0, 0, agvPosition?.y / 1000 || 0];
  const { camera, controls } = useThree();

  // 点击card 将相机实时移动到车辆位置
  const cardClick = () => {
    // 获取相机位置为车辆的位置
    const targetPosition = new THREE.Vector3(...position);
    // controls.setPosition(targetPosition.x, targetPosition.y + 4, targetPosition.z, true);
    // controls.setTarget(targetPosition.x, targetPosition.y, targetPosition.z);
    controls?.setLookAt(
      targetPosition.x,
      targetPosition.y + 2,
      targetPosition.z,
      targetPosition.x,
      targetPosition.y,
      targetPosition.z,
      true, // 平滑动画
    );

    // 让相机朝向车辆
    // camera.lookAt(targetPosition);
  };
  // 计算目标角度与当前角度之间的最短路径
  const deltaRotation = useMemo(() => calculateShortestAngle(0 - agvPosition?.angel - 90), [agvPosition?.angel]);
  // 将角度变化转为弧度
  const rotationRadians = degreesToRadians(deltaRotation);
  console.log(rotationRadians, '1111111111');
  // 处理归一化后的角度
  const [groupProps] = useSpring(
    () => ({
      position,
      config: { tension: 170, friction: 26 },
      // easing: (t) => t * (2 - t),
      // rotation: [0, rotationY, 0], // 转换为弧度
    }),
    [position],
  );

  return (
    <Suspense>
      {/* 车辆主体，含旋转 */}
      <animated.group
        position={groupProps.position as unknown as THREE.Vector3}
        rotation={[0, 0 - agvPosition?.angel, 0]}
      >
        <PointCloud />
        {/* 车子本体 */}
        <group position={[0, 0, height / 2 - 0.3]}>
          <PivotControls>
            <Image
              renderOrder={20}
              url={x20}
              rotation={[-Math.PI / 2, 0, Math.PI]}
              scale={[width, height]}
              ref={(ref) => {
                if (ref) {
                  setMaterialProps(ref.material, {
                    depthTest: false,
                    depthWrite: false,
                    transparent: true,
                    needsUpdate: true,
                  });
                }
              }}
            />
          </PivotControls>
        </group>
      </animated.group>
      <Box position={position} args={[0.1, 0.1, 0.1]}></Box>
    </Suspense>
  );
}

export default MxwCar;
