import { useMemo, useState } from 'react';

import { useFrame, useThree } from '@react-three/fiber';
import { BufferGeometry, CatmullRomCurve3, LineBasicMaterial, Vector3 } from 'three';
// import CanvasText from '../../point/cavansText';

const convertToMeters = (value: number) => {
  return value / 1000;
};
const RcsLines = ({ mapEdges = [] }) => {
  const { camera } = useThree();
  const [cameraPosition, setCameraPosition] = useState(camera.position.clone()); // 初始化相机位置

  useFrame(() => {
    // 只有相机位置发生变化时，才更新状态
    const newPosition = camera.position.clone();
    if (!newPosition.equals(cameraPosition)) {
      setCameraPosition(newPosition);
    }
  });
  const curves = useMemo(() => {
    if (!mapEdges.length) return [];
    return mapEdges?.map((edge) => {
      const controlPoints = edge?.control_points?.map((point) => {
        // const position = [convertToMeters(item.x), 0, convertToMeters(item.y)];
        const position = new Vector3(0 - convertToMeters(point.x), 0, convertToMeters(point.y));
        return position;
      });
      const curve = new CatmullRomCurve3(controlPoints);
      return {
        curve,
        edgeId: edge.id,
      };
    });
  }, [mapEdges]);

  const material = new LineBasicMaterial({ color: 0x00ff00 }).clone();

  // 预创建箭头材质（优化：避免重复创建材质）
  const lines = useMemo(() => {
    return curves?.map(({ curve, edgeId }, index) => {
      const points = curve.getPoints(20);
      const geometry = new BufferGeometry().setFromPoints(points);
      // 获取中心点坐标
      const center = curve.getPointAt(index % 2 == 0 ? 0.5 : 0.25);
      const distance = center.distanceTo(cameraPosition);
      if (distance > 15) {
        return null;
      }

      return (
        <group key={index}>
          <line geometry={geometry} material={material} />
          {/* <LineText
            edgeId={edgeId}
            position={center}
            directionType={1}
            fontSize={0.3}
            color="white"
          /> */}
          {/* <CanvasText text={edgeId} position={center} fontSize={'4px'} /> */}
        </group>
      );
    });
  }, [curves, material]);

  return <group>{lines}</group>;
};
export default RcsLines;
