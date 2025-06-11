import { useRcs2DGlobalStore } from '@gbeata/store';
import { Line } from '@react-three/drei';
import { type FC, useMemo } from 'react';
import { CatmullRomCurve3, Vector3 } from 'three';
import { useShallow } from 'zustand/react/shallow';

import useMapData from '../hooks/useMapData';
import { convertToMeters, FLOOR_HEIGHT } from '../utils';
import MxwCar from './MxwCar';

const normalizeAngle = (angle: number) => {
  return 0 - angle; // 限制到 -180 到 180 范围
};

interface IProps {}
const VehiclesList: FC<IProps> = () => {
  const { vehicleList, activeFloor } = useRcs2DGlobalStore(
    useShallow((store) => {
      return {
        vehicleList: store.vehicleList,
        activeFloor: store.activeFloor,
      };
    }),
  );
  const { getReferencePointPosition } = useMapData();

  const lineColorHashMap = {
    3: '#00abc7',
    4: 'yellow',
    6: 'red',
  };

  const devices = useMemo(() => {
    if (!vehicleList?.length) return null;
    return vehicleList
      .filter((item) => {
        return activeFloor === -1 ? true : item.floor === activeFloor;
      })
      .map((item) => {
        const normalizedAngle = normalizeAngle(item.angle); // 归一化角度
        const { floor } = item;
        const SpacingCoordinates = getReferencePointPosition(floor);
        const paths = item.tracks
          .filter((items: any) => !items.isVirtual)
          .map((route) => {
            const pathPoints = route.controlPoint.map(
              (point) =>
                new Vector3(
                  convertToMeters(point.x - SpacingCoordinates.x),
                  0.01 + (floor - 1) * FLOOR_HEIGHT,
                  convertToMeters(0 - point.y - SpacingCoordinates.y),
                ),
            );
            const curve = new CatmullRomCurve3(pathPoints, false); // 'centripetal' | 'chordal' | 'catmullrom'
            return { curve, state: route.state };
          });

        return (
          <group key={item.vehicleId}>
            {paths.map((curve, index) => {
              return (
                <Line
                  key={index}
                  points={curve?.curve?.getPoints()}
                  lineWidth={10}
                  color={lineColorHashMap[curve.state]}
                  // vertexColors={new Array(curve.getPoints().length)
                  //   .fill(0)
                  //   .map(() => [Math.random() * 2, Math.random() * 2, Math.random() * 2])}
                />
              );
            })}
            {item && (
              <MxwCar
                position={
                  new Vector3(
                    convertToMeters(item.x - SpacingCoordinates.x),
                    0.01 + (floor - 1) * FLOOR_HEIGHT,
                    convertToMeters(0 - item.y - SpacingCoordinates.y),
                  )
                }
                rotationY={normalizedAngle}
                vehicleData={item}
              />
            )}
          </group>
        );
      });
  }, [vehicleList]);
  return devices;
};
export default VehiclesList;
