import { GizmoHelper, GizmoViewport, Grid, MapControls, OrthographicCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { SelectionOverlayBox } from '../selection/selectionOverlay';

function ResizeCamera({ size }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!size) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }, [size, camera]);

  return null;
}
const BaseElement = ({ size }) => {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.8,
    cellColor: '#80808040',
    sectionSize: 2,
    sectionThickness: 1,
    sectionColor: '#80808080',
    fadeDistance: 100,
    fadeStrength: 1,
  };

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

        <ResizeCamera size={size} />

        <MapControls enabled={true} enableRotate={false} screenSpacePanning={false} makeDefault maxDistance={50} />

        {/* ✅ Grid 在 XY 平面 */}
        <Grid
          args={[1000, 1000]}
          {...gridConfig}
          position={[0, 0, 0.01]}
          rotation={[Math.PI / 2, 0, 0]} // XZ → XY
        />

        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[1, 1, 0.2]} />
          <meshStandardMaterial color='red' />
        </mesh>
        <ambientLight intensity={1} />
        {/* <MouseTracker /> */}
        <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
          <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='white' disabled={true} />
        </GizmoHelper>
      </group>
      <SelectionOverlayBox />
    </>
  );
};

export default BaseElement;
