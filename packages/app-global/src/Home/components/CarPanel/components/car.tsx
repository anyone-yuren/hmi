// import { useHybirdStore } from '@/components/Pages/Hybrid/store/hybird.store';
import { Svg, useHelper } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import { PointLightHelper, type DirectionalLight } from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useHomeHybirdStore } from '../../../store/hybird';
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

  const { agvPosition } = useHomeHybirdStore(
    useShallow((state) => ({
      agvPosition: state.agvPosition,
    })),
  );

  const directionalLightRef = useRef<DirectionalLight>(null!);
  useHelper(directionalLightRef, PointLightHelper, 2);

  // const points = useMemo(() => {
  //   if (!segments_info.length) return [];
  //   const attr = [];
  //   segments_info?.map((route) => {
  //     const startPoint = route.start_point;
  //     const endPoint = route.end_point;
  //     attr.push(startPoint);
  //     attr.push(endPoint);
  //   });
  //   // 对attr去重

  //   return Array.from(new Map(attr.map((item) => [item.id, item])).values());
  // }, [segments_info]);

  const calculateShortestAngle = (target: number): number => {
    const delta = ((target + 180) % 360) - 180;
    return delta;
  };
  // 计算目标角度与当前角度之间的最短路径
  const deltaRotation = useMemo(
    () => calculateShortestAngle(agvPosition.angel - 0.6), // 没有任何依据的0.6，只是图标精度的调整
    [agvPosition.angel],
  );

  // 将角度变化转为弧度

  return (
    <>
      <pointLight
        // ref={directionalLightRef}
        position={[agvPosition.x / 1000, 0, agvPosition.y / 1000]} // 设置光源的位置与车辆同步
        color={'#00D1D1'} // 光源颜色
        castShadow={true} // 启用阴影投射
      />
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
