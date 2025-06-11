import { useRcsGlobalStore } from '@gbeata/store';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

const GoodsLocation = ({ geometry, material, pointId, state }) => {
  const { hasGoodLocations } = useRcsGlobalStore(
    useShallow((store) => {
      return {
        hasGoodLocations: store.hasGoodLocations,
      };
    }),
  );
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    if (hasGoodLocations) {
      setIsShow(hasGoodLocations[pointId]?.state === 1);
    } else {
      setIsShow(state === 1);
    }
  }, [hasGoodLocations, state]);

  return <>{isShow ? <mesh geometry={geometry} material={material} castShadow receiveShadow /> : null}</>;
};

export default GoodsLocation;
