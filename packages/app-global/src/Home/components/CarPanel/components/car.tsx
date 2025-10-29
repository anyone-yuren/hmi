// import { useHybirdStore } from '@/components/Pages/Hybrid/store/hybird.store';
import { animated, useSpring } from '@react-spring/three';
import { Svg, useHelper } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { PointLightHelper, type DirectionalLight } from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useAgvType } from '../../../../hooks/useAgvType';
import { Fork15lift, O15Model, Sl14Model, X20Model } from '../../../../Models/components';
import { useHomeHybirdStore } from '../../../store/hybird';
import { useHomeStore } from '../../../store/index';
// import { PointLight } from "@react-three/drei";

export const convertToMeters = (value: number) => value / 1000;
// interface IProps {
//   agvPosition: {
//     x: number;
//     y: number;
//     angel: number;
//   };
// }
const Car = (props) => {
  // const { agvPosition } = props;
  const agvType = useAgvType();

  const { robotForkarmStatus, robotRadarStatus } = useHomeStore(
    useShallow((state) => ({
      robotForkarmStatus: state.robotForkarmStatus,
      robotRadarStatus: state.robotRadarStatus,
    })),
  );

  const headRadar = useMemo(() => {
    const headData = robotRadarStatus?.filter((item) => item?.name?.includes('head'));
    if (headData?.length) {
      return headData[0];
    }
  }, [robotRadarStatus]);

  const { agvPosition } = useHomeHybirdStore(
    useShallow((state) => ({
      agvPosition: state.agvPosition,
    })),
  );

  const position = [0 - agvPosition?.x / 1000 || 0, 0, agvPosition?.y / 1000 || 0];

  const directionalLightRef = useRef<DirectionalLight>(null!);
  useHelper(directionalLightRef, PointLightHelper, 2);

  const calculateShortestAngle = (target: number): number => {
    const delta = (target * 180) / Math.PI + 180;
    return delta;
  };
  // const calculateShortestAngle = (target: number): number => {
  //   console.log('target', target);
  //   const delta = ((target + 180) % 360) - 180;
  //   return delta;
  // };

  // 计算目标角度与当前角度之间的最短路径
  const deltaRotation = useMemo(
    () => calculateShortestAngle(agvPosition.angel), // 没有任何依据的0.6，只是图标精度的调整
    [agvPosition.angel],
  );

  const [groupProps] = useSpring(
    () => ({
      position,
      config: { tension: 170, friction: 26 },
      // easing: (t) => t * (2 - t),
      // rotation: [0, rotationY, 0], // 转换为弧度
    }),
    [position],
  );

  // 将角度变化转为弧度

  return (
    <>
      {/* <pointLight
        // ref={directionalLightRef}
        position={[agvPosition.x / 1000, 0, agvPosition.y / 1000]} // 设置光源的位置与车辆同步
        color={'#00D1D1'} // 光源颜色
        castShadow={true} // 启用阴影投射
      /> */}
      <group>
        <group
          scale={0.03}
          position={[agvPosition.x / 1000, 0.01, agvPosition.y / 1000]}
          rotation={[Math.PI / 2, 0, deltaRotation]}
        >
          {/* <PointCloud /> */}
          {/* 使 Svg 旋转，确保是绕中心旋转 */}
          <Svg
            src={process.env.NODE_ENV == 'development' ? '/assets/direction.svg' : '/assets/direction.svg'}
            position={[-12, 12, 0]}
            fillMaterial={
              {
                // color: "green",
              }
            }
          />
        </group>
        <animated.group position={groupProps.position as unknown as THREE.Vector3} rotation={[0, agvPosition.angel, 0]}>
          {agvType === 'SE15' ? <Fork15lift forkHeight={robotForkarmStatus.z} headerRadar={headRadar} /> : null}
          {agvType === 'SL14' ? <Sl14Model forkHeight={robotForkarmStatus.z} headerRadar={headRadar} /> : null}
          {agvType === 'X20' ? <X20Model forkHeight={robotForkarmStatus.z} headerRadar={headRadar} /> : null}
          {agvType === 'O15' ? <O15Model /> : null}
        </animated.group>
        {/* <group position={[agvPosition.x / 1000, 0.01, agvPosition.y / 1000]} rotation={[0, deltaRotation, 0]}>
          {agvType === 'SE15' ? <Fork15lift /> : null}
        </group> */}
        {/* <Html distanceFactor={20} position={[0, 3, 0]} center>
          121212
        </Html> */}
        {/* <mesh position={[0, 0, 0]}>
          <sphereGeometry />
          <meshStandardMaterial color="red" metalness={0.2} roughness={0.7} />
        </mesh> */}
        {/* 在车辆位置上添加一个点光源 */}
        {/* <group><BasePoint mapVertices={points} /></group> */}
      </group>
    </>
  );
};
export default Car;
