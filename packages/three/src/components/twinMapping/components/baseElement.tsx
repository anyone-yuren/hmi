import { useRcsGlobalStore } from '@gbeata/store';
import { Box, CameraControls, Environment, PerspectiveCamera, Sky } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type { FC } from 'react';
import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { type DirectionalLight, type OrthographicCamera, Vector3 } from 'three';
import { useShallow } from 'zustand/react/shallow';

import { theme } from 'antd';
// import platz_1km from '../assets/potsdamer_platz_1k.hdr';

const { DEG2RAD } = THREE.MathUtils;

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
        position={[lookPosition.x / 1000, 400, -lookPosition.y / 1000]}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-radius={12}
        shadow-bias={-0.001}
      />
      <Box ref={targetRef} castShadow position={[0, 0, 0]} args={[0, 0, 0]} />
    </>
  );
}

const BasicElements: FC<any> = (props: { mapSize: any; mapOptions: any; referencePoints: any }) => {
  const { mapSize, mapOptions, referencePoints } = props;
  const { token } = theme.useToken();
  const { camera, controls } = useThree();
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

  const cameraControlsRef = useRef<CameraControls>(null);

  const { setCameraControls } = useRcsGlobalStore(
    useShallow((state) => ({
      setCameraControls: state.setCameraControls,
    })),
  );

  useEffect(() => {
    if (controls) {
      setCameraControls(controls);
    }
  }, [controls, setCameraControls]);

  const showTools = false;
  const directionalLightRef = useRef<DirectionalLight>(null!);
  const directionLightCameraRef = useRef<OrthographicCamera>(null!);

  // 设置网格样式
  const gridConfig = {
    cellSize: 10, //单个小格子的边长（单位通常是 Three.js 世界单位）
    cellThickness: 1, //小格子线条的粗细
    cellColor: token.colorBgElevated, //小格子线条的颜色
    sectionSize: 100, //大格子的大小（单位通常是 Three.js 世界单位）
    sectionThickness: 1.2, //大格子线条的粗细
    sectionColor: token.colorBgElevated, //大格子线条的颜色
    fadeDistance: 1000, //开启渐隐时的最大可见距离，超过这个距离开始渐隐
    fadeStrength: 1, //渐隐的强度，0 表示完全不透明，1 表示完全透明
  };

  const lightTarget = new Vector3(lookPosition.x / 1000, 3, 0 - lookPosition.y / 1000); // You can adjust this target to your needs
  useEffect(() => {
    if (directionalLightRef.current) {
      directionalLightRef.current.target.position.set(lightTarget.x, lightTarget.y, lightTarget.z);
      directionalLightRef.current.target.updateMatrixWorld();
    }
    setTimeout(() => {
      cameraControlsRef.current?.setLookAt(
        lookPosition.x / 1000,
        20,
        0 - lookPosition.y / 1000,
        lookPosition.x / 1000,
        0,
        0 - lookPosition.y / 1000,
        true,
      );
    }, 100);
  }, [lightTarget, lookPosition]);
  return (
    <group>
      <Sky
        distance={450000}
        sunPosition={[10, 1000, 10]}
        mieCoefficient={0.01}
        // rayleigh={0.3}
        inclination={0}
        azimuth={0.25}
      />
      {/* 网格 */}
      {/* {<Grid args={[10000, 10000]} position={[0, -1, 0]} {...gridConfig} />} */}
      {/* 轨道控制器 */}
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
      {/* {showAxes && <axesHelper args={[100]} />} */}
      {/* 灯光 */}
      {/* <ambientLight color='#fff' intensity={1} /> */}
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
      <CameraController lookPosition={lookPosition} controlsRef={cameraControlsRef} />
      {/* <Environment preset={undefined} /> */}
      <Environment files={`${import.meta.env.DEV ? '/' : '/wms-pc/'}potsdamer_platz_1k.hdr`} background={false} />
    </group>
  );
};

export default memo(BasicElements);
