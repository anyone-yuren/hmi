import { Spin } from 'antd';
import { memo } from 'react';
import MapCanvas from './components/MapCanvas';
interface IProps {
  vehiclesList?: any[];
  mappingData?: any;
}
const MapVisualization = (props: IProps) => {
  const { mappingData } = props;

  // 如果没有数据，渲染占位符

  return mappingData ? (
    <MapCanvas mappingData={mappingData} />
  ) : (
    // <CustomStage mappingData={mappingData} />
    <Spin className='flex justify-center items-center w-full h-full'></Spin>
  );
  // return mapData ? <MapCanvas mappingData={mapData} vehiclesList={vehiclesList} /> : <>1111</>;
};

export default memo(MapVisualization);
