import { OrbitControls, Sphere } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import React, { Suspense } from 'react';

const Sun = () => {
  return (
    <Suspense fallback={null}>
      {/* 太阳的轨道 */}
      <OrbitControls enableDamping={true} dampingFactor={0.05} enablePan={false} maxPolarAngle={Math.PI / 2} />

      {/* 太阳球体 */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        {/* 使用 meshBasicMaterial 发光 */}
        <meshBasicMaterial />
      </Sphere>

      {/* 从太阳发出的点光源 */}
      <pointLight
        position={[0, 0, 0]} // 光源与太阳位置相同
        intensity={5} // 光线强度
        distance={10} // 光线的衰减范围
        decay={2} // 衰减速度
        color='yellow' // 光线颜色
      />

      {/* 发光效果后期处理 */}
      <EffectComposer>
        <Bloom
          intensity={2} // 控制发光强度
          luminanceThreshold={0.1} // 发光亮度阈值
          luminanceSmoothing={0.3} // 光晕平滑度
          blendFunction={BlendFunction.ADD} // 发光的混合模式
        />
      </EffectComposer>
    </Suspense>
  );
};

export default Sun;
