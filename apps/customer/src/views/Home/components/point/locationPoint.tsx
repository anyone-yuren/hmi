import { useFrame, useThree } from '@react-three/fiber';
import { useRequest } from 'ahooks';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BoxGeometry, MeshStandardMaterial, Vector3 } from 'three';
import { getPointsList } from '../../services';
import { convertToMeters } from '../CarPanel/components/car';
import CanvasText from './cavansText';
const LocationPoint = () => {
  const { t } = useTranslation();
  const { data: pointsData }: Record<string, any> = useRequest(getPointsList);
  if (!pointsData && pointsData?.length === 0) {
    return null;
  }

  // const { cameraPosition } = useCameraAnimations();

  // 存储选中点的透明度状态
  const [selectedPoint, setSelectedPoint] = useState(null);

  // 创建共享的几何体和材质，并组装成一个 Mesh 对象
  const baseMesh = useMemo(() => {
    const geometry = new BoxGeometry(0.8, 0.8, 0.8);
    // return new Mesh(geometry, material); // 返回一个 Mesh 对象
    return { geometry };
  }, []);

  const { camera } = useThree();
  const [cameraPosition, setCameraPosition] = useState(camera.position.clone()); // 初始化相机位置

  useFrame(() => {
    // 只有相机位置发生变化时，才更新状态
    const newPosition = camera.position.clone();
    if (!newPosition.equals(cameraPosition)) {
      setCameraPosition(newPosition);
    }
  });

  return (
    <>
      {pointsData
        ?.filter((data) => data.types[0] == 1)
        ?.map((item) => {
          // const position = [convertToMeters(item.x), 0, convertToMeters(item.y)];
          const position = new Vector3(convertToMeters(item.x), 0.4, convertToMeters(item.y));

          const distance = position.distanceTo(cameraPosition);
          if (distance > 15) {
            return null;
          }

          // 判断当前点是否被选中，如果是，修改透明度
          const opacity = selectedPoint === item.id ? 1 : 0.2;
          const color = selectedPoint === item.id ? '#0000ff' : '#d0975d';

          // 创建一个新的材质，透明度根据选中状态动态变化
          const material = new MeshStandardMaterial({
            color,
            transparent: true,
            opacity,
            depthWrite: false,
          });
          return (
            <group key={item.pointId} position={position} receiveShadow>
              {/* 使用 Clone 实例化重复的 Mesh */}
              <mesh
                geometry={baseMesh.geometry}
                material={material}
                // receiveShadow
              />
              {/* <LineText
                edgeId={item.id}
                position={[0, 0.01, 0]}
                directionType={1}
                fontSize={0.3}
                color="white"
              /> */}
              <CanvasText text={item.id} position={[0, 0, 0]} />
            </group>
          );
        })}
    </>
  );
};

export default LocationPoint;
