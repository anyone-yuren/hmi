import { useFrame, useThree } from '@react-three/fiber';
import { useRequest } from 'ahooks';
import { useMemo, useState } from 'react';
import { BoxGeometry, CircleGeometry, MeshStandardMaterial, Vector3 } from 'three';
import { getPointsList } from '../../services';
import { convertToMeters } from '../CarPanel/components/car';
import CanvasText from './cavansText';
const LocationPoint = () => {
  // const renderCount = useRef(0);
  // renderCount.current++;
  const { data: pointsData }: Record<string, any> = useRequest(getPointsList);
  if (!pointsData && pointsData?.length === 0) {
    return null;
  }

  // const { cameraPosition } = useCameraAnimations();

  // 创建共享的几何体和材质，并组装成一个 Mesh 对象
  const baseMesh = useMemo(() => {
    const geometry = new BoxGeometry(0.8, 0.1, 0.8);
    // return new Mesh(geometry, material); // 返回一个 Mesh 对象
    return { geometry };
  }, []);

  // ✅ 创建一个蓝色圆形 Mesh
  const circleGeometry = useMemo(() => {
    // CircleGeometry(半径, 分段数)
    const geometry = new CircleGeometry(0.1, 32);

    return geometry;
  }, []);

  const { camera } = useThree();
  const [cameraPosition, setCameraPosition] = useState(camera.position.clone()); // 初始化相机位置

  useFrame(() => {
    // 只有相机位置发生变化时，才更新状态
    const newPosition = camera.position.clone();
    if (newPosition.y !== cameraPosition.y) {
      setCameraPosition(newPosition);
    }
  });

  // 创建一个新的材质，透明度根据选中状态动态变化
  const material = new MeshStandardMaterial({
    color: '#d0975d',
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });

  const materialCircle = new MeshStandardMaterial({
    color: '#00d1d1',
    transparent: true,
    opacity: 1,
    depthWrite: false,
  });

  return (
    <>
      {pointsData?.data
        // ?.filter((data) => data.types[0] == 1)
        ?.map((item) => {
          const type = item.types[0];
          // const position = [convertToMeters(item.x), 0, convertToMeters(item.y)];
          const position = new Vector3(0 - convertToMeters(item.x), 0.05, convertToMeters(item.y));

          const distance = position.distanceTo(cameraPosition);
          if (distance > 15) {
            return null;
          }
          return (
            <group key={item.pointId} position={position} receiveShadow>
              {/* <Html position={[0, 0, 0]}>
                <div
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    color: '#0f0',
                    padding: '6px 12px',
                    borderRadius: 8,
                    fontFamily: 'monospace',
                    fontSize: 14,
                  }}
                >
                  <div>点次数: {renderCount.current}</div>
                </div>
              </Html> */}
              {/* 使用 Clone 实例化重复的 Mesh */}
              <mesh
                // geometry={baseMesh.geometry}
                geometry={type !== 1 ? circleGeometry : baseMesh.geometry}
                material={type !== 1 ? materialCircle : material}
                rotation={[type !== 1 ? -Math.PI / 2 : 0, 0, 0]}
                // receiveShadow
              />
              <CanvasText text={item.id} position={[0, 0, 0]} fontSize={type !== 1 ? '4px' : '6px'} />
            </group>
          );
        })}
    </>
  );
};

export default LocationPoint;
