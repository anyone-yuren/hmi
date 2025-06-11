import { useRcs2DGlobalStore } from '@gbeata/store';
import { useEffect, useMemo } from 'react';
import { BoxGeometry, MeshStandardMaterial } from 'three';
import { useShallow } from 'zustand/react/shallow';

import { convertToMeters, FLOOR_HEIGHT } from '../utils';
import RenderReferencePoints from './renderReferencePoints';

const BoundaryFloor = (props: {
  mapMinX: number;
  mapMaxX: number;
  mapMinY: number;
  mapMaxY: number;
  referencePoints?: { id: string; layer: number; referencePoint: [] }[];
  floorOpacity?: number; // 新增参数：透明度，默认为 0.5
  mapVertices?: IMapPoints[];
}) => {
  const { mapMinX, mapMaxX, mapMinY, mapMaxY, referencePoints = [], floorOpacity = 0.05, mapVertices = [] } = props;

  const { activeFloor } = useRcs2DGlobalStore(
    useShallow((state) => ({
      activeFloor: state.activeFloor,
    })),
  );

  // 获取最大的 x 和 y 值
  const maxX = useMemo(() => {
    return mapVertices.reduce((max, current) => (current.x > max.x ? current : max), mapVertices[0] || 0);
  }, [mapVertices]);

  const maxY = useMemo(() => {
    return mapVertices.reduce((max, current) => (current.y > max.y ? current : max), mapVertices[0] || 0);
  }, [mapVertices]);
  const firstLayer = referencePoints.find((item) => item.layer === 1);
  const lastLayer = referencePoints.find((item) => item.layer === referencePoints.length);

  let renderMaxX = 0;
  let renderMaxY = 0;

  if (firstLayer) {
    renderMaxX = maxX.x - lastLayer.referencePoint.x + firstLayer.referencePoint.x + 10000;
    renderMaxY = maxY.y - lastLayer.referencePoint.y + firstLayer.referencePoint.y + 10000;
  } else {
    renderMaxX = mapMaxX;
    renderMaxY = mapMaxY;
  }

  useEffect(() => {
    console.log('props', props, activeFloor);
  }, [props, activeFloor]);

  // 计算地板的几何体
  const floorGeometry = useMemo(() => {
    return activeFloor === -1
      ? new BoxGeometry(
          convertToMeters(mapMaxX - mapMinX),
          0.01, // 设定地板的厚度
          convertToMeters(mapMaxY - mapMinY),
        )
      : new BoxGeometry(
          convertToMeters(renderMaxX - mapMinX),
          0.01, // 设定地板的厚度
          convertToMeters(renderMaxY - mapMinY),
        );
  }, [mapMinX, mapMaxX, mapMinY, mapMaxY, renderMaxX, renderMaxY, activeFloor]);

  // 选择地板材质
  const floorMaterial = useMemo(() => {
    return new MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: floorOpacity });
  }, []);

  // 获取楼层高度
  const floorHeight = FLOOR_HEIGHT; // 固定楼层高度为 10 米

  // 生成楼层数量，如果没有 referencePoints 数据，默认为 1 层
  const layers = referencePoints.length > 0 ? referencePoints.length : 1;
  if (activeFloor === -1) {
    return (
      <mesh
        receiveShadow
        geometry={floorGeometry}
        material={floorMaterial}
        position={[
          convertToMeters(mapMaxX - (mapMaxX - mapMinX) / 2),
          -1 + 0, // 通过楼层索引计算每一层的高度
          0 - convertToMeters(mapMaxY - (mapMaxY - mapMinY) / 2),
        ]}
      />
    );
  }

  return (
    <>
      {Array.from({ length: layers }).map((_, index) => {
        const offsetY = index * floorHeight; // 根据楼层索引调整位置
        // if (activeFloor - 1 != index) return null;
        return (
          <mesh
            key={index}
            receiveShadow
            geometry={floorGeometry}
            material={floorMaterial}
            position={[
              convertToMeters(renderMaxX - (renderMaxX - mapMinX) / 2),
              -1 + offsetY, // 通过楼层索引计算每一层的高度
              0 - convertToMeters(renderMaxY - (renderMaxY - mapMinY) / 2),
            ]}
          />
        );
      })}
      <RenderReferencePoints />
    </>
  );
};

export default BoundaryFloor;
