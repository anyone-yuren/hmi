/**
 * @todo 车辆动画还需优化
 * @param {string}
 */
import { useRcsGlobalStore } from '@gbeata/store';
import { animated, useSpring } from '@react-spring/three';
import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { BoxGeometry, Material, MeshBasicMaterial } from 'three';
import { useShallow } from 'zustand/react/shallow';
import x20 from '../assets/X20S.png';

export function setMaterialProps(material: Material | Material[], props: Partial<Material>) {
  if (Array.isArray(material)) {
    material.forEach((m) => Object.assign(m, props));
  } else {
    Object.assign(material, props);
  }
}

// import { Locations } from '../warehouse/locations'

import { Image } from '@react-three/drei';
import { type DescriptionsProps } from 'antd';

export interface IMxwCar {
  // id: number;
  hasLocations?: boolean; // 是否有货
  position?: THREE.Vector3;
  rotationY: number;
  width?: number;
  height?: number;
  depth?: number;
  onClick?: (id: number) => void;
  vechicleData?: any;
  isHasGoods?: boolean;
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
    vechicleData,
    isHasGoods,
    image,
  } = props;

  const { fllowCamera, setFllowCamera } = useRcsGlobalStore(
    useShallow((state) => ({
      fllowCamera: state.fllowCamera,
      setFllowCamera: state.setFllowCamera,
    })),
  );

  const { camera, controls } = useThree();

  // 点击card 将相机实时移动到车辆位置
  const cardClick = () => {
    setFllowCamera(true);
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

  // useFrame(() => {
  //   if (camera.position.distanceTo(new THREE.Vector3(...position)) < 10 && fllowCamera) {
  //     const targetPosition = new THREE.Vector3(...position);
  //     controls.setPosition(targetPosition.x + 0.01, targetPosition.y + 4, targetPosition.z + 0.01, true);
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
      children: vechicleData?.floor,
    },
    {
      label: '电量',
      span: 1,
      children: vechicleData?.elecQuantity,
    },
    {
      label: '是否有货',
      span: 1,
      children: isHasGoods ? '是' : '否',
    },
  ];
  const htmlRef = useRef<HTMLDivElement>(null); // 引用Html
  const [htmlDistanceFactor, setHtmlDistanceFactor] = useState(5); // 初始值

  useFrame(() => {
    if (!htmlRef.current) return;

    // 相机到车辆的距离
    const carPosition = new THREE.Vector3(...position);
    const distance = camera.position.distanceTo(carPosition);

    // 根据距离动态调整distanceFactor
    if (distance > 50) {
      setHtmlDistanceFactor(4 * (distance / 30)); // 距离翻倍，factor也翻倍，保证视觉大小
    } else {
      setHtmlDistanceFactor(6); // 保持原来大小
    }
  });
  const baseMesh = useMemo(() => {
    const geometry = new BoxGeometry(0.8, 0.8, 0.8);
    // return new Mesh(geometry, material); // 返回一个 Mesh 对象
    return { geometry };
  }, []);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({ color: 'yellow', transparent: true, opacity: 1, depthWrite: false, depthTest: false }),
    [],
  );
  return (
    <Suspense>
      {/* 车辆主体，含旋转 */}
      <animated.group position={groupProps.position as unknown as THREE.Vector3} rotation={[0, 0 - rotationRadians, 0]}>
        {/* 车子本体 */}
        <group position={[0, 0, 0.6]}>
          <Image
            // renderOrder={20}
            url={x20}
            rotation={[-Math.PI / 2, 0, Math.PI]}
            scale={[1, 2]}
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
        </group>
        {isHasGoods ? <mesh geometry={baseMesh.geometry} position={[0, 0.6, 0.3]} material={material} /> : null}
        {/* <Float autoInvalidate rotationIntensity={0} floatIntensity={0} floatingRange={[1, 1]}> */}
        {/* <Html ref={htmlRef} distanceFactor={htmlDistanceFactor} position={[-1.2, 0, 0]} center>
          <ThemeProvider appearance='light'>
            <Card
              className='cursor-pointer p-2 bg-opacity-60'
              onClick={cardClick}
              title={<span>车辆编号：{vechicleData?.vehicleNum}</span>}
              styles={{
                body: { padding: '6px' },
                header: { padding: '0 6px', minHeight: '32px', borderBottom: '1px solid #079586' },
              }}
            >
              <div className='flex flex-col gap-2 divide-y divide-opacity-20'>
                {items.map((item) => (
                  <div className='flex flex-row justify-between' key={item.label as string}>
                    <div>{item.label}</div>
                    <div>{item.children}</div>
                  </div>
                ))}
              </div>
            </Card>
          </ThemeProvider>
        </Html> */}
        {/* </Float> */}
      </animated.group>
    </Suspense>
  );
}

export default MxwCar;
