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
import { convertToMeters } from '../utils';
import ActiveLine from './ActiveLine';
import ArrowsAndText from './arrowsAndText';

interface IRouteLineProps {
  mapEdges: IMapEdges[];
  floor: number;
}

const createArrowGeometry = () => {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.1, 0.2);
  shape.lineTo(-0.1, 0.2);
  shape.closePath();

  return new ExtrudeGeometry(shape, { depth: 0.001, bevelEnabled: false });
};

const Bspline = ({ mapEdges, floor }: IRouteLineProps) => {
  if (!mapEdges) return null;
  const { getReferencePointPosition } = useMapData();
  // 共享材质，区分前进和后退的箭头颜色
  const sharedMaterials = useMemo(
    () => ({
      // forward: new LineBasicMaterial({ color: 0x00ff00 }), // 绿色线段
      forward: new LineBasicMaterial({ color: 0xa8a8a8 }), // 绿色线段
      backward: new LineBasicMaterial({ color: 0xa8a8a8 }), // 灰色线段
      forwardArrow: new MeshBasicMaterial({ color: 0x00ff00 }), // 绿色箭头
      backwardArrow: new MeshBasicMaterial({ color: 0xa8a8a8 }), // 灰色箭头
    }),
    [],
  );

  // 计算曲线
  const curves = useMemo(() => {
    return mapEdges
      .filter((edge) => (floor === -1 ? true : edge.floor === floor))
      .filter((edge) => (floor === -1 ? true : !edge.isVirtual))
      .map((edge) => {
        const edgeFloor = edge?.floor ? edge.floor - 1 : 0;
        const SpacingCoordinates = getReferencePointPosition(edge.floor);

        const controlPoints = edge.controlPoint.map((point) => {
          // const position = [convertToMeters(item.x), 0, convertToMeters(item.y)];
          const position = new Vector3(
            convertToMeters(point.x - SpacingCoordinates.x),
            0.025,
            convertToMeters(0 - point.y - SpacingCoordinates.y),
          );
          // const position = new Vector3(
          //   convertToMeters(point.x - SpacingCoordinates.x),
          //   edgeFloor * FLOOR_HEIGHT + 0.025,
          //   convertToMeters(0 - point.y - SpacingCoordinates.y),
          // );
          return position;
        });
        const curve = new CatmullRomCurve3(controlPoints);
        return { curve, edgeId: edge.edgeId, directionType: edge.directionType, floor: edgeFloor };
      });
  }, [mapEdges, floor]);
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
      <ArrowsAndText mapEdges={mapEdges.filter((edge) => (floor === -1 ? true : edge.floor === floor))} />
      <ActiveLine />
    </>
  );
};

export default Bspline;
