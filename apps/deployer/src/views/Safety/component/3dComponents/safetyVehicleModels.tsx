import { useSafetyStore } from '@/views/Safety/store/safety.store';
import { useAgvModels } from '@gbeata/app-global';
import { memo, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { generateRectanglePoints, getProjectArea } from '../../utils/index';
const mockHeight = 685;
function SafetyVehicle(props: any) {
  const { vehicleRect, forksUnderRect, distance, maxHeight } = props;
  if (!distance?.length) return null;

  const { model: AgvModel, position: AgvPosition } = useAgvModels();
  const { forksHeight, obsInfo } = useSafetyStore(
    useShallow((store) => ({
      forksHeight: store.forksHeight,
      obsInfo: store.obsInfo,
    })),
  );
  const [depth, setDepth] = useState(1.8);
  const [forkDepth, setForkDepth] = useState(0.1);
  const [palletDepth, setPalletDepth] = useState(0.1);

  const pallet: any = useMemo(() => {
    const x1 = obsInfo.pallet_left_top_point_x || 0;
    const y1 = obsInfo.pallet_left_top_point_y || 0;
    const x2 = obsInfo.pallet_right_bottom_point_x || 0;
    const y2 = obsInfo.pallet_right_bottom_point_y || 0;
    const palletPoints = generateRectanglePoints([x1, y1, x2, y2]);
    const palletWidth = Math.abs(palletPoints[1][0] - palletPoints[0][0]);
    const palletHeight = Math.abs(palletPoints[2][1] - palletPoints[0][1]);
    const palletPosition = [
      (palletPoints[0][0] + palletPoints[1][0]) / 2, // X 中心点
      (palletPoints[0][1] + palletPoints[2][1]) / 2, // Y 中心点
      forksHeight / 1000 + palletDepth / 2 + forkDepth, // Z 中心点
    ];
    return {
      width: palletWidth,
      height: palletHeight,
      position: palletPosition,
    };
  }, [obsInfo, palletDepth, forksHeight, forkDepth]);

  const outlook: any = useMemo(() => {
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
    console.log('[safetyVehicleModels.tsx: 73]: 叉臂高度', forksHeight);
    // 先用mockHeight来表示临时的叉臂高度
    return getProjectArea(forksUnderRect, forksHeight);
  }, [forksUnderRect, forksHeight]);

  useEffect(() => {}, [outlook, forksUnderProjectArea]);

  return (
    <>
      {/* 渲染车辆立方体 */}
      {/* <mesh
        geometry={new THREE.BoxGeometry(outlook.vehicle.width, outlook.vehicle.height, depth)}
        position={outlook.vehicle.position}
      >
        <meshStandardMaterial color='#00d1d1' transparent opacity={0.8} depthTest={false} depthWrite={false} />
      </mesh> */}
      {/* 渲染叉臂立方体 */}
      {/* <mesh
        geometry={new THREE.BoxGeometry(outlook.forks.width, outlook.forks.height, forkDepth)}
        position={outlook.forks.position}
      >
        <meshStandardMaterial color='#00d1d1' transparent opacity={0.9} depthTest={false} depthWrite={false} />
      </mesh> */}
      {/* 托盘 */}
      {/* <mesh geometry={new THREE.BoxGeometry(pallet.width, pallet.height, palletDepth)} position={pallet.position}>
        <meshStandardMaterial color='yellow' transparent opacity={0.8} depthTest={false} depthWrite={false} />
      </mesh> */}
      {/* 改成通用模型 */}
      {
        <group rotation={[(90 * Math.PI) / 180, Math.PI, 0]} position={AgvPosition}>
          <AgvModel
            forkHeight={forksHeight}
            forksPositionZ={forksHeight}
            palletVisible={pallet.width >= 0}
            goodsVisible={obsInfo.has_goods}
            headerRadar={{ z: maxHeight }}
          ></AgvModel>
        </group>
      }

      {/* 托盘上的货 */}
      {/* {obsInfo.has_goods && (
        <mesh
          geometry={new THREE.BoxGeometry(pallet.width, pallet.height, 1)}
          position={[pallet.position[0], pallet.position[1], pallet.position[2] + 0.5 + palletDepth / 2]}
        >
          <meshStandardMaterial color='green' transparent opacity={0.8} depthTest={false} depthWrite={false} />
        </mesh>
      )} */}
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
          <meshStandardMaterial color='yellow' transparent opacity={0.6} depthTest={false} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}

export default memo(SafetyVehicle);
