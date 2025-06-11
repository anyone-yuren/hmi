import { Box, Html, Plane, useGLTF } from '@react-three/drei';
import { Suspense, useMemo } from 'react';

import useMapData from '../../hooks/useMapData';
import { convertToMeters, FLOOR_HEIGHT } from '../../utils';

interface Props {
  equipmentPoints: { name: string; angle: number; x: number; y: number }[];
  floor: number;
}
const Elevator = (prop: Props) => {
  if (!prop.equipmentPoints.length) return null;
  // const { nodes } = suspend(async () => useGLTF('/models/elevator.glb'));
  // const { nodes } = useGLTF('/models/elevator.glb');
  const nodes = [];

  const { equipmentPoints, floor: nowFloor } = prop;

  const { getReferencePointPosition } = useMapData();

  const renderElevator = useMemo(() => {
    if (!equipmentPoints) return null;
    return equipmentPoints
      .filter((item: any) => item.floor === nowFloor)
      .map((elevator, i) => {
        const { floor = 1, angle, x, y } = elevator;
        const SpacingCoordinates = getReferencePointPosition(floor);
        // 将角度转换为弧度
        const angleInRadians = (angle - 90) * (Math.PI / 180);
        return (
          <group
            key={elevator.name}
            position={[
              convertToMeters(x - SpacingCoordinates.x),
              (floor - 1) * FLOOR_HEIGHT,
              0 - convertToMeters(y - SpacingCoordinates.y),
            ]}
            rotation={[0, angleInRadians, 0]}
            scale={[0.8, 0.8, 0.8]}
            dispose={null}
          >
            {/* 电梯框架 */}
            <Box args={[3, 5, 3]} position={[0, 2.5, 0]}>
              <meshStandardMaterial color='gray' transparent opacity={0.7} />
            </Box>

            {/* 电梯地板 */}
            <Plane args={[3, 3]} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color='lightgray' />
            </Plane>

            {/* 电梯顶部 */}
            <Plane args={[3, 3]} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color='lightgray' />
            </Plane>

            {/* 电梯门 */}
            <group position={[-1.5, 2.5, 1.51]}>
              {/* 左门 */}
              <Box args={[1.5, 5, 0.1]}>
                <meshStandardMaterial color='silver' />
              </Box>
              {/* 右门 */}
              <Box args={[1.5, 5, 0.1]} position={[3, 0, 0]}>
                <meshStandardMaterial color='silver' />
              </Box>
            </group>
          </group>
        );
      });
  }, [equipmentPoints, nodes, nowFloor]);

  return (
    <Suspense>
      {renderElevator}
      {/* <Html>{renderElevator}</Html> */}
    </Suspense>
  );
};

export default Elevator;
