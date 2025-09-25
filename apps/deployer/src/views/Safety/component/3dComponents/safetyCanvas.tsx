import { Canvas } from '@react-three/fiber';
import { useTranslation } from 'react-i18next';
const SafetyCanvas = (props: any) => {
  const { t } = useTranslation();

  return (
    <div className='w-full h-full flex flex-col'>
      <Canvas
        camera={{
          position: [10, 10, 10], // 相机位置调整为 Z 轴正方向
          fov: 30,
          near: 0.001,
          far: 100000,
        }}
        onCreated={({ camera, scene }) => {
          camera.lookAt(0, 0, 0); // 将相机朝向原点
          scene.rotation.x = -Math.PI / 2;
        }}
      >
        {props.children}
      </Canvas>
    </div>
  );
};

export default SafetyCanvas;
