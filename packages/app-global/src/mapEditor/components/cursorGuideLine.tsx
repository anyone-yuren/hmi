import { Line } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePickOnXYPlane } from '../hooks/usePickOnXYPanel';

function CursorGuideLine() {
  const pick = usePickOnXYPlane();
  const [pos, setPos] = useState<THREE.Vector3 | null>(null);
  const { gl } = useThree();

  // 使用ref存储最新的鼠标位置，避免state更新延迟
  const mousePosRef = useRef<THREE.Vector3 | null>(null);

  // 使用requestAnimationFrame来同步更新
  const rafRef = useRef<number>();

  useEffect(() => {
    const updatePosition = () => {
      if (mousePosRef.current) {
        setPos(mousePosRef.current.clone());
      }
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    rafRef.current = requestAnimationFrame(updatePosition);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const p = pick(e);
      if (!p) return;
      // 直接更新ref，不触发渲染
      mousePosRef.current = p;
    };

    const canvas = gl.domElement;
    canvas.addEventListener('mousemove', onMove);

    return () => {
      canvas.removeEventListener('mousemove', onMove);
    };
  }, [gl, pick]);

  if (!pos) return null;

  return (
    <>
      {/* 横线 - 直接使用最新位置，无动画 */}
      <Line
        points={[
          [-500, pos.y, 0.01],
          [500, pos.y, 0.01],
        ]}
        color='#3b82f6'
        lineWidth={1}
        transparent
        opacity={0.4}
      />
      {/* 纵线 */}
      <Line
        points={[
          [pos.x, -500, 0.01],
          [pos.x, 500, 0.01],
        ]}
        color='#22c55e'
        lineWidth={1}
        transparent
        opacity={0.4}
      />
      {/* 坐标文字 - 使用普通Html，无动画 */}
      {/* <Html position={[pos.x, pos.y + 0.01, 0.01]}>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            transform: 'translate(-50%, -100%)', // 让文字在交点上方居中
            pointerEvents: 'none',
          }}
        >
          x: {pos.x.toFixed(2)}, y: {pos.y.toFixed(2)}
        </div>
      </Html> */}
    </>
  );
}

export default CursorGuideLine;
