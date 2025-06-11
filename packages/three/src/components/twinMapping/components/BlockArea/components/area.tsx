import { useMemo } from 'react';
import { Vector3 } from 'three';

import useMapData from '../../../hooks/useMapData';
import { convertToMeters } from '../../../utils';
import LineText from '../../lineText';
import DynamicLine from './DynamicLine';
// 绘制区域
const Area = ({ mapDrawBlocks }) => {
  const { getReferencePointPosition } = useMapData();
  // 绘制区域
  const drawArea = useMemo(() => {
    if (!mapDrawBlocks?.length) {
      return null;
    }
    // return <Box material-color='hotpink' position={[0, 0, 0]} scale={10} />;
    return mapDrawBlocks.map((item, index) => {
      const { areaName, floor, coordinates } = item;
      const floorState = floor ? floor - 1 : 0;
      const SpacingCoordinates = getReferencePointPosition(0);
      const points = coordinates.map(({ x, y }) => {
        return [convertToMeters(x - SpacingCoordinates.x), convertToMeters(0 - y - SpacingCoordinates.y)];
      });

      // 生成边框线
      const linePoints = points.map(([x, y]) => new Vector3(x, 0.01, y));
      linePoints.push(linePoints[0]); // 闭合
      // const converPoints = convertListTo2DArray(points);
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
        <>
          {/* 黄色边框 */}
          <DynamicLine points={linePoints} key={index} color='yellow' />
          {/* <HtmlPanel text={'存储区'} position={points[0]} /> */}
          <LineText
            edgeId={areaName || '区域'}
            position={[center[0], -0.1, center[1]]}
            directionType={1}
            fontSize={1}
            color='red'
            material-transparent
            material-opacity={0.2} // 半透明
          />
        </>
      );
    });
  }, [mapDrawBlocks]);

  return <>{drawArea}</>;
};

export default Area;
