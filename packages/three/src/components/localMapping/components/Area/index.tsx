import { CatmullRomLine } from '@react-three/drei';
import { useMemo } from 'react';
import { LineBasicMaterial } from 'three';

import useMapData from '../../hooks/useMapData';
import { convertToMeters } from '../../utils';
import LineText from '../lineText';
// 绘制区域
const Area = ({ mapDrawBlocks }) => {
  const { getReferencePointPosition } = useMapData();
  // 创建边框线条
  const lineMeterial = useMemo(() => {
    return new LineBasicMaterial({
      color: 'blue',
      linewidth: 10,
    });
  }, []);
  // 绘制区域
  const drawArea = useMemo(() => {
    if (!mapDrawBlocks?.length) {
      return null;
    }
    // return <Box material-color='hotpink' position={[0, 0, 0]} scale={10} />;
    return mapDrawBlocks.map((item, index) => {
      const { blockName, floor, mapBlockCoordinates } = item;
      const floorState = floor ? floor - 1 : 0;
      const SpacingCoordinates = getReferencePointPosition(floor);
      const points = mapBlockCoordinates.map((data) => {
        const { x, y } = data;
        return [
          convertToMeters(x - SpacingCoordinates.x),
          // floorState * FLOOR_HEIGHT + 0.1,
          0.1,
          convertToMeters(0 - y - SpacingCoordinates.y),
        ];
      });
      // const converPoints = convertListTo2DArray(points);

      return (
        <>
          <CatmullRomLine
            key={index}
            curveType='centripetal'
            points={points}
            lineWidth={1}
            tension={1}
            segments={points.length}
            color='yellow'
            closed
          />
          {/* <HtmlPanel text={'存储区'} position={points[0]} /> */}
          <LineText edgeId={'存储区'} position={points[0]} directionType={1} fontSize={1} color='white' />
          {/* <line geometry={new BufferGeometry().setFromPoints(points)} material={lineMeterial} /> */}
        </>
      );
    });
  }, [mapDrawBlocks]);

  return <>{drawArea}</>;
};

export default Area;
