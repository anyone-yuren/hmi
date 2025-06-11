import { useRcsGlobalStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { v1MapGetMapDataCreate } from 'apis';
import { useShallow } from 'zustand/react/shallow';

import MapCanvas from './components/MapCanvas';

interface IProps {
  vehiclesList?: any[];
}
const MapVisualization = (props: IProps) => {
  const { setReferencePoints } = useRcsGlobalStore(
    useShallow((state) => ({
      setReferencePoints: state.setReferencePoints,
      // setMapData: state.setMapData,
      // mapData: state.mapData,
    })),
  );
  const { data: mappingData } = useRequest(v1MapGetMapDataCreate, {
    onSuccess: (res) => {
      setReferencePoints(res?.referencePoints || []);
      // setMapData(res);
    },
  });

  // 如果没有数据，渲染占位符

  return mappingData ? <MapCanvas mappingData={mappingData} /> : <>1111</>;
  // return mapData ? <MapCanvas mappingData={mapData} vehiclesList={vehiclesList} /> : <>1111</>;
};

export default MapVisualization;
