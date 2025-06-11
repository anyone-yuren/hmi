import { Box, Plane } from '@react-three/drei';
import { Suspense, useMemo } from 'react';

import useMapData from '../../hooks/useMapData';
import { convertToMeters, FLOOR_HEIGHT } from '../../utils';

interface Props {
  equipmentPoints: { name: string; angle: number; x: number; y: number }[];
}
const Elevator = (prop: Props) => {
  if (!prop.equipmentPoints.length) return null;
  // const { nodes } = suspend(async () => useGLTF('/models/elevator.glb'));
  // const { nodes } = useGLTF('/models/elevator.glb');
  const nodes = [];

  const { equipmentPoints } = prop;

  const { getReferencePointPosition } = useMapData();

  const renderElevator = useMemo(() => {
    if (!equipmentPoints) return null;
    return equipmentPoints.map((elevator, i) => {
      const { floor = 1, angle, x, y } = elevator;
      const SpacingCoordinates = getReferencePointPosition(floor);
      // 将角度转换为弧度
      const angleInRadians = (angle - 90) * (Math.PI / 180);
      return (
        <group
          receiveShadow
          castShadow
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
          <Box args={[3, 12, 3]} position={[0, 6, 0]} receiveShadow castShadow>
            <meshStandardMaterial color='#224caf' opacity={0.5} transparent />
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
          {/* {floor !== 1 ? (
            <Box args={[3, 7, 3]} position={[0, -4, 0]}>
              <meshStandardMaterial color='white' />
            </Box>
          ) : null} */}
        </group>
      );
    });
  }, [equipmentPoints, nodes]);

  return (
    <Suspense>
      {renderElevator}
      {/* <Html>{renderElevator}</Html> */}
    </Suspense>
  );
};

export default Elevator;
