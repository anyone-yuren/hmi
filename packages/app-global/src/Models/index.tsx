import { Grid, Html, OrbitControls } from '@react-three/drei';
import { Canvas, MeshProps } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import O15Model from './components/o15Model';
import O30Model from './components/o30Model';
import Sl14Model from './components/sl14Model';
import Fork15lift from './components/sl15Model';
import X20Model from './components/x20Model';
import X20sModel from './components/x20sModel';

interface RightTriangularPrismProps extends MeshProps {
  width?: number; // 直角三角形一条直角边长度 (X 方向)
  height?: number; // 直角三角形另一条直角边长度 (Y 方向)
  depth?: number; // 拉伸深度 (Z 方向)
  color?: string | number;
}

function SceneHelpers() {
  return (
    <>
      <axesHelper args={[5]} />
    </>
  );
}

export default function R3FBasicScene() {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.8,
    cellColor: '#808080',
    sectionSize: 2,
    sectionThickness: 1,
    sectionColor: '#808080',
    fadeDistance: 100,
    fadeStrength: 1,
  };

  return (
    <div className='w-full h-screen'>
      <Canvas
        shadows
        gl={{ antialias: true }}
        camera={{ position: [10, 10, 15], fov: 50, near: 0.1, far: 1000 }}
        onCreated={({ scene }) => {
          scene.fog = new THREE.FogExp2('#cfd8dc', 0.02); // 更柔和的雾效
        }}
      >
        <color attach='background' args={['#000d0f']} />
        <Suspense fallback={<Html center>Loading...</Html>}>
          <ambientLight intensity={0.35} />
          <directionalLight
            castShadow
            position={[5, 8, 5]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          <SceneHelpers />
          <Grid args={[100, 100]} {...gridConfig} />

          {/* <Forklift /> */}
          <Sl14Model />
          <X20Model />
          <X20sModel />
          <Fork15lift />
          {/* <O15Car /> */}
          <O15Model />
          <O30Model />
          <OrbitControls enablePan enableRotate enableZoom />
        </Suspense>
      </Canvas>
    </div>
  );
}
