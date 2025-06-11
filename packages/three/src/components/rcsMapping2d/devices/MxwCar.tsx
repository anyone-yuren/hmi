/**
 * @todo 车辆动画还需优化
 * @param {string}
 */
import { animated, useSpring } from '@react-spring/three';
import { Html } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Card } from 'antd';
import { Fragment, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { BoxGeometry, MeshBasicMaterial } from 'three';

// import { Locations } from '../warehouse/locations';
import DeviceItem from './DeviceItem';

import type { DescriptionsProps } from 'antd';

export interface IMxwCar {
  // id: number;
  hasLocations?: boolean; // 是否有货
  position?: THREE.Vector3;
  rotationY: number;
  width?: number;
  height?: number;
  depth?: number;
  onClick?: (id: number) => void;
  vehicleData?: any;
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
  const {
    position = [35, 0, -5],
    rotationY = 0,
    width = 0.82,
    height = 1.99,
    depth = 1.6,
    onClick,
    vehicleData,
  } = props;
  if (!vehicleData) return null;

  // const { fellowCamera, setFellowCamera } = useRcs2DGlobalStore(
  //   useShallow((state) => ({
  //     fellowCamera: state.fllowCamera,
  //     setFellowCamera: state.setFllowCamera,
  //   })),
  // );

  const baseMesh = useMemo(() => {
    const geometry = new BoxGeometry(0.8, 0.8, 0.8);
    return { geometry };
  }, []);

  const { camera, controls } = useThree();

  // 点击card 将相机实时移动到车辆位置
  const cardClick = () => {
    // setFellowCamera(true);
    // 获取相机位置为车辆的位置
    const targetPosition = new THREE.Vector3(...position);
    // controls.setPosition(targetPosition.x + 4, targetPosition.y + 6, targetPosition.z + 4, true);
    // controls.setTarget(targetPosition.x, targetPosition.y, targetPosition.z, true);

    // 让相机朝向车辆
    // camera.lookAt(targetPosition);
  };

  // useFrame(() => {
  //   if (camera.position.distanceTo(new THREE.Vector3(...position)) < 10 && fellowCamera) {
  //     const targetPosition = new THREE.Vector3(...position);
  //     controls.setPosition(targetPosition.x + 4, targetPosition.y + 6, targetPosition.z + 4, true);
  //     controls.setTarget(targetPosition.x, targetPosition.y, targetPosition.z, true);
  //   }
  // });

  // 计算目标角度与当前角度之间的最短路径
  const deltaRotation = useMemo(() => calculateShortestAngle(rotationY - 90), [rotationY]);

  // 将角度变化转为弧度
  const rotationRadians = degreesToRadians(deltaRotation);
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

  const items: DescriptionsProps['items'] = [
    {
      label: '当前楼层',
      span: 1,
      children: vehicleData?.floor,
    },
    {
      label: '电量',
      span: 1,
      children: vehicleData?.elecQuantity,
    },
    {
      label: '是否空闲',
      span: 1,
      children: vehicleData?.isFree ? '是' : '否',
    },
  ];

  const material = new MeshBasicMaterial({
    color: '#d0975d',
    transparent: true,
    opacity: 1,
  });

  return (
    <Suspense>
      <animated.group position={groupProps.position as unknown as THREE.Vector3} rotation={[0, 0 - rotationRadians, 0]}>
        {
          <DeviceItem
            modelPaths={
              (import.meta as any).env.MODE === 'development' ? ['/car/Mxw-1.FBX'] : ['/rcs-web/car/Mxw-1.FBX']
            }
            size={{ width, height, depth }}
            onClick={onClick}
          />
        }
        {vehicleData?.isHasGoods && <mesh geometry={baseMesh.geometry} material={material} castShadow receiveShadow />}
        <Html distanceFactor={10} position={[0, 0, 1]}>
          <Card
            className='cursor-pointer'
            onClick={cardClick}
            title={
              <Fragment>
                <span>车辆编号：{vehicleData?.vehicleNum}</span>
              </Fragment>
            }
            styles={{
              body: {
                padding: '6px',
              },
              header: {
                padding: '0 6px',
                minHeight: '32px',
              },
            }}
          >
            <div className='flex flex-col divide-y gap-2'>
              {items.map((item) => {
                return (
                  <div className='flex flex-row justify-between'>
                    <div>{item.label}</div>
                    <div>{item.children}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Html>
      </animated.group>
    </Suspense>
  );
}

export default MxwCar;
