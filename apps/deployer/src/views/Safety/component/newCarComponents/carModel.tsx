import SafetyCoordinate from '@/components/InitStage/components/safetyCoordinate';
import { Layer, Rect } from 'react-konva';

const CarModel = () => {
  // 车体数据
  const carRects = [
    {
      id: 1,
      diagonalCoordinates: [
        { x: 200, y: -200 },
        { x: -200, y: -400 },
      ],
      associated_mechanism: 'BODY',
    },
    {
      id: 2,
      diagonalCoordinates: [
        { x: -150, y: 200 },
        { x: 150, y: -200 },
      ],
      associated_mechanism: 'FORKARM-LEFT',
    },
  ];

  // 将对角坐标转为 Konva.Rect 需要的格式
  const getRectFromDiagonal = (coords: { x: number; y: number }[]) => {
    const [p1, p2] = coords;
    const x = Math.min(p1.x, p2.x);
    const y = Math.min(p1.y, p2.y);
    const width = Math.abs(p1.x - p2.x);
    const height = Math.abs(p1.y - p2.y);
    return { x, y, width, height };
  };

  return (
    <Layer name='car'>
      {carRects.map((rect) => {
        const { x, y, width, height } = getRectFromDiagonal(rect.diagonalCoordinates);

        // 不同机制用不同颜色区分
        let fill = 'rgba(0,221,221,0.6)'; // 默认 BODY 青色
        if (rect.associated_mechanism === 'BODY') {
          fill = 'rgba(0,112,112,0.6)'; // 叉臂红色
        }

        return (
          <Rect
            key={rect.id}
            name={`car-${rect.associated_mechanism.toLowerCase()}`}
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
