import { useMemo } from 'react';
import { MeshBasicMaterial, Shape, ShapeGeometry, Vector3 } from 'three';
import useMapData from '../../../hooks/useMapData';
import { convertToMeters } from '../../../utils';
import LineText from '../../lineText';
import DynamicLine from './DynamicLine';

type DrawWallProps = {
  coordinates: { x: number; y: number }[];
  floor?: number;
  color: number;
};
type Props = {
  mapDrawBlocks: DrawWallProps[];
  color?: string;
};
const DrawRoadWay = (props) => {
  const { mapDrawBlocks, color } = props;
  if (mapDrawBlocks.length === 0) return;
  const { getReferencePointPosition } = useMapData();
  const drawArea = useMemo(() => {
    if (!mapDrawBlocks?.length) return null;

    return mapDrawBlocks.map((item, index) => {
      const { areaName, floor, coordinates } = item;
      const floorState = floor ? floor - 1 : 0;
      const SpacingCoordinates = getReferencePointPosition(0);

      const points = coordinates.map(({ x, y }) => {
        return [convertToMeters(x - SpacingCoordinates.x), convertToMeters(y - SpacingCoordinates.y)];
      });

      // 创建 Shape
      const shape = new Shape();
      points.forEach(([x, y], i) => {
        if (i === 0) shape.moveTo(x, y);
        else shape.lineTo(x, y);
      });
      shape.closePath();

      const shapeGeometry = new ShapeGeometry(shape);
      const fillMaterial = new MeshBasicMaterial({
        color: 'green',
        transparent: true,
        opacity: 0.5,
        // side: 2,
        depthWrite: true,
      });

      // 生成边框线
      const linePoints = points.map(([x, y]) => new Vector3(x, 0.01, 0 - y));
      linePoints.push(linePoints[0]); // 闭合
      // 计算中心点
      const center = points
        .reduce(
          (acc, [x, y]) => {
            acc[0] += x;
            acc[1] += y;
            return acc;
          },
          [0, 0],
        )
        .map((val) => val / points.length);
      return (
        <group key={index} position={[0, 0.2, 0]}>
          <mesh geometry={shapeGeometry} material={fillMaterial} rotation={[-Math.PI / 2, 0, 0]} />
          {/* 黄色边框 */}
          <DynamicLine points={linePoints} key={index} color='yellow' />
          <LineText
            edgeId={areaName || '区域'}
            position={[center[0], 0.01, 0 - center[1]]}
            directionType={1}
            fontSize={1}
            color='white'
          />
        </group>
      );
    });
  }, [mapDrawBlocks]);

  return <>{drawArea}</>;
};
export default DrawRoadWay;
