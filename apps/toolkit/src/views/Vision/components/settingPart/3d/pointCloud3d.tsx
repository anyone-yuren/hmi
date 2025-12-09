import { GizmoHelper, GizmoViewport } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { memo, Suspense } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useVisionStore } from '../../../store/vision.store';
import CameraController from '../3d/cameraController';
import Axes from './axes';
import Ground from './ground';
import Lights from './lights';

interface IProps {
  params: any[];
}
function PointCloud3D(props: IProps) {
  const { params } = props;

  const { pointCloud } = useVisionStore(
    useShallow((store: any) => ({
      pointCloud: store.pointCloud,
    })),
  );

  const pointGeometry = React.useMemo(() => {
    const positions: any = [];
    const colors: any = [];
    pointCloud.forEach((point: any) => {
      positions.push(point[0], point[1], point[2]);
      const intensity = point[3];
      const color = new THREE.Color(1, 1 - intensity / 100, 1 - intensity / 100); // 颜色从蓝色到红色
      colors.push(color.r, color.g, color.b);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geometry;
  }, [pointCloud]);

  return (
    <>
      <Canvas
        camera={{
          position: [0, -40, 10],
          fov: 30,
          near: 0.01,
          far: 100000,
        }}
        onCreated={({ camera }) => {
          camera.lookAt(0, 0, 0); // 将相机朝向原点
        }}
      >
        <color attach='background' args={['#393838']} />
        <CameraController />
        <fog attach='fog' args={['black', 100, 10000]} />
        <Lights />
        <Ground />
        <Suspense fallback={null}>
          <points>
            <bufferGeometry attach='geometry' {...pointGeometry} />
            <pointsMaterial attach='material' size={0.1} vertexColors={true} />
          </points>

          <points>
            <bufferGeometry>
              <bufferAttribute
                attach='attributes-position'
                count={1}
                itemSize={3}
                array={new Float32Array([1, 2, 3])}
              />
            </bufferGeometry>
            <pointsMaterial attach='material' color='red' size={0.2} />
          </points>
        </Suspense>
        <Axes />
        <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black' />
        </GizmoHelper>
      </Canvas>
    </>
  );
}

export default memo(PointCloud3D);
