import SafetyCoordinate from '@/components/InitStage/components/safetyCoordinate';
import { Layer, Rect } from 'react-konva';
import { getRect } from '../../utils';
import VehicleImg from './vehicleImg';

const CarModel = () => {
  // 车体数据
  const carRects = [
    {
      id: 1,
      diagonalCoordinates: [
        { x: 200, y: -100 },
        { x: -200, y: -400 },
      ],
      associated_mechanism: 'BODY',
    },
    {
      id: 2,
      diagonalCoordinates: [
        { x: -170, y: 400 },
        { x: 170, y: -100 },
      ],
      associated_mechanism: 'FORKARM-LEFT',
    },
  ];

  const rectangle_list = [
    {
      id: 1,
      name: 'head',
      rectangle: [500, 500, 0, -500],
      is_active: false,
      associated_device: 0,
    },
    {
      id: 2,
      name: 'forkarm',
      rectangle: [0, 300, -1000, -300],
      is_active: true,
      associated_device: 1,
    },
  ];

  return (
    <Layer name='car'>
      <VehicleImg />
      {rectangle_list?.map((rect) => {
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
