import SafetyCoordinate from '@/components/InitStage/components/safetyCoordinate';
import { useMemo } from 'react';
import { Layer, Rect } from 'react-konva';
import { getRect } from '../../utils';
import VehicleImg from './vehicleImg';
interface IProps {
  vehicleOutline: {
    rectangle_list: any[];
  };
}

const CarModel = (props: IProps) => {
  const { vehicleOutline } = props;
  const rectangle_list = useMemo(() => {
    return vehicleOutline?.rectangle_list || [];
  }, [vehicleOutline]);

  return (
    <Layer name='car'>
      {rectangle_list?.length ? <VehicleImg rectangleList={rectangle_list} /> : null}
      {rectangle_list?.map((rect) => {
        const [a, b, c, d] = rect.rectangle;
        const { x, y, width, height } = getRect(rect.rectangle);
        // 不同机制用不同颜色区分
        let fill = 'rgba(0,188,212,0.4)'; // 默认 BODY 青色
        if (rect.name === 'forkarm') {
          fill = 'rgba(0,188,212,0.6)'; // 叉臂红色
        }

        return (
          <Rect
            key={rect.id}
            name={`car-${rect.name.toLowerCase()}`}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fill}
          />
        );
      })}
      <SafetyCoordinate />
    </Layer>
  );
};

export default CarModel;
