import { useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useState } from 'react';
import { Vector3 } from 'three';

import useMapData from '../../../hooks/useMapData';
import { convertToMeters, ElementDisplayDistance, FLOOR_HEIGHT } from '../../../utils';
import LineText from '../../lineText';

// 平库点
interface IWarehousePointProps {
  mapVertices: IMapPoints[];
}

const RenderText = (props: IWarehousePointProps) => {
  const { mapVertices } = props;
  if (!mapVertices) {
    return null;
  }

  // const { cameraPosition } = useCameraAnimations();

  const { getReferencePointPosition } = useMapData();
  // 存储选中点的透明度状态

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
      {mapVertices.map((item) => {
        const floor = item?.floor ? item?.floor - 1 : 0;
        const SpacingCoordinates = getReferencePointPosition(item.floor);

        // const position = [convertToMeters(item.x), 0, convertToMeters(item.y)];
        const position = new Vector3(
          convertToMeters(item.x - SpacingCoordinates.x),
          floor * FLOOR_HEIGHT + 0.5,
          convertToMeters(0 - item.y - SpacingCoordinates.y),
        );
        // 计算点位置与相机的距离
        const distance = position.distanceTo(cameraPosition);
        // const position = new Vector3(convertToMeters(item.x), 0.4, convertToMeters(0 - item.y));
        return (
          <group key={item.pointId} position={position}>
            {/* {grayMesh} */}
            {distance < ElementDisplayDistance.locationDisplayDistance ? (
              <LineText edgeId={item.pointId} position={[0, 0.5, 0]} directionType={1} fontSize={0.3} color='white' />
            ) : null}
          </group>
        );
      })}
    </>
  );
};

export default RenderText;
