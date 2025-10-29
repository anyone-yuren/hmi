import { Base, Geometry, Subtraction } from '@react-three/csg';
import React from 'react';

const SafetyPallet = () => {
  return (
    <>
      <mesh key='pallet' castShadow receiveShadow position={[-0.05, 0.03, 0]}>
        <Geometry>
          <Base>
            <boxGeometry args={[1, 0.2, 1]} />
          </Base>
          <Subtraction position={[0, -0.12, 0]}>
            <boxGeometry args={[1, 0.3, 0.8]} />
          </Subtraction>
        </Geometry>
        <meshStandardMaterial color='#D2B48C' transparent opacity={0.8} depthTest={false} depthWrite={false} />
      </mesh>
      <mesh key='goods' castShadow receiveShadow position={[-0.05, 0.03 + 0.5 + 0.1, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color='#00d1d1' transparent opacity={0.8} depthTest={false} depthWrite={false} />
      </mesh>
    </>
  );
};
export default React.memo(SafetyPallet);
