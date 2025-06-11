import { Clone, Text } from '@react-three/drei'; // 引入 Text 组件
import { extend, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useState } from 'react';
import { BoxGeometry, CylinderGeometry, Mesh, MeshStandardMaterial, Spherical, Vector3 } from 'three';

import useMapData from '../../hooks/useMapData';
import { convertToMeters, ElementDisplayDistance, FLOOR_HEIGHT } from '../../utils';
import LineText from '../lineText';

extend({ Text });

// 平库点
interface IWarehousePointProps {
  mapVertices: IMapPoints[];
}

const BasePoint = (props: IWarehousePointProps) => {
  const { mapVertices } = props;
  if (!mapVertices) {
    return null;
  }
  const { camera } = useThree();
  const { getReferencePointPosition } = useMapData();
  const [cameraPosition, setCameraPosition] = useState(camera.position.clone()); // 初始化相机位置

  useFrame(() => {
    // 只有相机位置发生变化时，才更新状态
    const newPosition = camera.position.clone();
    if (!newPosition.equals(cameraPosition)) {
      setCameraPosition(newPosition);
    }
  });

  // 创建共享的几何体和材质，并组装成一个 Mesh 对象
  const baseMesh = useMemo(() => {
    const geometry = new CylinderGeometry(0.05, 0.05, 0.05, 32);
    const material = new MeshStandardMaterial({ color: '#3261ff', transparent: true });
    return new Mesh(geometry, material); // 返回一个 Mesh 对象
  }, []);
  return (
    <>
      {mapVertices.map((item) => {
        const floor = item?.floor ? item?.floor - 1 : 0;
        // const position = [convertToMeters(item.x), 0, convertToMeters(item.y)];
        const SpacingCoordinates = getReferencePointPosition(item.floor);

        // const position = [convertToMeters(item.x), 0, convertToMeters(item.y)];
        const position = new Vector3(
          convertToMeters(item.x - SpacingCoordinates.x),
          floor * FLOOR_HEIGHT + 0.025,
          convertToMeters(0 - item.y - SpacingCoordinates.y),
        );

        const distance = position.distanceTo(cameraPosition);
        if (distance > ElementDisplayDistance.pointDisplayDistance) {
          return null;
        }

        return (
          <>
            <group key={item.pointId} position={position}>
              <Clone object={baseMesh} receiveShadow />
              {distance < 5 ? (
                <LineText
                  edgeId={item.pointId}
                  position={[0, 0.03, 0]}
                  directionType={1}
                  fontSize={0.1}
                  color='white'
                />
              ) : null}
            </group>
          </>
        );
      })}
    </>
  );
};

export default BasePoint;
