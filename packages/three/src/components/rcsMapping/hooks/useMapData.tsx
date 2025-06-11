import { useRcsGlobalStore } from '@gbeata/store';
import { useShallow } from 'zustand/react/shallow';

const useMapData = () => {
  const { referencePoints } = useRcsGlobalStore(
    useShallow((state) => {
      return {
        referencePoints: state.referencePoints,
      };
    }),
  );
  const getReferencePointPosition = (floor: number) => {
    if (floor === 1 || floor === 0 || !Object.values(referencePoints).length) {
      return { x: 0, y: 0, z: 0 };
    }
    const firstReferencePoint = referencePoints[1].referencePoint;
    const floorRreferencePoint = referencePoints[floor]?.referencePoint;
    return {
      x: floorRreferencePoint.x - firstReferencePoint.x,
      y: floorRreferencePoint.y - firstReferencePoint.y,
      z: floorRreferencePoint.z - firstReferencePoint.z,
    };
  };
  return {
    getReferencePointPosition,
  };
};
export default useMapData;
