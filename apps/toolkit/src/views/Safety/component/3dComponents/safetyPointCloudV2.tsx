import { useSafetyStore } from '@/views/Safety/store/safety.store';
import { Sphere } from '@react-three/drei';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';

function SafetyPointCloudV2() {
  const { sensorPoints, obsInfo } = useSafetyStore(
    useShallow((store) => ({
      sensorPoints: store.sensorPoints,
      obsInfo: store.obsInfo,
    })),
  );

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [positions, setPositions] = useState<Float32Array>(new Float32Array());
  const workerRef = useRef<Worker>();

  // 高亮点（红球）
  const activePoint = useMemo<[number, number, number]>(
    () => [obsInfo?.x || 0, obsInfo?.y || 0, obsInfo?.z || 0],
    [obsInfo?.x, obsInfo?.y, obsInfo?.z],
  );

  // 初始化 worker
  useEffect(() => {
    workerRef.current = new Worker(new URL('./pointWorker.ts', import.meta.url), { type: 'module' });
    workerRef.current.onmessage = (e) => {
      setPositions(e.data as Float32Array);
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // sensorPoints 每次变化 → 丢给 worker 处理
  useEffect(() => {
    if (!workerRef.current) return;
    workerRef.current.postMessage(sensorPoints);
  }, [sensorPoints]);

  useEffect(() => {
    if (!meshRef.current || positions.length === 0) return;
    console.time(`render position`);
    const mesh = meshRef.current;
    const dummy = new THREE.Object3D();
    const count = positions.length / 3;
    for (let i = 0; i < count; i++) {
      dummy.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.count = count;
    mesh.instanceMatrix.needsUpdate = true; // ⚠️ 必须
    console.timeEnd(`render position`);
  }, [positions]);

  return (
    <>
      {/* 红色的活动点 */}
      <Sphere args={[0.1, 16, 16]} position={activePoint}>
        <meshBasicMaterial color={'red'} transparent opacity={0.8} />
      </Sphere>

      {/* instancedMesh 渲染所有点 */}
      <instancedMesh ref={meshRef} args={[undefined, undefined, 1000000]}>
        {/* 小球的基础几何 */}
        <sphereGeometry args={[0.02, 8, 8]}>
          {/* Shader 支持 instancePosition 偏移 */}
          <shaderMaterial
            attach='material'
            args={[
              {
                vertexShader: `
                  attribute vec3 instancePosition;
                  void main() {
                    vec3 transformed = position + instancePosition;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
                  }
                `,
                fragmentShader: `
                  void main() {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.8);
                  }
                `,
                transparent: true,
              },
            ]}
          />
        </sphereGeometry>
      </instancedMesh>
    </>
  );
}

export default memo(SafetyPointCloudV2);
