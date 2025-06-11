import { useFrame, useThree } from '@react-three/fiber';
import { equals, map } from 'ramda';
import { useMemo, useState } from 'react';
import { CatmullRomCurve3, ExtrudeGeometry, MeshBasicMaterial, Shape, Vector3 } from 'three';

import useMapData from '../hooks/useMapData';
import { convertToMeters, ElementDisplayDistance, FLOOR_HEIGHT } from '../utils';

interface IRouteLineProps {
  mapEdges: IMapEdges[];
}

const createArrowGeometry = () => {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.03, 0.06);
  shape.lineTo(-0.03, 0.06);
  shape.closePath();

  return new ExtrudeGeometry(shape, { depth: 0.001, bevelEnabled: false });
};

const ArrowsAndText = ({ mapEdges }: IRouteLineProps) => {
  if (!mapEdges) return null;
  const { getReferencePointPosition } = useMapData();
  // 共享材质，区分前进和后退的箭头颜色
  const sharedMaterials = useMemo(
    () => ({
      forwardArrow: new MeshBasicMaterial({ color: 0x00ff00 }), // 绿色箭头
      backwardArrow: new MeshBasicMaterial({ color: 0xa8a8a8 }), // 灰色箭头
    }),
    [],
  );

  const { camera } = useThree();
  const [cameraPosition, setCameraPosition] = useState([0, 0, 0]); // 初始化相机位置

  useFrame(() => {
    // 只有相机位置发生变化时，才更新状态
    const newPosition = map(Math.trunc, camera.position.clone());
    // 取整newPosition所有值

    if (!equals(newPosition, cameraPosition)) {
      setCameraPosition(newPosition);
    }
  });

  // 计算曲线
  const curves = useMemo(() => {
    return (
      mapEdges
        // .filter((edge) => !edge.isVirtual) // 禁用楼层虚拟线
        .map((edge) => {
          // const floor = edge?.floor ? edge?.floor - 1 : 0;
          const floor = 0;
          // const SpacingCoordinates = getReferencePointPosition(edge.floor);
          const SpacingCoordinates = getReferencePointPosition(0);
          const destance = new Vector3(
            convertToMeters(edge.controlPoint[0].x - SpacingCoordinates.x),
            floor * FLOOR_HEIGHT,
            0 - convertToMeters(edge.controlPoint[0].y - SpacingCoordinates.y),
          ).distanceTo(new Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z));
          if (destance > ElementDisplayDistance.lineDisplayDistance) return {};

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
        .filter((item) => item.curve)
    );
  }, [mapEdges, cameraPosition]);

  // 预创建箭头几何体
  const arrowGeometry = useMemo(() => createArrowGeometry(), []);

  // 预创建箭头材质（优化：避免重复创建材质）
  const forwardArrowMaterial = useMemo(() => sharedMaterials.forwardArrow.clone(), [sharedMaterials.forwardArrow]);
  const backwardArrowMaterial = useMemo(() => sharedMaterials.backwardArrow.clone(), [sharedMaterials.backwardArrow]);

  const arrowsAndText = useMemo(() => {
    return curves.map(({ curve, edgeId, directionType, floor }, index) => {
      const points = curve.getPoints(20);
      const arrowMaterial = directionType === 1 ? forwardArrowMaterial : backwardArrowMaterial;
      // 计算中点位置（用于放置编号）
      const midPoint = points[directionType === 1 ? Math.floor(points.length / 2) : Math.floor(points.length / 4)];
      const firstPoint = points[0];
      const lastPoint = points[points.length - 1];

      const direction = lastPoint.clone().sub(firstPoint).normalize();
      let rotationY = Math.atan2(direction.x, direction.z); // 计算朝向
      let rotateZ = 0;
      // 处理箭头方向，确保箭头朝向正确的负Z方向
      if (Math.ceil(Math.abs(direction.z)) === 1) {
        rotateZ = Math.PI; // 如果方向是沿着 Z 轴的负方向
        if (direction.z > 0) {
          rotateZ = 0; // 如果方向是沿着 Z 轴的负方向
        }
      }
      if (Math.ceil(Math.abs(direction.x)) === 1) {
        rotationY = Math.PI; // 如果方向是沿着 X 轴的负方向
        if (direction.x > 0) {
          rotationY = 0; // 如果方向是沿着 X 轴的负方向
        }
        rotateZ = Math.PI / 2; // 如果方向是沿着 X 轴的负方向
      }

      const arrows = (
        <mesh
          key={`arrow-${index}`}
          position={midPoint} // 终点位置
          rotation={[-Math.PI / 2, rotationY, rotateZ]} // 旋转箭头到正确方向
          geometry={arrowGeometry.clone()}
          material={arrowMaterial}
        />
      );

      return (
        <group key={index}>
          {arrows}
          {/* <LineText edgeId={edgeId} fontSize={0.05} floor={floor} position={midPoint} directionType={directionType} /> */}
        </group>
      );
    });
  }, [curves, cameraPosition]);

  return <>{arrowsAndText}</>;
};

export default ArrowsAndText;
