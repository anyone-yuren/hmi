// components/DragDrawArea.tsx
import { useThree } from '@react-three/fiber';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePolygonStore } from '../store/polygonStore';

const MIN_SIZE = 5;

export function DragDrawPolygon() {
  const { camera, gl, controls } = useThree();
  const { mode, addPolygon, setMode, select } = usePolygonStore(
    useShallow((s) => ({
      mode: s.mode,
      addPolygon: s.addPolygon,
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
    const result = raycaster.current.ray.intersectPlane(plane, p);
    
    if (!result || !Number.isFinite(p.x) || !Number.isFinite(p.y)) {
      return null;
    }
    return p;
  };

  const reset = () => {
    start.current = null;
    setVisible(false);
    meshRef.current.scale.set(0, 0, 1);
  };

  useEffect(() => {
    if (mode !== 'draw-polygon') return;

    const dom = gl.domElement;

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      controls && ((controls as any).enablePan = false);

      const p = getPoint(e);
      if (!p) return;

      start.current = p;
      meshRef.current.position.copy(start.current);
      meshRef.current.scale.set(0, 0, 1);
      setVisible(true);
    };

    const onMove = (e: MouseEvent) => {
      if (!start.current) return;
      const p = getPoint(e);
      if (!p) return;

      const c = start.current;

      meshRef.current.position.set((p.x + c.x) / 2, (p.y + c.y) / 2, 0.05);
      meshRef.current.scale.set(Math.abs(p.x - c.x), Math.abs(p.y - c.y), 1);
    };

    const onUp = () => {
      if (!start.current) return;

      const { x, y } = meshRef.current.scale;

      const id = nanoid();
      const position = meshRef.current.position.clone();
      addPolygon({
        id,
        center: new THREE.Vector3(position.x, position.y, position.z),
        width: x,
        height: y,
        name: `区域${id}`,
      });

      reset();
      // controls && ((controls as any).enablePan = true);

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
      controls && ((controls as any).enablePan = true);
    };
  }, [mode]);

  return (
    <mesh ref={meshRef} visible={visible} position={[0, 0, 0.05]} renderOrder={1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color='#60a5fa' transparent opacity={0.3} depthTest={false} />
    </mesh>
  );
}
