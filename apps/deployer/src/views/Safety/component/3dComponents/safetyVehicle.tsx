import { useSafetyStore } from '@/views/Safety/store/safety.store';
import { memo, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { generateRectanglePoints, getProjectArea } from '../../utils/index';

const mockHeight = 685;
function SafetyVehicle(props: any) {
  const { vehicleRect, forksUnderRect } = props;

  const { forksHeight } = useSafetyStore(
    useShallow((store) => ({
      forksHeight: store.forksHeight,
    })),
  );
  console.log('[safety]forksUpRect叉臂下方保护区域立方体', forksUnderRect);
  const [depth, setDepth] = useState(1.8);
  const [forkDepth, setForkDepth] = useState(0.1);

  const outlook: any = useMemo(() => {
    const vehicle = vehicleRect.find((item) => item.name === 'head');
    const forks = vehicleRect.find((item) => item.name === 'forkarm');

    const vehiclePoints = generateRectanglePoints(vehicle.rectangle);
    const forksPoints = generateRectanglePoints(forks.rectangle);

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
      mockHeight / 1000 + forkDepth / 2, // Z 中心点
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
  }, [vehicleRect, depth, forkDepth, forksHeight]);

  const forksUnderProjectArea: any = useMemo(() => {
    if (!forksUnderRect) return null;
    // 先用mockHeight来表示临时的叉臂高度
    return getProjectArea(forksUnderRect, mockHeight);
    // const projectRect = generateRectanglePoints(forksUnderRect.rectangle);

    // // 计算保护区域的尺寸
    // const projectWidth = Math.abs(projectRect[1][0] - projectRect[0][0]); // 宽度
    // const projectHeight = Math.abs(projectRect[2][1] - projectRect[0][1]); // 高度
    // const projectDepth = Math.max(
    //   (mockHeight - forksUnderRect.height_start - forksUnderRect.forkarm_height_cut) / 1000,
    //   0,
    // ); // 深度
    // // 计算保护区域的位置
    // const projectPosition = [
    //   (projectRect[0][0] + projectRect[1][0]) / 2, // X 中心点
    //   (projectRect[0][1] + projectRect[2][1]) / 2, // Y 中心点
    //   forksUnderRect.height_start / 1000 + projectDepth / 2, // Z 中心点
    // ];

    // console.log('[safety]:保护区域', { projectWidth, projectHeight, projectDepth, projectPosition });

    // return {
    //   width: projectWidth,
    //   height: projectHeight,
    //   depth: projectDepth,
    //   position: projectPosition,
    // };
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
        <meshStandardMaterial color='#00d1d1' />
      </mesh>

      {/* 渲染叉臂立方体 */}
      <mesh
        geometry={new THREE.BoxGeometry(outlook.forks.width, outlook.forks.height, forkDepth)}
        position={outlook.forks.position}
      >
        <meshStandardMaterial color='#00d1d1' />
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
          <meshStandardMaterial color='#00d1d1' transparent opacity={0.6} />
        </mesh>
      )}
    </>
  );
}

export default memo(SafetyVehicle);
