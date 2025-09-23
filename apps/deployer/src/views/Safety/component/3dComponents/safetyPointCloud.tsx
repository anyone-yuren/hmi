import { useSafetyStore } from '@/views/Safety/store/safety.store';
import { memo, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { getProjectArea } from '../../utils/index';

const mockHeight = 668;

function SafetyPointCloud(props) {
  const { projectArea, forksUnderRect } = props;
  const { seniorPoints, forksHeight, sensorPoints } = useSafetyStore(
    useShallow((store) => ({
      seniorPoints: store.seniorPoints,
      forksHeight: store.forksHeight,
      sensorPoints: store.sensorPoints,
    })),
  );

  const [excludeOutsidePoints, setExcludeOutsidePoints] = useState(false);

  const forksUnderProjectArea: any = useMemo(() => {
    if (!forksUnderRect) return null;
    return getProjectArea(forksUnderRect, forksHeight);
  }, [forksUnderRect, forksHeight]);

  // const pointsData = useMemo(() => {
  //   const points: number[] = [];
  //   for (let i = 0; i < 15000; i++) {
  //     const x = (Math.random() - 0.5) * 4;
  //     const y = (Math.random() - 0.5) * 4;
  //     const z = Math.random() * 2;
  //     points.push(x, y, z);
  //   }
  //   return new Float32Array(points);
  // }, []);
  const pointsData = useMemo(() => {
    const points: any = [];
    const keys = Object.keys(sensorPoints);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      for (let oindex = 0; oindex < sensorPoints[key].length; oindex++) {
        const point = sensorPoints[key][oindex];
        points.push(point.x, point.y, point.z);
      }
    }
    return points;
  }, [sensorPoints]);

  useEffect(() => {
    console.log('查看点云', seniorPoints);
  }, [seniorPoints]);

  const isPointInRectangle = (point: THREE.Vector3, rectangle: number[]) => {
    const [x1, y1, x2, y2] = rectangle;
    const minX = Math.min(x1, x2) / 1000;
    const maxX = Math.max(x1, x2) / 1000;
    const minY = Math.min(y1, y2) / 1000;
    const maxY = Math.max(y1, y2) / 1000;
    return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
  };

  const geometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const colors: number[] = [];
    const filteredPoints: number[] = [];

    if (forksUnderProjectArea || projectArea.length > 0) {
      let box: THREE.Box3 | null = null;
      if (forksUnderProjectArea) {
        const size = new THREE.Vector3(
          forksUnderProjectArea.width,
          forksUnderProjectArea.height,
          forksUnderProjectArea.depth,
        );
        const center = new THREE.Vector3(
          forksUnderProjectArea.position[0],
          forksUnderProjectArea.position[1],
          forksUnderProjectArea.position[2],
        );
        box = new THREE.Box3().setFromCenterAndSize(center, size);
      }

      for (let i = 0; i < pointsData.length; i += 3) {
        const point = new THREE.Vector3(pointsData[i], pointsData[i + 1], pointsData[i + 2]);
        const isInsideBox = box ? box.containsPoint(point) : false;
        const isInsideRectangle = projectArea.some((area) => isPointInRectangle(point, area.rectangle));
        const isInside = isInsideBox || isInsideRectangle;
        if (!excludeOutsidePoints || isInside) {
          filteredPoints.push(point.x, point.y, point.z);
          const color = isInside ? new THREE.Color('red') : new THREE.Color('white');
          colors.push(color.r, color.g, color.b);
        }
      }
    } else {
      for (let i = 0; i < pointsData.length / 3; i++) {
        filteredPoints.push(pointsData[i * 3], pointsData[i * 3 + 1], pointsData[i * 3 + 2]);
        colors.push(1, 1, 1); // 白色
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(filteredPoints, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
  }, [pointsData, forksUnderProjectArea, projectArea, excludeOutsidePoints]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.08,
    });
  }, []);

  return (
    <>
      <points geometry={geometry} material={material} />
    </>
  );
}

export default memo(SafetyPointCloud);
