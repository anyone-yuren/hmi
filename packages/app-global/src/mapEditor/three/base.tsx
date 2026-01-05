import { GizmoHelper, GizmoViewport, Grid, MapControls, OrthographicCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../store';
import { useMapEditorViewStore } from '../store/view';
import { THREE_LAYERS } from './constants/threeLayers';
import { useFlyToPointSpring } from './hooks/useFlyToPointSpring';
import { markUnpickable } from './utils/threeRaycaster';

function ResizeCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.OrthographicCamera;

    const frustumHeight = 10; // 世界坐标下可视高度（核心参数）
    const aspect = size.width / size.height;

    cam.top = frustumHeight / 2;
    cam.bottom = -frustumHeight / 2;
    cam.right = (frustumHeight * aspect) / 2;
    cam.left = (-frustumHeight * aspect) / 2;

    cam.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}
const BaseElement = ({ size }) => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  // 开启 draw / label / ui 层 可以被命中
  useEffect(() => {
    if (!camera) return;
    camera.layers.enable(THREE_LAYERS.DRAW);
    camera.layers.enable(THREE_LAYERS.LABEL);
    camera.layers.enable(THREE_LAYERS.UI);
  }, [camera]);
  const { gridVisible } = useMapEditorViewStore(
    useShallow((state) => {
      return {
        gridVisible: state.gridVisible,
      };
    }),
  );
  const { flyToPoint } = useMapEditorStore(
    useShallow((state) => ({
      flyToPoint: state.flyToPoint,
    })),
  );
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 1,
    cellColor: '#6f6f6f',
    sectionSize: 2,
    sectionThickness: 1,
    sectionColor: '#80808040',
    fadeDistance: 100,
    fadeStrength: 1,
    // infiniteGrid: true,
  };

  useFlyToPointSpring(controlsRef, flyToPoint);

  return (
    <>
      <color attach='background' args={['#3A3A3A']} />
      <group>
        {/* <PerspectiveCamera
          makeDefault
          position={[0, 0, 6]}
          up={[0, 0, 1]} // ✅ Z 轴向上
          fov={75}
          near={0.01}
          far={200}
        /> */}

        <OrthographicCamera makeDefault position={[0, 0, 10]} up={[0, 0, 1]} zoom={100} near={-100} far={100} />

        {/* <ResizeCamera size={size} /> */}
        {/* <ResizeCamera /> */}

        <MapControls
          enabled={true}
          enableRotate={false}
          screenSpacePanning={false}
          makeDefault
          maxDistance={50}
          minZoom={1}
          ref={controlsRef}
        />
        {/* <CameraControls
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
        /> */}

        {/* ✅ Grid 在 XY 平面 */}
        <Grid
          visible={gridVisible}
          args={[1000, 1000]}
          {...gridConfig}
          position={[0, 0, 0.01]}
          rotation={[Math.PI / 2, 0, 0]} // XZ → XY
          onUpdate={(grid) => {
            markUnpickable(grid);
          }}
        />

        <mesh position={[0, 0, 0.1]} layers={THREE_LAYERS.DRAW}>
          <boxGeometry args={[1, 1, 0.2]} />
          <meshStandardMaterial color='red' />
        </mesh>
        <ambientLight intensity={1} />
        {/* <MouseTracker /> */}
        <GizmoHelper
          alignment='bottom-right'
          margin={[80, 80]}
          onUpdate={(self?) => {
            markUnpickable(self);
          }}
        >
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='white' disabled={true} />
        </GizmoHelper>
      </group>
    </>
  );
};

export default BaseElement;
