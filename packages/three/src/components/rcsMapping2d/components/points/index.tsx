import { useRcs2DGlobalStore } from '@gbeata/store';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import BasePoint from './basePoints';
import ChargePoint from './chargePoints';
import HomePoint from './homePoint';
import WarehousePoint from './warehousePoint';

interface IMapPointsProps {
  mapVertices: IMapPoints[];
  floor: number;
}

const RenderPoints = (props: IMapPointsProps) => {
  const { mapVertices, floor } = props;
  const [storagePoints, setStoragePoints] = useState<any>([]);
  const { mapFunctionKeys, wssLocationStateHashMap } = useRcs2DGlobalStore(
    useShallow((state) => ({
      mapFunctionKeys: state.mapFunctionKeys,
      wssLocationStateHashMap: state.wssLocationStateHashMap,
    })),
  );
  // 根据属性生成不同的点位数据。
  // const warehousePoints = mapVertices
  //   .filter((item) => item.floor === floor)
  //   .filter((item) => item.vertexType === 4 || item.vertexType === 1);
  const homePoints = mapVertices
    .filter((item) => (floor === -1 ? true : item.floor === floor))
    .filter((item) => item.vertexType === 2);
  const chargePoints = mapVertices
    .filter((item) => (floor === -1 ? true : item.floor === floor))
    .filter((item) => item.vertexType === 6);
  const basePoints = mapVertices
    .filter((item) => (floor === -1 ? true : item.floor === floor))
    .filter((item) => item.vertexType === 0);

  useEffect(() => {
    const warehousePoints: any = mapVertices
      .filter((item) => (floor === -1 ? true : item.floor === floor))
      .filter((item) => item.vertexType === 4 || item.vertexType === 1);
    setStoragePoints(warehousePoints);
  }, [mapVertices, floor]);

  useEffect(() => {
    if (!storagePoints.length) return;
    const points: any = [];
    for (let index = 0; index < storagePoints.length; index++) {
      const obj: any = { ...storagePoints[index] };
      const key = obj?.pointId;
      wssLocationStateHashMap[key] && (obj.state = wssLocationStateHashMap[key].state);
      points.push(obj);
    }
    setStoragePoints(points);
  }, [wssLocationStateHashMap]);

  return (
    <>
      {mapFunctionKeys.includes('storage_points') && <WarehousePoint mapVertices={storagePoints} />}
      <HomePoint mapVertices={homePoints} />
      <ChargePoint mapVertices={chargePoints} />
      {mapFunctionKeys.includes('common_points') && <BasePoint mapVertices={basePoints} />}
      {/* <BasePoint mapVertices={basePoints} /> */}
    </>
  );
};

export default RenderPoints;
