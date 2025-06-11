import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { type DirectionalLight, type OrthographicCamera, Vector3 } from 'three';
import { useShallow } from 'zustand/react/shallow';

import { useRcsGlobalStore } from '@gbeata/store';
import type { FC } from 'react';

const { DEG2RAD } = THREE.MathUtils;

const BasicElements: FC<any> = (props: { mapSize: any; mapOptions: any; referencePoints: any }) => {
  const { mapSize, mapOptions, referencePoints } = props;

  const firstReferencePoint = useMemo(() => {
    if (referencePoints && referencePoints.length > 0) {
      return referencePoints.find((item: any) => item.layer === 1);
    }
    return null;
  }, [referencePoints]);

  const { center, width, height } = mapSize;

  const lookPosition = useMemo(() => {
    if (firstReferencePoint) {
      return firstReferencePoint.referencePoint;
    }
    return center;
  }, [firstReferencePoint, center]);

  const { mapMaxX, mapMaxY, mapMinX, mapMinY } = mapOptions;

  const { camera } = useThree();
  const cameraControlsRef = useRef<CameraControls>(null);

  const { setCameraControls } = useRcsGlobalStore(
    useShallow((state) => ({
      setCameraControls: state.setCameraControls,
    })),
  );

  useEffect(() => {
    if (cameraControlsRef.current) {
      setCameraControls(cameraControlsRef.current);
    }
  }, [cameraControlsRef, setCameraControls]);

  // // 使用useRef获取camera的引用
  // const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // // 使用useHelper来显示相机的视锥体
  // useHelper(cameraRef, THREE.CameraHelper);

  // 使用useHelper来显示相机的视锥体

  // 平行光调试
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const showTools = false;
  const directionalLightRef = useRef<DirectionalLight>(null!);
  // useHelper(directionalLightRef, THREE.DirectionalLightHelper, 2);
  // const { showAxes, showGrid, minDistance, enabled, verticalDragToForward, dollyToCursor, infinityDolly } = useControls(
  //   {
  //     thetaGrp: buttonGroup({
  //       label: 'rotate theta',
  //       opts: {
  //         '+45º': () => cameraControlsRef.current?.rotate(45 * DEG2RAD, 0, true),
  //         '-90º': () => cameraControlsRef.current?.rotate(-90 * DEG2RAD, 0, true),
  //         '+360º': () => cameraControlsRef.current?.rotate(360 * DEG2RAD, 0, true),
  //       },
  //     }),
  //     phiGrp: buttonGroup({
  //       label: 'rotate phi',
  //       opts: {
  //         '+20º': () => cameraControlsRef.current?.rotate(0, 20 * DEG2RAD, true),
  //         '-40º': () => cameraControlsRef.current?.rotate(0, -40 * DEG2RAD, true),
  //       },
  //     }),
  //     truckGrp: buttonGroup({
  //       label: 'truck',
  //       opts: {
  //         '(1,0)': () => cameraControlsRef.current?.truck(1, 0, true),
  //         '(0,1)': () => cameraControlsRef.current?.truck(0, 1, true),
  //         '(-1,-1)': () => cameraControlsRef.current?.truck(-1, -1, true),
  //       },
  //     }),
  //     dollyGrp: buttonGroup({
  //       label: 'dolly',
  //       opts: {
  //         '1': () => cameraControlsRef.current?.dolly(1, true),
  //         '-1': () => cameraControlsRef.current?.dolly(-1, true),
  //       },
  //     }),
  //     zoomGrp: buttonGroup({
  //       label: 'zoom',
  //       opts: {
  //         '/2': () => cameraControlsRef.current?.zoom(camera.zoom / 2, true),
  //         '/-2': () => cameraControlsRef.current?.zoom(-camera.zoom / 2, true),
  //       },
  //     }),
  //     minDistance: { value: 0 },
  //     showGrid: true,
  //     showAxes: false,
  //     setLookAt: folder(
  //       {
  //         vec4: { value: [lookPosition.x / 1000, 100, 0 - lookPosition.y / 1000], label: 'position' },
  //         vec5: { value: [lookPosition.x / 1000, 0, 0 - lookPosition.y / 1000], label: 'target' },
  //         'setLookAt(…position, …target)': button((get) =>
  //           cameraControlsRef.current?.setLookAt(...get('setLookAt.vec4'), ...get('setLookAt.vec5'), true),
  //         ),
  //       },
  //       { collapsed: true },
  //     ),
  //     minDistance: { value: 0 },
  //     moveTo: folder(
  //       {
  //         vec1: { value: [3, 5, 2], label: 'vec' },
  //         'moveTo(…vec)': button((get) => cameraControlsRef.current?.moveTo(...get('moveTo.vec1'), true)),
  //       },
  //       { collapsed: true },
  //     ),
  //     enabled: { value: true, label: 'controls on' },
  //     verticalDragToForward: { value: false, label: 'vert. drag to move forward' },
  //     dollyToCursor: { value: false, label: 'dolly to cursor' },
  //     infinityDolly: { value: false, label: 'infinity dolly' },
  //     animateToPosition: button(() => {}),
  //     animateLookAt: button((get) => {
  //       // animateLookAt([center.x / 1000, 0, center.y / 1000], 1500); // 视线调整到地图中心
  //       cameraControlsRef.current?.setLookAt(...get('setLookAt.vec4'), ...get('setLookAt.vec5'), true);
  //     }),
  //   },
  // );
  // const directionLightControls = useControls('directionLight', {
  //   position: [convertToMeters(lookPosition.x), convertToMeters(50000), convertToMeters(0 - lookPosition.y)],
  //   intensity: 2.5,
  // });
  // 平行光阴影调试
  const directionLightCameraRef = useRef<OrthographicCamera>(null!);
  // useHelper(directionLightCameraRef, THREE.CameraHelper);

  // 设置网格样式
  const gridConfig = {
    cellSize: 1,
    cellThickness: 0.5,
    cellColor: '#9d4b4b',
    sectionSize: 10,
    sectionThickness: 1,
    sectionColor: '#9d4b4b',
    fadeDistance: 300,
    fadeStrength: 1,
  };

  const lightTarget = new Vector3(lookPosition.x / 1000, 3, 0 - lookPosition.y / 1000); // You can adjust this target to your needs
  useEffect(() => {
    if (directionalLightRef.current) {
      directionalLightRef.current.target.position.set(lightTarget.x, lightTarget.y, lightTarget.z);
      directionalLightRef.current.target.updateMatrixWorld();
    }
    cameraControlsRef.current?.setLookAt(
      lookPosition.x / 1000,
      100,
      0 - lookPosition.y / 1000,
      lookPosition.x / 1000,
      0,
      0 - lookPosition.y / 1000,
      true,
    );
  }, [lightTarget]);
  return (
    <group>
      {/* <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} /> */}
      {/* 网格 */}
      {/* {<Grid args={[1000, 1000]} position={[0, -1, 0]} {...gridConfig} />} */}
      {/* 轨道控制器 */}
      <CameraControls
        ref={cameraControlsRef}
        minDistance={0}
        makeDefault
        enabled={true}
        verticalDragToForward={false}
        dollyToCursor={false}
        infinityDolly={false}
      />
      {/* {showAxes && <axesHelper args={[100]} />} */}

      {/* 灯光 */}
      <ambientLight color='#fff' intensity={1} />
      {/* <directionalLight
        castShadow
        ref={directionalLightRef}
        color='#fff'
        intensity={directionLightControls.intensity}
        position={directionLightControls.position}
        shadow-mapSize-width={2048} // 设置阴影的分辨率
        shadow-mapSize-height={2048}
      ></directionalLight> */}
      {/* <directionalLight
        castShadow
        ref={directionalLightRef}
        color='#fff'
        intensity={directionLightControls.intensity}
        position={directionLightControls.position}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          ref={directionLightCameraRef}
          attach='shadow-camera'
          left={-100}
          right={100}
          top={100}
          bottom={-100}
          near={30}
          far={100}
        ></orthographicCamera>
      </directionalLight> */}

      <PerspectiveCamera
        // ref={cameraRef}
        makeDefault
        position={[lookPosition.x / 1000, 100, lookPosition.y / 1000]}
        fov={75}
        aspect={window.innerWidth / window.innerHeight}
        near={0.1}
        far={1000}
        zoom={1}
      />
      {/* 光线挺影响性能的 */}
      {/* <pointLight
        castShadow
        position={directionLightControls.position}
        decay={0}
        intensity={Math.PI}
        color={'#fff'}
      ></pointLight> */}
      {/* <MouseSpotLight /> */}
      {/* <PerformanceMonitor /> */}
      {/* <Particles count={100} /> */}
    </group>
  );
};

export default memo(BasicElements);
