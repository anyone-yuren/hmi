import { useRcsGlobalStore } from '@gbeata/store';
import { type FC, useMemo } from 'react';
import { CatmullRomCurve3, Vector3 } from 'three';
import { useShallow } from 'zustand/react/shallow';

import { useTheme } from 'antd-style';
import useMapData from '../hooks/useMapData';
import { convertToMeters } from '../utils';
import FlowingLine from './FlowingLine';
import MxwCar from './MxwCar';

const normalizeAngle = (angle: number) => {
  // return ((angle + 180) % 360) + 180; // 限制到 -180 到 180 范围
  return 0 - angle; // 限制到 -180 到 180 范围
};

interface IProps {
  // vehiclesList?: any[];
}

// const vertex = `
//      varying vec2 vUv;
//      varying vec3 vPosition;
//      void main(){
//            vUv = uv;
//            vPosition = position;
//            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
//            gl_Position = projectionMatrix * mvPosition;
//      }
// `;

// const fragment = /* glsl */ `
//     varying vec2 vUv;
//     uniform float uTime;
//     uniform sampler2D uFlowTexture;
//     uniform sampler2D uBgTexture;
//     void main( void ) {
//          vec2 position = vUv;
//          vec4 colorA = texture2D(uFlowTexture, vec2(vUv.x, fract(vUv.y - uTime)));
//          vec4 colorB = texture2D(uBgTexture, position.xy);
//          gl_FragColor = colorB + colorB * colorA;
//     }
// `;
const VehiclesList: FC<IProps> = () => {
  const token = useTheme();
  const { vehicleList, activeFloor } = useRcsGlobalStore(
    useShallow((store) => {
      return {
        vehicleList: store.vehicleList,
        activeFloor: store.activeFloor,
      };
    }),
  );
  const { getReferencePointPosition } = useMapData();

  // const [texture] = useMemo(() => {
  //   const tex = new TextureLoader().load('/static/textures/FlowTexture.png');
  //   return [tex];
  // }, []);

  // const [bgTexture] = useMemo(() => {
  //   const tex = new TextureLoader().load('/static/textures/GradationBlue.png');
  //   return [tex];
  // }, []);

  // // 创建ShaderMaterial
  // const lineMaterial = useMemo(() => {
  //   const mat = new ShaderMaterial({
  //     uniforms: {
  //       uTime: { value: 0 },
  //       uTexture: { value: texture },
  //       uBgTexture: { value: bgTexture },
  //     },
  //     side: DoubleSide, // 双面渲染
  //     transparent: true, // 透明度
  //     vertexShader: vertex,
  //     fragmentShader: fragment,
  //     depthTest: false,
  //     depthWrite: false,
  //   });
  //   return mat;
  // }, [texture]);

  // useFrame(() => {
  //   const elapsedTime = clock.getElapsedTime();
  //   lineMaterial.uniforms.uTime.value = elapsedTime;
  // });

  const devides = useMemo(() => {
    if (!vehicleList?.length) return null;

    return vehicleList.map((item) => {
      const normalizedAngle = normalizeAngle(item.angle); // 归一化角度
      const { floor, isHasGoods } = item;

      const SpacingCoordinates = getReferencePointPosition(0);
      const paths = item.tracks
        .filter((item) => !item.isVirtual)
        .map((route) => {
          const pathPoints = route.controlPoint.map(
            (point) =>
              new Vector3(
                convertToMeters(point.x - SpacingCoordinates.x),
                // 0.1 + (floor - 1) * FLOOR_HEIGHT,
                -0.01,
                convertToMeters(0 - point.y - SpacingCoordinates.y),
              ),
          );
          const curve = new CatmullRomCurve3(pathPoints, false); // 'centripetal' | 'chordal' | 'catmullrom'
          return curve;
        });
      return (
        <group key={item.vehicleId}>
          {paths.map((curve, index) => {
            const points = curve.getPoints(20);
            return (
              <FlowingLine key={index} points={points} />
              // <CubicBezierLine
              //   key={index}
              //   start={points[0]}
              //   end={points[points.length - 1]}
              //   midA={points[Math.floor(points.length / 2)]}
              //   midB={points[Math.floor(points.length / 2)]}
              //   points={points}
              //   color={token.colorWarningActive}
              //   lineWidth={4}
              //   dashed={false} // Default
              //   renderOrder={1}
              //   depthTest
              // />
              // <line key={index} geometry={new BufferGeometry().setFromPoints(curve.getPoints())} material={material} />
              // <Line
              //   key={index}
              //   points={curve.getPoints()}
              //   lineWidth={10}
              //   // vertexColors={new Array(curve.getPoints().length)
              //   //   .fill(0)
              //   //   .map(() => [Math.random() * 2, Math.random() * 2, Math.random() * 2])}
              // />
            );
          })}
          <MxwCar
            position={
              new Vector3(
                convertToMeters(item.x - SpacingCoordinates.x),
                // 0 + (floor - 1) * FLOOR_HEIGHT,
                0.02,
                convertToMeters(0 - item.y - SpacingCoordinates.y),
              )
            }
            rotationY={normalizedAngle}
            vechicleData={item}
            isHasGoods={isHasGoods}
          />
          {/* <X20Car
            position={
              new Vector3(
                convertToMeters(item.x - SpacingCoordinates.x),
                0 + (floor - 1) * FLOOR_HEIGHT,
                convertToMeters(0 - item.y - SpacingCoordinates.y),
              )
            }
            rotationY={normalizedAngle}
            vechicleData={item}
          /> */}
        </group>
      );
    });
  }, [vehicleList]);
  return devides;
};
export default VehiclesList;
