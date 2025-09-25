import { useTranslation } from 'react-i18next';

import { GizmoHelper, GizmoViewport } from '@react-three/drei';
import AxesHelper from './axesHelper';
import CameraController from './cameraController';
import Ground from './ground';

// 3D 安全基础场景
const SafetyBase = (props: any) => {
  const { t } = useTranslation();

  return (
    <>
      <color attach='background' args={['black']} />
      <ambientLight intensity={1} color={'#ffffff'} />
      <directionalLight position={[3, 4, 2]} intensity={2} color='#ffffff' castShadow />

      <CameraController />
      <Ground />
      <AxesHelper />
      <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor='black' />
      </GizmoHelper>
    </>
  );
};

export default SafetyBase;
