import { TrackballControls } from '@react-three/drei';
import { memo } from 'react';

const CameraController = memo(() => {
  return (
    <TrackballControls
      noZoom={false}
      minDistance={1}
      maxDistance={1000}
      zoomSpeed={0.15}
      rotateSpeed={0.5}
      dynamicDampingFactor={0.1}
      panSpeed={0.1}
    />
  );
});

export default CameraController;
