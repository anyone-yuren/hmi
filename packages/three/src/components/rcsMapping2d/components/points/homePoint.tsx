import { Svg, Text } from '@react-three/drei'; // 引入 Text 组件
import { extend } from '@react-three/fiber';
import { Suspense } from 'react';
import { BoxGeometry, MeshStandardMaterial } from 'three';

import { convertToMeters } from '../../utils';
import LineText from '../lineText';

extend({ Text });

// 平库点
interface IWarehousePointProps {
  mapVertices: IMapPoints[];
}

const HomePoint = (props: IWarehousePointProps) => {
  const { mapVertices } = props;
  if (!mapVertices) {
    return null;
  }

  // const pointsGeometry = new BufferGeometry();
  const geometry = new BoxGeometry(0.8, 0.8, 0.8);
  const material = new MeshStandardMaterial({ color: '#0000ff', transparent: true });

  return (
    <>
      {mapVertices.map((item) => {
        const position = [convertToMeters(item.x), 0, convertToMeters(0 - item.y)];
        return (
          <>
            <group key={item.pointId} position={position}>
              {/* <mesh geometry={geometry} material={material} /> */}
              <Suspense>
                <Svg
                  src='/icons/point.svg'
                  scale={0.04}
                  position={[0.4, 0, -0.4]}
                  rotation={[Math.PI / 2, 0, Math.PI]}
                ></Svg>
                {false && (
                  <LineText
                    edgeId={item.pointId}
                    midPoint={[0, 0.01, 0]}
                    directionType={1}
                    fontSize={0.1}
                    color='white'
                  />
                )}
              </Suspense>
            </group>
          </>
        );
      })}
    </>
  );
};

export default HomePoint;
