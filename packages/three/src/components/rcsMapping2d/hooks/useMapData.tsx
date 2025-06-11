import { useRcs2DGlobalStore } from '@gbeata/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';

const useMapData = () => {
  const { referencePoints, activeFloor } = useRcs2DGlobalStore(
    useShallow((state) => {
      return {
        referencePoints: state.referencePoints,
        activeFloor: state.activeFloor,
      };
    }),
  );
  const getReferencePointPosition = useCallback(
    (floor: number) => {
      if (activeFloor === -1) return { x: 0, y: 0, z: 0 };
      if (floor === 1 || floor === 0 || !Object.values(referencePoints).length) {
        return { x: 0, y: 0, z: 0 };
      }
      const firstReferencePoint = referencePoints[1].referencePoint;
      const floorRreferencePoint = referencePoints[floor]?.referencePoint;
      return {
        x: floorRreferencePoint?.x - firstReferencePoint?.x,
        y: floorRreferencePoint?.y - firstReferencePoint?.y,
        z: floorRreferencePoint?.z - firstReferencePoint?.z,
      };
    },
    [activeFloor],
  );
  return {
    getReferencePointPosition,
  };
};
export default useMapData;
