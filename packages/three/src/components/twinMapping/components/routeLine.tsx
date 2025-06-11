// 通过数据mapEdges绘制整个地图的线路
import React from 'react';
import { BufferGeometry, Float32BufferAttribute, LineBasicMaterial } from 'three';

import { convertToMeters } from '../utils';

interface IRouteLineProps {
  mapEdges: IMapEdges[];
}
const RouterLine = (props: IRouteLineProps) => {
  const { mapEdges } = props;
  if (!mapEdges) {
    return null;
  }
  // 存放所有线段的顶点数据
  const positions: number[] = [];

  // 遍历mapEdges
  mapEdges.forEach((edge) => {
    const points: ControlPoint[] = edge.controlPoint;
    // 遍历控制点冰箱每两个相邻的点连成一条线
    for (let i = 0; i < points.length - 1; i += 1) {
      const startPoint = points[i];
      const endPoint = points[i + 1];
      positions.push(convertToMeters(startPoint.x), 0, convertToMeters(startPoint.y));
      positions.push(convertToMeters(endPoint.x), 0, convertToMeters(endPoint.y));
    }
  });

  // 创建几何体
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

  // 创建材质
  const material = new LineBasicMaterial({ color: 0x00ff00 });
  return (
    <>
      <lineSegments geometry={geometry} material={material} />
    </>
  );
};

export default RouterLine;
