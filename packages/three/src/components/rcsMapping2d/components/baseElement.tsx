import { useRcs2DGlobalStore } from '@gbeata/store';
import { MapControls, PerformanceMonitor, PerspectiveCamera } from '@react-three/drei';
import { useUpdateEffect } from 'ahooks';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Vector3 } from 'three';
import { useShallow } from 'zustand/react/shallow';

import MxwCar from '../devices/MxwCar';

import type { FC } from 'react';

const BasicElements: FC<any> = (props: { mapSize: any; mapOptions: any; referencePoints: any }) => {
  const { mapSize, mapOptions, referencePoints } = props;
  const [fov] = useState(75);
  const [aspect] = useState(window.innerWidth / window.innerHeight);
  const [distance, setDistance] = useState(0);
  const [cameraPosition, setCameraPosition] = useState<any>({});
  const firstReferencePoint = useMemo(() => {
    if (referencePoints && referencePoints.length > 0) {
      return referencePoints.find((item: any) => item.layer === 1);
    }
    return null;
  }, [referencePoints]);

  const { center } = mapSize;
  const { activeFloor, moveToPosition } = useRcs2DGlobalStore(
    useShallow((state) => ({
      moveToPosition: state.moveToPosition,
      activeFloor: state.activeFloor,
    })),
  );

  const lookPosition = useMemo(() => {
    if (firstReferencePoint && activeFloor !== -1) {
      return firstReferencePoint.referencePoint;
    }
    return center;
  }, [firstReferencePoint, center, activeFloor]);

  const { mapMaxX, mapMaxY, mapMinX, mapMinY } = mapOptions;

  const cameraControlsRef = useRef<any>(null);

  useEffect(() => {
    const distanceX = (mapMaxX - mapMinX) / 2 / Math.tan((fov / 2) * (Math.PI / 180));
    const distanceY = (mapMaxY - mapMinY) / 2 / Math.tan((fov / 2) * (Math.PI / 180));
    const d = Math.max(distanceX, distanceY);
    setDistance(d / 1000);
    const initPosition = new Vector3(lookPosition.x / 1000, d, lookPosition.y / 1000);
    setCameraPosition(initPosition);
  }, [mapMaxX, mapMaxY, mapMinX, mapMinY, lookPosition]);

  useUpdateEffect(() => {
    console.log('初始化的时候是否会执行');
    const { x, z, y } = moveToPosition;
    if (x === 0 && y === 0 && z === 0) {
      setCameraPosition({ x: center.x / 1000, y: distance, z: center.y / 1000 });
      return;
    }
    setCameraPosition({ x, y, z: -z });
  }, [moveToPosition]);

  return (
    <group>
      {/* 轨道控制器 */}
      <MapControls
        ref={cameraControlsRef}
        maxPolarAngle={0}
        minPolarAngle={0}
        minAzimuthAngle={0}
        maxAzimuthAngle={0}
        zoomSpeed={10}
        minDistance={1}
        maxDistance={distance + 12}
        enableZoom={true}
        zoomToCursor={true}
        makeDefault
        enableDamping={false}
        target={new Vector3(cameraPosition.x, 0, -cameraPosition.z)}
      />

      {/* 灯光 */}
      <ambientLight color='#fff' intensity={2.5} />
      <PerspectiveCamera
        makeDefault
        position={new Vector3(cameraPosition.x, cameraPosition.y, -cameraPosition.z)}
        fov={fov}
        aspect={aspect}
        near={0.1}
        far={1000}
        zoom={2}
      />
      <MxwCar position={new Vector3(lookPosition.x / 1000, 1, -lookPosition.y / 1000)} rotationY={0} />
      <PerformanceMonitor />
    </group>
  );
};

export default memo(BasicElements);
