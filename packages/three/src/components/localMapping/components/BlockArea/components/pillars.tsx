import { useMemo } from 'react';
import { DoubleSide, ExtrudeGeometry, MeshBasicMaterial, Shape } from 'three';
import useMapData from '../../../hooks/useMapData';
import { convertToMeters } from '../../../utils';
import LineText from '../../lineText';

type DrawWallProps = {
  coordinates: { x: number; y: number }[];
  floor?: number;
  color: number;
};
type Props = {
  mapDrawBlocks: DrawWallProps[];
  color?: string;
};
const DrawPillars = (props) => {
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
      // 拉伸出 10 米高的柱体（10米 = 10单位）
      const extrudeSettings = {
        steps: 1,
        depth: 1, // 高度
        bevelEnabled: false, // 斜角
      };
      const shapeGeometry = new ExtrudeGeometry(shape, extrudeSettings);
      const fillMaterial = new MeshBasicMaterial({
        color: 'gray',
        transparent: true,
        opacity: 0.1,
        depthWrite: false, // ✅ 避免遮挡透明物体
        side: DoubleSide,
      });
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
        <group key={index} position={[0, 0.1, 0]}>
          <mesh geometry={shapeGeometry} material={fillMaterial} rotation={[-Math.PI / 2, 0, 0]} />
          <LineText
            edgeId={areaName || '区域'}
            position={[center[0], 0.1, 0 - center[1]]}
            directionType={1}
            fontSize={0.5}
            color='red'
            material-transparent
            material-opacity={0.2} // 半透明
          />
        </group>
      );
    });
  }, [mapDrawBlocks]);

  return <>{drawArea}</>;
};
export default DrawPillars;
