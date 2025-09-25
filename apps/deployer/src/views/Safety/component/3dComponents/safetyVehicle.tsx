import { useSafetyStore } from '@/views/Safety/store/safety.store';
import { memo, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { generateRectanglePoints, getProjectArea } from '../../utils/index';

const mockHeight = 685;
function SafetyVehicle(props: any) {
  const { vehicleRect, forksUnderRect, distance } = props;
  console.log('distance:[前，后]', distance);
  if (!distance?.length) return null;

  const { forksHeight } = useSafetyStore(
    useShallow((store) => ({
      forksHeight: store.forksHeight,
    })),
  );
  console.log('[safety]forksUpRect叉臂下方保护区域立方体', forksUnderRect);
  const [depth, setDepth] = useState(1.8);
  const [forkDepth, setForkDepth] = useState(0.1);

  const outlook: any = useMemo(() => {
    console.log('看看什么值在改变', vehicleRect, depth, forkDepth, forksHeight, distance);
    const vehicle = vehicleRect.find((item) => item.name === 'head');
    const forks = vehicleRect.find((item) => item.name === 'forkarm');

    const vehiclePoints = generateRectanglePoints(vehicle?.rectangle);
    const forksPoints = generateRectanglePoints(forks?.rectangle);

    // 计算车辆的尺寸和位置
    const vehicleWidth = Math.abs(vehiclePoints[1][0] - vehiclePoints[0][0]);
    const vehicleHeight = Math.abs(vehiclePoints[2][1] - vehiclePoints[0][1]);
    const vehiclePosition = [
      (vehiclePoints[0][0] + vehiclePoints[1][0]) / 2, // X 中心点
      (vehiclePoints[0][1] + vehiclePoints[2][1]) / 2, // Y 中心点
      depth / 2, // Z 中心点
    ];

    // 计算叉臂的尺寸和位置
    const forksWidth = Math.abs(forksPoints[1][0] - forksPoints[0][0]);
    const forksHeightCalculated = Math.abs(forksPoints[2][1] - forksPoints[0][1]);
    const forksPosition = [
      (forksPoints[0][0] + forksPoints[1][0]) / 2, // X 中心点
      (forksPoints[0][1] + forksPoints[2][1]) / 2, // Y 中心点
      forksHeight / 1000 + forkDepth / 2, // Z 中心点
    ];

    return {
      vehicle: {
        points: vehiclePoints,
        width: vehicleWidth,
        height: vehicleHeight,
        position: vehiclePosition,
      },
      forks: {
        points: forksPoints,
        width: forksWidth,
        height: forksHeightCalculated,
        position: forksPosition,
      },
    };
  }, [vehicleRect, depth, forkDepth, forksHeight, distance]);

  const forksUnderProjectArea: any = useMemo(() => {
    if (!forksUnderRect) return null;
    // 先用mockHeight来表示临时的叉臂高度
    return getProjectArea(forksUnderRect, forksHeight);
  }, [forksUnderRect, forksHeight]);

  useEffect(() => {
    console.log('[safety]:车图轮廓', outlook, forksUnderProjectArea);
  }, [outlook, forksUnderProjectArea]);

  return (
    <>
      {/* 渲染车辆立方体 */}
      <mesh
        geometry={new THREE.BoxGeometry(outlook.vehicle.width, outlook.vehicle.height, depth)}
        position={outlook.vehicle.position}
      >
        <meshStandardMaterial color='#00d1d1' transparent opacity={0.8} depthTest={false} />
      </mesh>

      {/* 渲染叉臂立方体 */}
      <mesh
        geometry={new THREE.BoxGeometry(outlook.forks.width, outlook.forks.height, forkDepth)}
        position={outlook.forks.position}
      >
        <meshStandardMaterial color='#00d1d1' depthTest={false} />
      </mesh>

      {/* 渲染保护区域立方体 */}
      {forksUnderProjectArea && forksUnderProjectArea.depth && (
        <mesh
          geometry={
            new THREE.BoxGeometry(
              forksUnderProjectArea.width,
              forksUnderProjectArea.height,
              forksUnderProjectArea.depth,
            )
          }
          position={forksUnderProjectArea.position}
        >
          <meshStandardMaterial color='#00d1d1' transparent opacity={0.6} depthTest={false} />
        </mesh>
      )}
    </>
  );
}

export default memo(SafetyVehicle);
