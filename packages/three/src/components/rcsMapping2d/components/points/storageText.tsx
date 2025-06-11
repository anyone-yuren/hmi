import { useFrame, useThree } from '@react-three/fiber';
import { useState } from 'react';

import { Vector3 } from 'three';

import useMapData from '../../hooks/useMapData';
import { convertToMeters, ElementDisplayDistance, FLOOR_HEIGHT } from '../../utils';
import LineText from '../lineText';

const StorageText = (props: any) => {
  const { getReferencePointPosition } = useMapData();

  const { camera } = useThree();
  const [cameraPosition, setCameraPosition] = useState(camera.position.clone()); // 初始化相机位置

  useFrame(() => {
    // 只有相机位置发生变化时，才更新状态
    const newPosition = camera.position.clone();
    if (!newPosition.equals(cameraPosition)) {
      setCameraPosition(newPosition);
    }
  });

  const floor = props?.floor ? props?.floor - 1 : 0;
  const SpacingCoordinates = getReferencePointPosition(props.floor);

  const position = new Vector3(
    convertToMeters(props.x - SpacingCoordinates.x),
    floor * FLOOR_HEIGHT + 0.5,
    convertToMeters(0 - props.y - SpacingCoordinates.y),
  );

  // 计算点位置与相机的距离
  const distance = position.distanceTo(cameraPosition);

  return (
    <>
      {distance < ElementDisplayDistance.locationDisplayDistance ? (
        <LineText edgeId={props.pointId} position={[0, 0.1, 0]} directionType={1} fontSize={0.3} color='white' />
      ) : null}
    </>
  );
};

export default StorageText;
