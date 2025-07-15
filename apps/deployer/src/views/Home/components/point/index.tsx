import { Clone, Text } from '@react-three/drei'; // 引入 Text 组件
import { extend } from '@react-three/fiber';
import { useMemo } from 'react';
import { CylinderGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';

import { convertToMeters } from '../CarPanel/components/car';
import CanvasText from './cavansText';

extend({ Text });

// 平库点
interface IWarehousePointProps {
  mapVertices: any[];
}

const BasePoint = (props: IWarehousePointProps) => {
  const { mapVertices } = props;
  if (!mapVertices) {
    return null;
  }
  // 创建共享的几何体和材质，并组装成一个 Mesh 对象
  const baseMesh = useMemo(() => {
    const geometry = new CylinderGeometry(0.05, 0.05, 0.05, 32);
    const material = new MeshStandardMaterial({
      color: '#00ff00',
      transparent: true,
    });
    return new Mesh(geometry, material); // 返回一个 Mesh 对象
  }, []);
  return (
    <>
      {mapVertices?.map((item) => {
        const position = new Vector3(convertToMeters(item.x), 0.025, convertToMeters(item.y));
        return (
          <>
            <group key={item.id} position={position}>
              <Clone object={baseMesh} />
              {/* <LineText
                edgeId={item.id}
                position={[0, 0.03, -0.1]}
                directionType={1}
                fontSize={0.2}
                color="white"
              /> */}
              <CanvasText text={item.id} position={[0, 0.03, -0.1]} />
            </group>
          </>
        );
      })}
    </>
  );
};

export default BasePoint;
