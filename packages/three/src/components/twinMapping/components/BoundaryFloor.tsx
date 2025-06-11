import { RoundedBox } from '@react-three/drei';
import { useMemo } from 'react';
import { BoxGeometry, ShadowMaterial } from 'three';

import { theme } from 'antd';
import { convertToMeters, FLOOR_HEIGHT } from '../utils';

const BoundaryFloor = (props: {
  mapMinX: number;
  mapMaxX: number;
  mapMinY: number;
  mapMaxY: number;
  referencePoints?: { id: string; layer: number; referencePoint: [] }[];
  floorOpacity?: number; // 新增参数：透明度，默认为 0.5
  mapVertices?: IMapPoints[];
}) => {
  const { mapMinX, mapMaxX, mapMinY, mapMaxY, referencePoints = [], floorOpacity = 0.4, mapVertices = [] } = props;
  const { token } = theme.useToken();
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

  // 计算地板的几何体
  const floorGeometry = useMemo(() => {
    return new BoxGeometry(
      convertToMeters(renderMaxX - mapMinX),
      0.1, // 设定地板的厚度
      convertToMeters(renderMaxY - mapMinY),
    );
  }, [mapMinX, mapMaxX, mapMinY, mapMaxY, renderMaxX, renderMaxY]);

  // 选择地板材质
  const floorMaterial = useMemo(() => {
    return new ShadowMaterial({
      color: 'black',
      opacity: floorOpacity,
      transparent: true,
    });
  }, []);

  // 获取楼层高度
  const floorHeight = FLOOR_HEIGHT; // 固定楼层高度为 10 米

  // 生成楼层数量，如果没有 referencePoints 数据，默认为 1 层
  const layers = referencePoints.length > 0 ? referencePoints.length : 1;

  return (
    <>
      {Array.from({ length: layers }).map((_, index) => {
        // const offsetY = index * floorHeight; // 根据楼层索引调整位置
        const offsetY = 0; // 根据楼层索引调整位置
        return (
          <>
            {/* <SpotLight
              castShadow
              distance={200}
              intensity={500}
              angle={MathUtils.degToRad(180)}
              position={[
                convertToMeters(renderMaxX),
                offsetY + 9, // 通过楼层索引计算每一层的高度
                0 - convertToMeters(renderMaxY),
              ]}
              anglePower={50} // Diffuse-cone anglePower (default: 5)
            />
            <SpotLight
              castShadow
              distance={200}
              intensity={500}
              penumbra={1}
              angle={MathUtils.degToRad(-270)}
              position={[
                convertToMeters(renderMaxX - (renderMaxX - mapMinX)),
                offsetY + 9, // 通过楼层索引计算每一层的高度
                0 - convertToMeters(renderMaxY - (renderMaxY - mapMinY)),
              ]}
              anglePower={50} // Diffuse-cone anglePower (default: 5)
            /> */}

            <RoundedBox
              radius={0} // Radius of the rounded corners. Default is 0.05
              smoothness={2}
              args={[convertToMeters(renderMaxX - mapMinX), 0.4, convertToMeters(renderMaxY - mapMinY)]}
              position={[
                convertToMeters(renderMaxX - (renderMaxX - mapMinX) / 2),
                -0.1 + offsetY, // 通过楼层索引计算每一层的高度
                0 - convertToMeters(renderMaxY - (renderMaxY - mapMinY) / 2),
              ]}
              material={floorMaterial}
              receiveShadow
              castShadow
            ></RoundedBox>
          </>
        );
      })}
      {/* <RenderReferencePoints /> */}
    </>
  );
};

export default BoundaryFloor;
