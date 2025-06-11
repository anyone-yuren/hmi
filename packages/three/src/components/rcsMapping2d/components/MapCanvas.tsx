import { useRcs2DGlobalStore } from '@gbeata/store';
import { GizmoHelper, GizmoViewport } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useShallow } from 'zustand/react/shallow';

import VehiclesList from '../devices';
import BaseElement from './baseElement';
import BoundaryFloor from './BoundaryFloor';
import Bspline from './Bspline';
import RenderPoints from './points';

const MapVisualization = ({ mappingData }) => {
  if (!mappingData) return <div>Loading...</div>;

  const { activeFloor, mapFunctionKeys, setMapFunctionKeys } = useRcs2DGlobalStore(
    useShallow((state) => ({
      activeFloor: state.activeFloor,
      mapFunctionKeys: state.mapFunctionKeys,
      setMapFunctionKeys: state.setMapFunctionKeys,
    })),
  );

  const { mapMinX, mapMaxX, mapMinY, mapMaxY } = mappingData?.mapOption || {};
  const { mapEdges, mapVertices, referencePoints, equipmentPoints = [] } = mappingData;

  // setReferencePoints(referencePoints);
  // 计算地图的宽度和高度
  const width = mapMaxX - mapMinX;
  const height = mapMaxY - mapMinY;

  // 计算地图的位置（在三维空间中定位）
  const centerX = (mapMinX + mapMaxX) / 2;
  const centerY = (mapMinY + mapMaxY) / 2;

  return (
    <>
      {/* <HeaderActionBar mappingData={mappingData} /> */}

      <Canvas dpr={[1, 2]}>
        {/* 设置背景色和环境光 */}
        <color attach='background' args={['#000']} />
        {/* 渲染合并后的线段 */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* <RouterLine mapEdges={mapEdges} /> */}
          {mapFunctionKeys.includes('lines') && <Bspline mapEdges={mapEdges} floor={activeFloor} />}
          <RenderPoints mapVertices={mapVertices} floor={activeFloor} />
          <VehiclesList />
          {/* {mapFunctionKeys.includes('elevator') && <Elevator equipmentPoints={equipmentPoints} floor={activeFloor} />} */}
        </Suspense>

        {/* <Man /> */}
        {/* <Sun /> */}

        {/* 增加坐标轴工具 */}
        {false && (
          <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
            <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black' />
          </GizmoHelper>
        )}
        {/* <Environment preset='city' /> */}
        {false && (
          <BoundaryFloor
            mapMaxX={mapMaxX}
            mapMaxY={mapMaxY}
            mapMinX={mapMinX}
            mapMinY={mapMinY}
            referencePoints={referencePoints}
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
      </Canvas>
    </>
  );
};

export default MapVisualization;
