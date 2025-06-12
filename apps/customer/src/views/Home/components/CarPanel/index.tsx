import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRequest } from 'ahooks';
import { Skeleton, Spin } from 'antd';
import { memo, Suspense } from 'react';
import { getSegmentsInfo } from '../../services';
import LocationPoint from '../point/locationPoint';
import RcsLines from './components/routeLiles';
import StageBase from './components/stageBase';
const CarStage = () => {
  const { data: routeLinesData, loading: routeLinesLoading } = useRequest(getSegmentsInfo);
  return (
    <Suspense fallback={<Spin />}>
      {routeLinesLoading ? (
        <Skeleton.Button active className='!h-full !w-full' />
      ) : (
        <Canvas
          dpr={[1, 2]}
          // scene={{
          //   fog: new Fog("#fff", 3, 6),
          // }}
        >
          <color attach='background' args={['#445260']} />
          <CameraControls
            makeDefault
            minDistance={2}
            maxDistance={10}
            maxPolarAngle={Math.PI / 4}
            minAzimuthAngle={0}
            maxAzimuthAngle={Math.PI}
            minPolarAngle={0}
          />
          <PerspectiveCamera
            // ref={cameraRef}
            makeDefault
            position={[0, 4, 0]}
            castShadow
            fov={60}
            near={0.1}
            far={100}
            zoom={1}
          />
          {/* <Stage
          intensity={1}
          preset="rembrandt"
          shadows={{
            type: "contact",
            color: "skyblue",
            colorBlend: 2,
            opacity: 1,
          }}
          adjustCamera={1}
        > */}
          <Suspense>
            {/* <Car /> */}
            <LocationPoint />
            {routeLinesData?.length ? <RcsLines mapEdges={routeLinesData} /> : null}
            {/* <ActiveLine /> */}
          </Suspense>
          <StageBase />
          {/* </Stage> */}
          {/* <Gltf castShadow receiveShadow src="Perseverance-transformed.glb" /> */}
          {/* <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport
            axisColors={["red", "green", "blue"]}
            labelColor="black"
          />
        </GizmoHelper> */}
        </Canvas>
      )}
    </Suspense>
  );
};

export default memo(CarStage);
