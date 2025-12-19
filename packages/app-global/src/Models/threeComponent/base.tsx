import { CameraControls, GizmoHelper, GizmoViewport, Grid, PerspectiveCamera, SoftShadows } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../store';
import PCDModel from './points/pcdCloud';
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

function SceneHelpers() {
  return (
    <>
      <axesHelper args={[5]} />
    </>
  );
}
const BaseElement = () => {
  const { camera, controls } = useThree();
  const { setCamera, setThreeControl } = useModelStore(
    useShallow((state) => {
      return {
        setCamera: state.setCamera,
        setThreeControl: state.setThreeControl,
      };
    }),
  );

  useEffect(() => {
    if (!controls) return;
    setCamera(camera);
    setThreeControl(controls);
  }, [camera, controls]);
  return (
    <>
      <ambientLight intensity={0.4} />
      {/* 主方向光 */}
      <directionalLight
        castShadow
        position={[0, 3, 0]}
        intensity={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* 补充光 */}
      <pointLight position={[-10, 10, -10]} intensity={0.5} />

      {/* 柔和的阴影 */}
      <SoftShadows size={25} samples={16} />

      <SceneHelpers />
      <Grid args={[100, 100]} {...gridConfig} />
      {/* <OrbitControls enablePan enableRotate enableZoom makeDefault /> */}
      <CameraControls
        makeDefault
        enabled={true}
        verticalDragToForward={false}
        dollyToCursor={false}
        infinityDolly={false}
        minDistance={1}
        maxDistance={100}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
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
      <PerspectiveCamera
        // ref={cameraRef}
        makeDefault
        fov={75}
        aspect={window.innerWidth / window.innerHeight}
        near={0.1}
        far={1000}
        zoom={1}
      />

      <Suspense fallback={null}>
        <PCDModel url='/static/pcd/radar-cloud.pcd' />
      </Suspense>

      {/* 添加坐标参考 */}
      <GizmoHelper
        alignment='bottom-right' // 显示位置
        margin={[80, 80]} // 距离边缘的间距（可调）
      >
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='white' />
      </GizmoHelper>
    </>
  );
};

export default BaseElement;
