import { useRcsGlobalStore } from '@gbeata/store';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

const GoodsLocation = ({ geometry, material, pointId, state, points = [] }) => {
  const { hasGoodLocations } = useRcsGlobalStore(
    useShallow((store) => {
      return {
        hasGoodLocations: store.hasGoodLocations,
      };
    }),
  );

  function findFirstExistingKey(keys, obj) {
    return keys.find((key) => key in obj);
  }

  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    if (Object.keys(hasGoodLocations).length) {
      const foundKey = findFirstExistingKey(points, hasGoodLocations);
      const location = foundKey ? hasGoodLocations[foundKey] : null;
      setIsShow(location?.state === 1 && location?.locationCode === pointId);
    } else {
      setIsShow(state !== 0);
    }
  }, [hasGoodLocations, state, points]);

  return <>{isShow ? <mesh geometry={geometry} material={material} castShadow receiveShadow /> : null}</>;
};

export default GoodsLocation;
