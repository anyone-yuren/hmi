import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useRequest } from 'ahooks';
import { Skeleton, Spin } from 'antd';
import { memo, Suspense } from 'react';
import { getSegmentsInfo, getVehicleShape } from '../../services';
import PageException from '../ErrorPage';
import LocationPoint from '../point/locationPoint';
import Car from './components/car';
import MxwCar from './components/device';
import RcsLines from './components/routeLiles';
import StageBase from './components/stageBase';
const CarStage = () => {
  const { data: routeLinesData, loading: routeLinesLoading } = useRequest(getSegmentsInfo);
  const { data: vehicleShapeData, loading: vehicleShapeLoading } = useRequest(getVehicleShape);

  return (
    <Suspense fallback={<Spin />}>
      {routeLinesLoading ? (
        <Skeleton.Button active className='!h-full !w-full' />
      ) : routeLinesData?.data ? (
        <Canvas
          dpr={[1, 2]}
          gl={{
            alpha: true,
          }}
          shadows
          // scene={{
          //   fog: new Fog("#fff", 3, 6),
          // }}
        >
          <color attach='background' args={['#000d0f']} />
          {/* <Environment files='/textures/abandoned_factory_canteen_01_1k.hdr' background /> */}
          {/* <ambientLight intensity={0.3} /> */}
          {/* <pointLight position={[0, 5, 0]} intensity={1.5} color='#ffffff' /> */}
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
          {/* <spotLight position={[2, 8, 2]} angle={0.3} penumbra={0.5} intensity={2} castShadow /> */}
          {/* <Sky sunPosition={[100, 20, 10]} /> */}
          <CameraControls
            makeDefault
            minDistance={2}
            maxDistance={30}
            // maxPolarAngle={Math.PI / 4}
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
          <Car />
          <MxwCar />
          {/* <RouteWind
            tubularSegments={80}
            radius={0.05}
            windAmplitude={0.01}
            windFrequency={0.1}
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
          /> */}
          <LocationPoint />
          {routeLinesData?.data?.length ? <RcsLines mapEdges={routeLinesData?.data} /> : null}
          {/* <ActiveLine /> */}
          <StageBase />
          {/* </Stage> */}
          {/* <Gltf castShadow receiveShadow src="Perseverance-transformed.glb" /> */}
          {/* <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
            <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black' />
          </GizmoHelper> */}
        </Canvas>
      ) : (
        <PageException status={401} />
      )}
    </Suspense>
  );
};

export default memo(CarStage);
