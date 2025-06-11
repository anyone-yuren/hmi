import { useRcsGlobalStore } from '@gbeata/store';
import { SoftShadows } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import { theme } from 'antd';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import Area from './Area';
import BaseElement from './baseElement';
import BlockArea from './BlockArea';
import BoundaryFloor from './BoundaryFloor';
import Bspline from './Bspline';
import RenderPoints from './points';
import Shelf from './shelf';

const MapVisualization = ({ mappingData }) => {
  if (!mappingData) return <div>Loading...</div>;
  const { token } = theme.useToken();
  // 检测设备

  const { showLine, showBlockArea, showRoadWay } = useRcsGlobalStore(
    useShallow((state) => ({
      // setReferencePoints: state.setReferencePoints,
      showLine: state.showLine,
      showBlockArea: state.showBlockArea,
      showRoadWay: state.showRoadWay,
    })),
  );

  const { mapMinX, mapMaxX, mapMinY, mapMaxY } = mappingData?.mapOption || {};
  const {
    mapEdges,
    mapVertices,
    referencePoints,
    equipmentPoints = [],
    mapDrawBlocks = [],
    storageDatas = [],
    mapDrawAreas = [],
  } = mappingData;

  // setReferencePoints(referencePoints);
  // 计算地图的宽度和高度
  const width = mapMaxX - mapMinX;
  const height = mapMaxY - mapMinY;

  // 计算地图的位置（在三维空间中定位）
  const centerX = (mapMinX + mapMaxX) / 2;
  const centerY = (mapMinY + mapMaxY) / 2;

  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={[1.5, 2]}
      gl={{ logarithmicDepthBuffer: true, antialias: true }}
    >
      <SoftShadows size={10} samples={50} focus={10} />
      {/* 设置背景色和环境光 */}
      <color attach='background' args={[token?.colorBgContainer]} />
      {/* 渲染合并后的线段 */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* <VehiclesList /> */}
        {/* <RouterLine mapEdges={mapEdges} /> */}
        {showLine ? <Bspline mapEdges={mapEdges} /> : null}
        <RenderPoints mapVertices={mapVertices} />
        {/* <LocationPoint mapVertices={storageDatas} /> */}
        {/* <Elevator equipmentPoints={equipmentPoints} /> */}
        {/* 绘制区域 */}
        <Area mapDrawBlocks={mapDrawBlocks} />
        {/* {绘制巷道、墙之类的} */}
        {showBlockArea ? <BlockArea mapDrawBlocks={mapDrawAreas} /> : null}
        {/* 渲染货架 */}
        <Shelf />
      </Suspense>

      {/* <Man /> */}
      {/* <Sun /> */}

      {/* 增加坐标轴工具 */}
      {/* <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black' />
      </GizmoHelper> */}
      {/* <Environment preset='city' /> */}
      <BoundaryFloor
        mapMaxX={mapMaxX}
        mapMaxY={mapMaxY}
        mapMinX={mapMinX}
        mapMinY={mapMinY}
        // referencePoints={referencePoints}
        referencePoints={[]}
        mapVertices={mapVertices}
      />
      {/* 增加阴影效果 */}
      {/* <ContactShadows position={[0, -4.5, 0]} scale={20} blur={2} far={4.5} /> */}
      <BaseElement
        mapSize={{ center: { x: centerX, y: centerY }, width, height }}
        mapOptions={mappingData?.mapOption}
        // referencePoints={referencePoints}
        referencePoints={[]}
      />
      {/* <Stats /> */}
    </Canvas>
  );
};

export default MapVisualization;
