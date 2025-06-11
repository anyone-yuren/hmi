import { Svg } from '@react-three/drei';
import { Suspense } from 'react';
import { BoxGeometry, MeshStandardMaterial } from 'three';

import { convertToMeters } from '../../utils';

// 平库点
interface IWarehousePointProps {
  mapVertices: IMapPoints[];
}

const ChargePoint = (props: IWarehousePointProps) => {
  const { mapVertices } = props;
  if (!mapVertices) {
    return null;
  }

  // const pointsGeometry = new BufferGeometry();
  const geometry = new BoxGeometry(0.8, 0.8, 0.8);
  const material = new MeshStandardMaterial({ color: '#ff00ff', transparent: true });

  return (
    <>
      {mapVertices.map((item, index) => {
        return (
          <group key={index} position={[convertToMeters(item.x), 0.8, convertToMeters(0 - item.y)]}>
            <mesh geometry={geometry} material={material} />
            {/* 充电图标 */}
            <Suspense fallback={null}>
              <Svg src='/icons/charging.svg' scale={0.01} rotation={[Math.PI, Math.PI, Math.PI / 2]}></Svg>
            </Suspense>
          </group>
        );
      })}
    </>
  );
};

export default ChargePoint;
