import { useMemo } from 'react';
import { useRcsGlobalStore } from '@gbeata/store';
import { useShallow } from 'zustand/react/shallow';

import { convertToMeters, FLOOR_HEIGHT } from '../utils';

const RenderReferencePoints = () => {
  const { referencePoints } = useRcsGlobalStore(
    useShallow((store) => {
      return {
        referencePoints: store.referencePoints,
      };
    }),
  );

  // 使用 Object.values() 获取对象中的所有值并遍历
  const renderPoint = useMemo(() => {
    return Object.entries(referencePoints).map(([key, item]) => {
      const { id, referencePoint } = item;
      // console.log('key', key);

      return (
        <group key={id}>
          <mesh
            position={[
              convertToMeters(referencePoint.x),
              0 + (key - 1) * FLOOR_HEIGHT,
              0 - convertToMeters(referencePoint.y),
            ]}
            scale={0.5}
          >
            <sphereGeometry />
            <meshStandardMaterial color='red' />
          </mesh>
        </group>
      );
    });
  }, [referencePoints]);

  return <>{renderPoint}</>;
};

export default RenderReferencePoints;
