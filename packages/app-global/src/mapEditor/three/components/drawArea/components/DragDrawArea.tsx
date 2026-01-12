// components/DragDrawArea.tsx
import { useThree } from '@react-three/fiber';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useAreaStore } from '../store/areaStore';

const MIN_SIZE = 5;

export function DragDrawArea() {
  const { camera, gl, controls } = useThree();
  const { mode, addArea, setMode, select } = useAreaStore(
    useShallow((s) => ({
      mode: s.mode,
      addArea: s.addArea,
      setMode: s.setMode,
      select: s.select,
    })),
  );

  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  const start = useRef<THREE.Vector3 | null>(null);
  const meshRef = useRef<THREE.Mesh>(null!);
  const [visible, setVisible] = useState(false);

  const getPoint = (e: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.current.setFromCamera(mouse.current, camera);
    const p = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane, p);
    return p;
  };

  const reset = () => {
    start.current = null;
    setVisible(false);
    meshRef.current.scale.set(0, 0, 1);
  };

  useEffect(() => {
    if (mode !== 'draw-area') return;

    const dom = gl.domElement;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      controls && (controls.enablePan = false);

      start.current = getPoint(e);
      meshRef.current.position.copy(start.current);
      meshRef.current.scale.set(0, 0, 1);
      setVisible(true);
    };

    const onMove = (e: MouseEvent) => {
      if (!start.current) return;
      const p = getPoint(e);
      const c = start.current;

      meshRef.current.position.set((p.x + c.x) / 2, (p.y + c.y) / 2, 0);
      meshRef.current.scale.set(Math.abs(p.x - c.x), Math.abs(p.y - c.y), 1);
    };

    const onUp = () => {
      if (!start.current) return;

      const { x, y } = meshRef.current.scale;

      const id = nanoid();
      const position = meshRef.current.position.clone();
      addArea({
        id,
        center: {
          x: position.x,
          y: position.y,
          z: position.z,
        },
        width: x,
        height: y,
        name: `区域${id}`,
      });

      reset();
      // controls && (controls.enablePan = true);

      // ⭐ 自动进入 select
      setMode('select');
      select([id]);
    };

    dom.addEventListener('mousedown', onDown);
    dom.addEventListener('mousemove', onMove);
    dom.addEventListener('mouseup', onUp);

    return () => {
      dom.removeEventListener('mousedown', onDown);
      dom.removeEventListener('mousemove', onMove);
      dom.removeEventListener('mouseup', onUp);
      controls && (controls.enablePan = true);
    };
  }, [mode]);

  return (
    <mesh ref={meshRef} visible={visible}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color='#339af0' transparent opacity={0.3} />
    </mesh>
  );
}
