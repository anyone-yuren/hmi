// SelectionOverlay3D.tsx
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useSelectionStore } from '../selection/selectionStore';
import { useBoxSelect } from './useBoxSelect';

export function SelectionOverlay3D() {
  const box = useBoxSelect();
  const { camera, gl, scene } = useThree();
  const { setCandidates, openFilter } = useSelectionStore(
    useShallow((store) => ({
      setCandidates: store.setCandidates,
      openFilter: store.openFilter,
    })),
  );

  const start = useRef<[number, number] | null>(null);
  const endRef = useRef<[number, number] | null>(null);
  const [dragging, setDragging] = useState(false);

  // 蓝色框 Line
  const lineRef = useRef<THREE.Line>(null!);

  const getMousePos = (e: React.PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top] as [number, number];
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const pos = getMousePos(e);
    start.current = pos;
    endRef.current = pos;
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    endRef.current = getMousePos(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!start.current || !endRef.current) return;
    const items = box.finish(start.current, endRef.current, e.shiftKey);
    setCandidates(items);
    openFilter();
    setDragging(false);
  };

  // 每帧更新 Line 顶点
  useFrame(() => {
    if (!dragging || !start.current || !endRef.current) return;

    const rect = gl.domElement.getBoundingClientRect();
    const corners = [
      [start.current[0], start.current[1]],
      [start.current[0], endRef.current[1]],
      [endRef.current[0], endRef.current[1]],
      [endRef.current[0], start.current[1]],
      [start.current[0], start.current[1]], // 闭合
    ];

    const positions: number[] = [];
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // XZ平面 Y=0
    const raycaster = new THREE.Raycaster();

    corners.forEach(([x, y]) => {
      const ndcX = (x / rect.width) * 2 - 1;
      const ndcY = -(y / rect.height) * 2 + 1;
      raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);

      const intersect = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersect);
      positions.push(intersect.x, intersect.y, intersect.z);
    });

    if (lineRef.current) {
      const lineGeom = lineRef.current.geometry as THREE.BufferGeometry;
      lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      lineGeom.computeBoundingSphere();
      lineGeom.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      <line ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color='#3b82f6' transparent opacity={0.3} linewidth={2} />
      </line>
    </group>
  );
}
