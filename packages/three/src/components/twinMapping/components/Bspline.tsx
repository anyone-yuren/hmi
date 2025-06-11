import { useTheme } from 'antd-style';
import { useMemo } from 'react';
import {
  BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  LineBasicMaterial,
  MeshBasicMaterial,
  Shape,
  Vector3,
} from 'three';

import useMapData from '../hooks/useMapData';
import { convertToMeters, FLOOR_HEIGHT } from '../utils';
import ArrowsAndText from './arrowsAndText';

interface IRouteLineProps {
  mapEdges: IMapEdges[];
}

const createArrowGeometry = () => {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.1, 0.2);
  shape.lineTo(-0.1, 0.2);
  shape.closePath();

  return new ExtrudeGeometry(shape, { depth: 0.001, bevelEnabled: false });
};

const Bspline = ({ mapEdges }: IRouteLineProps) => {
  const token = useTheme();
  if (!mapEdges) return null;
  const { getReferencePointPosition } = useMapData();
  console.log(token);

  // 共享材质，区分前进和后退的箭头颜色
  const sharedMaterials = useMemo(
    () => ({
      forward: new LineBasicMaterial({ color: token.colorBorder }), // 绿色线段
      backward: new LineBasicMaterial({ color: token.colorBorder }), // 灰色线段
      forwardArrow: new MeshBasicMaterial({ color: 0x00ff00 }), // 绿色箭头
      backwardArrow: new MeshBasicMaterial({ color: 0xa8a8a8 }), // 灰色箭头
    }),
    [],
  );

  // 计算曲线
  const curves = useMemo(() => {
    return (
      mapEdges
        // .filter((edge) => !edge.isVirtual) // 电梯连接线
        .map((edge) => {
          const floor = 0;
          const SpacingCoordinates = getReferencePointPosition(0);
          // const floor = edge?.floor ? edge?.floor - 1 : 0;
          // const SpacingCoordinates = getReferencePointPosition(edge.floor);

          const controlPoints = edge.controlPoint.map((point) => {
            // const position = [convertToMeters(item.x), 0, convertToMeters(item.y)];
            const position = new Vector3(
              convertToMeters(point.x - SpacingCoordinates.x),
              floor * FLOOR_HEIGHT + 0.025,
              convertToMeters(0 - point.y - SpacingCoordinates.y),
            );
            return position;
          });
          const curve = new CatmullRomCurve3(controlPoints);
          return { curve, edgeId: edge.edgeId, directionType: edge.directionType, floor };
        })
    );
  }, [mapEdges]);
  // 预创建箭头几何体
  const arrowGeometry = useMemo(() => createArrowGeometry(), []);

  // 预创建箭头材质（优化：避免重复创建材质）
  const lines = useMemo(() => {
    return curves.map(({ curve, edgeId, directionType, floor }, index) => {
      const points = curve.getPoints(20);
      const geometry = new BufferGeometry().setFromPoints(points);
      const material = directionType === 1 ? sharedMaterials.forward : sharedMaterials.backward;
      return (
        <group key={index}>
          <line geometry={geometry} material={material} />
        </group>
      );
    });
  }, [curves, sharedMaterials, arrowGeometry]);

  return (
    <>
      {lines}
      <ArrowsAndText mapEdges={mapEdges} />
    </>
  );
};

export default Bspline;
