import { Line, Text } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
const Axes = () => {
  const createAxis = (points: any, color: any) => {
    return (
      <Line
        points={points} // Array of Vector3
        color={color} // Color
        lineWidth={2} // Line width
        dashed={false} // Whether the line is dashed
      />
    );
  };

  return (
    <>
      {createAxis([new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 0, 0)], 'red')}
      {createAxis([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 2, 0)], 'green')}
      {createAxis([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 2)], 'blue')}

      {false && (
        <Suspense fallback={null}>
          <Text position={[2, 0, 0]} color='red' fontWeight='bold' fontSize={1} anchorX='center' anchorY='middle'>
            X
          </Text>
          <Text position={[0, 2, 0]} color='green' fontWeight='bold' fontSize={1} anchorX='center' anchorY='middle'>
            Y
          </Text>
          <Text position={[0, 0, 2]} color='blue' fontWeight='bold' fontSize={1} anchorX='center' anchorY='middle'>
            Z
          </Text>
        </Suspense>
      )}
    </>
  );
};
export default Axes;
