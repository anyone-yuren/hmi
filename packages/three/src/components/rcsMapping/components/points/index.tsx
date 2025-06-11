import { useMemo } from 'react';

import BasePoint from './basePoints';
import ChargePoint from './chargePoints';
import HomePoint from './homePoint';
import WarehousePoint from './warehousePoint';

interface IMapPointsProps {
  mapVertices: IMapPoints[];
}
const RenderPoints = (props: IMapPointsProps) => {
  const { mapVertices } = props;
  // 根据属性生成不同的点位数据。
  const warehousePoints = useMemo(
    () => mapVertices.filter((item) => item.vertexType === 4 || item.vertexType === 1),
    [],
  );
  const homePoints = useMemo(() => mapVertices.filter((item) => item.vertexTypes.includes(2)), []);
  const chargePoints = useMemo(() => mapVertices.filter((item) => item.vertexTypes.includes(6)), []);
  const basePoints = mapVertices.filter((item) => item.vertexTypes.includes(0) && item.vertexTypes.length === 1);

  return (
    <>
      <WarehousePoint mapVertices={warehousePoints} />
      {/* <HomePoint mapVertices={homePoints} /> */}
      {/* <ChargePoint mapVertices={chargePoints} /> */}
      {/* <BasePoint mapVertices={basePoints} /> */}
    </>
  );
};

export default RenderPoints;
