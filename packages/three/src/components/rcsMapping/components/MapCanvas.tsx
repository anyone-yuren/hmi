import { GizmoHelper, GizmoViewport, SoftShadows } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
// import { useRcsGlobalStore } from "@gbeata/store";

// import { useShallow } from 'zustand/react/shallow';
import VehiclesList from '../devices';
import Area from './Area';
import BaseElement from './baseElement';
import BoundaryFloor from './BoundaryFloor';
import Elevator from './elevator';
import RenderPoints from './points';

import { checkCPU } from '../utils';

const MapVisualization = ({ mappingData }) => {
  if (!mappingData) return <div>Loading...</div>;
  // 检测设备

  // const { setReferencePoints } = useRcsGlobalStore(
  //   useShallow((state) => ({
  //     setReferencePoints: state.setReferencePoints,
  //   })),
  // );

  const { mapMinX, mapMaxX, mapMinY, mapMaxY } = mappingData?.mapOption || {};
  const { mapEdges, mapVertices, referencePoints = [], equipmentPoints = [], mapDrawBlocks = [] } = mappingData;
  // setReferencePoints(referencePoints);
  // 计算地图的宽度和高度
  const width = mapMaxX - mapMinX;
  const height = mapMaxY - mapMinY;

  // 计算地图的位置（在三维空间中定位）
  const centerX = (mapMinX + mapMaxX) / 2;
  const centerY = (mapMinY + mapMaxY) / 2;

  return (
    <Canvas
      dpr={[1, 2]}
      // scene={{
      //   fog: new THREE.Fog('#fff', 1000, 1000),
      // }}
      // shadows={{
      //   type: THREE.PCFSoftShadowMap,
      // }}
      shadows={checkCPU() ? 'soft' : false}
      gl={{ logarithmicDepthBuffer: true, antialias: true }}
    >
      <SoftShadows size={20} samples={10} focus={0.5} />
      {/* 设置背景色和环境光 */}
      <color attach='background' args={['#000']} />
      {/* 渲染合并后的线段 */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* <RouterLine mapEdges={mapEdges} /> */}
        {/* <Bspline mapEdges={mapEdges} /> */}
        <RenderPoints mapVertices={mapVertices} />
        <VehiclesList />
        {equipmentPoints ? <Elevator equipmentPoints={equipmentPoints} /> : null}
        {/* 绘制区域 */}
        <Area mapDrawBlocks={mapDrawBlocks} />
        {/* 渲染货架 */}
        {/* <Shelf /> */}
      </Suspense>

      {/* <Man /> */}
      {/* <Sun /> */}

      {/* 增加坐标轴工具 */}
      <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black' />
      </GizmoHelper>
      {/* <Environment preset='city' /> */}
      {referencePoints ? (
        <BoundaryFloor
          mapMaxX={mapMaxX}
          mapMaxY={mapMaxY}
          mapMinX={mapMinX}
          mapMinY={mapMinY}
          referencePoints={referencePoints}
          mapVertices={mapVertices}
        />
      ) : (
        <BoundaryFloor
          mapMaxX={mapMaxX}
          mapMaxY={mapMaxY}
          mapMinX={mapMinX}
          mapMinY={mapMinY}
          referencePoints={[]}
          mapVertices={mapVertices}
        />
      )}
      {/* 增加阴影效果 */}
      {/* <ContactShadows position={[0, -4.5, 0]} scale={20} blur={2} far={4.5} /> */}
      <BaseElement
        mapSize={{ center: { x: centerX, y: centerY }, width, height }}
        mapOptions={mappingData?.mapOption}
        referencePoints={referencePoints}
      />
      {/* <Stats /> */}
    </Canvas>
  );
};

export default MapVisualization;
