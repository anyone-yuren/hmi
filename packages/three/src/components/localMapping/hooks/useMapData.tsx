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

  // 根据layer 设置货架高度
  const getShelfHeight = (layer: number) => {
    if (layer === 1 || layer === 0) {
      return 0;
    }
    return (layer - 1) * 1 + 0.1;
  };
  return {
    getReferencePointPosition,
    getShelfHeight,
  };
};
export default useMapData;
