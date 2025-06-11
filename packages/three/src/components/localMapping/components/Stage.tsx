import { Box, CameraControls, GizmoHelper, GizmoViewport, PerspectiveCamera, SoftShadows } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import BoundaryFloor from './BoundaryFloor';
import Shelf from './shelf';

function CameraController({ lookPosition, controlsRef }) {
  const { camera, gl, controls, scene } = useThree();
  const lightRef = useRef();
  const targetRef = useRef();

  useEffect(() => {
    // 把 target 对象加入场景
    if (targetRef.current) {
      scene.add(targetRef.current);
    }

    // 把 light 的 target 指向这个 mesh
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
  }, [scene]);

  useEffect(() => {
    // 设置 target 位置
    if (targetRef.current) {
      targetRef.current.position.set(lookPosition.x / 1000 + 0.2, 0, -lookPosition.y / 1000);
    }
  }, [lookPosition]);

  useEffect(() => {
    if (controlsRef.current) {
      requestAnimationFrame(() => {
        controlsRef.current.setLookAt(
          lookPosition.x / 1000,
          10,
          0 - lookPosition.y / 1000,
          lookPosition.x / 1000,
          0,
          0 - lookPosition.y / 1000,
          true,
        );
      });
    }
  }, [lookPosition]);

  return (
    <>
      <directionalLight
        ref={lightRef}
        castShadow
        intensity={3}
        position={[lookPosition.x / 1000, 10, -lookPosition.y / 1000]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <Box ref={targetRef} castShadow position={[0, 0, 0]} args={[0, 0, 0]} />
    </>
  );
}

export default function App({ mappingData }) {
  const {
    mapEdges,
    mapVertices,
    referencePoints,
    equipmentPoints = [],
    mapDrawBlocks = [],
    storageDatas = [],
    mapDrawAreas = [],
  } = mappingData;
  const cameraControlsRef = useRef();
  const { mapMinX, mapMaxX, mapMinY, mapMaxY } = mappingData?.mapOption || {};

  // 计算地图的位置（在三维空间中定位）
  const centerX = (mapMinX + mapMaxX) / 2;
  const centerY = (mapMinY + mapMaxY) / 2;

  const lookPosition = useMemo(() => {
    return { x: centerX, y: centerY };
  }, [centerX, centerY]);

  return (
    <Canvas
      shadows
      gl={{ antialias: true }}
      dpr={[1.5, 2]}
      onCreated={({ camera }) => {
        camera.position.set(lookPosition.x / 1000, 40, 0 - lookPosition.y / 1000);
      }}
    >
      <color attach='background' args={['white']} />
      <ambientLight intensity={2} />

      <SoftShadows size={10} samples={20} focus={0.5} />

      {/* 自己控制阴影接收面 */}
      {/* <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[lookPosition.x / 1000, 0, -lookPosition.y / 1000]}>
        <planeGeometry args={[1000, 1000]} />
        <shadowMaterial opacity={0.4} color={'black'} />
      </mesh> */}

      {/* 你的物体 */}
      <Box
        castShadow
        position={[0, 0, 0]}
        args={[100, 100, 100]}
        material={
          new THREE.MeshStandardMaterial({
            color: 'yellow',
            metalness: 0.7,
            roughness: 0.8,
            transparent: true,
            depthWrite: true,
          })
        }
      />
      <Shelf />

      <PerspectiveCamera
        // ref={cameraRef}
        makeDefault
        position={[lookPosition.x / 1000, 40, 0 - lookPosition.y / 1000]}
        fov={75}
        aspect={window.innerWidth / window.innerHeight}
        near={0.1}
        far={1000}
        zoom={1}
      />

      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        enabled={true}
        verticalDragToForward={false}
        dollyToCursor={false}
        infinityDolly={false}
        minDistance={1}
        maxDistance={500}
        //限制旋转
        // azimuthRotateSpeed={0}
        // polarRotateSpeed={0}
        // mouseButtons={{
        //   left: 2,
        //   right: 0,
        //   middle: 0,
        //   wheel: 16,
        // }}
      />

      <BoundaryFloor
        mapMaxX={mapMaxX}
        mapMaxY={mapMaxY}
        mapMinX={mapMinX}
        mapMinY={mapMinY}
        // referencePoints={referencePoints}
        referencePoints={[]}
        mapVertices={mapVertices}
      />

      {/* 👈 这个组件专门控制相机定位和朝向 */}
      <CameraController lookPosition={lookPosition} controlsRef={cameraControlsRef} />
      <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black' />
      </GizmoHelper>
    </Canvas>
  );
}
