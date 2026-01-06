import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { AreaData, useAreaStore } from '../store/areaStore';

export function AreaMesh({ area }: { area: AreaData }) {
  const { controls } = useThree();
  const meshRef = useRef<THREE.Mesh>(null!);
  const dragging = useRef(false);

  const { selectedIds, select, updateArea, setMode } = useAreaStore(
    useShallow((s) => ({
      selectedIds: s.selectedIds,
      select: s.select,
      updateArea: s.updateArea,
      setMode: s.setMode,
    })),
  );

  const selected = selectedIds.includes(area.id);

  /** pointer down：开始拖拽 */
  const onDown = (e: any) => {
    e.stopPropagation();
    // 禁用 controls
    controls && (controls.enablePan = false);

    select([area.id]);
    dragging.current = true;
    setMode('select');
  };

  /** pointer move：只动 mesh，不动 store */
  const onMove = (e: any) => {
    if (!dragging.current) return;
    e.stopPropagation();

    meshRef.current.position.set(e.point.x, e.point.y, 0);
  };

  /** pointer up：一次性提交到 store */
  const onUp = () => {
    if (!dragging.current) return;

    dragging.current = false;
    setMode('idle');

    const finalPos = meshRef.current.position.clone();

    updateArea(area.id, {
      center: finalPos,
    });
    // 启用 controls
    controls && (controls.enablePan = true);
  };

  return (
    <mesh
      ref={meshRef}
      position={area.center}
      scale={[area.width, area.height, 1]}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={selected ? '#fab005' : '#51cf66'} transparent opacity={0.4} />
    </mesh>
  );
}
