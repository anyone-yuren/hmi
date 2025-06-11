import { SpotLight, useDepthBuffer } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Vector3 } from 'three';

function MovingSpot({ vec = new Vector3(), distance = 60, intensity = 20, ...props }) {
  const light = useRef();
  const [currentDistance, setCurrentDistance] = useState(distance);
  const [currentIntensity, setCurrentIntensity] = useState(intensity);

  // useFrame((state) => {
  //   // 根据鼠标位置动态调整距离和强度
  //   const mouseDistance = (state.mouse.x * state.viewport.width) / 2;
  //   const mouseIntensity = 2 + state.mouse.y * 5; // 基于鼠标 Y 轴调整强度

  //   setCurrentDistance(mouseDistance); // 动态设置距离
  //   setCurrentIntensity(mouseIntensity); // 动态设置强度

  //   // 更新光源的目标位置
  //   light.current.target.position.lerp(
  //     vec.set((state.mouse.x * state.viewport.width) / 2, (state.mouse.y * state.viewport.height) / 2, 0),
  //     0.1,
  //   );
  //   light.current.target.updateMatrixWorld();
  // });

  return (
    <SpotLight
      castShadow
      ref={light}
      penumbra={0}
      distance={currentDistance} // 使用动态设置的距离
      intensity={currentIntensity} // 使用动态设置的强度
      angle={0.8}
      attenuation={5}
      anglePower={4}
      {...props}
    />
  );
}

const MouseSpotLight = () => {
  const depthBuffer = useDepthBuffer({ frames: 20 });
  return (
    <>
      <MovingSpot depthBuffer={depthBuffer} color='#0c8cbf' position={[10, 10, 10]} />
      <MovingSpot depthBuffer={depthBuffer} color='#b00c3f' position={[20, 10, 10]} />
    </>
  );
};

export default MouseSpotLight;
