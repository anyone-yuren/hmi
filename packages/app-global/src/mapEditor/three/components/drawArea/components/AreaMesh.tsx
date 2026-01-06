import { PivotControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MapControls as MapControlsImpl } from 'three-stdlib';
import { useShallow } from 'zustand/react/shallow';
import { AreaData, useAreaStore } from '../store/areaStore';

export function AreaMesh({ area }: { area: AreaData }) {
  const { controls } = useThree();
  const mapControls = controls as MapControlsImpl;
  const meshRef = useRef<THREE.Mesh>(null!);

  const { selectedIds, select, updateArea, setMode, setContextMenuPosition } = useAreaStore(
    useShallow((s) => ({
      selectedIds: s.selectedIds,
      select: s.select,
      updateArea: s.updateArea,
      setMode: s.setMode,
      setContextMenuPosition: s.setContextMenuPosition,
    })),
  );

  const selected = selectedIds.includes(area.id);

  const pivotRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    if (!pivotRef.current) return;

    pivotRef.current.traverse((obj) => {
      obj.userData.__gizmo = true;
    });
  }, []);
  return (
    <>
      <PivotControls
        visible={selected}
        ref={pivotRef}
        anchor={[0, 0, 0]}
        depthTest={false}
        fixed
        scale={80}
        /** 平移：只允许 XY */
        activeAxes={[true, true, false]}
        /** 旋转：只允许绕 Z */
        disableRotations={false}
        rotationAxes={[false, false, true]}
        /** 缩放：只允许 XY */
        disableScaling={false}
        scaleAxes={[true, true, false]}
        /** 拖拽开始 / 结束 */
        onDragStart={() => {
          mapControls.enabled = false;
        }}
        onDragEnd={() => {
          mapControls.enabled = true;
        }}
      >
        <mesh
          ref={meshRef}
          position={area.center}
          name={area.name}
          rotation={[0, 0, area.rotation ?? 0]}
          scale={[area.width, area.height, 1]}
          onPointerDown={(e) => {
            e.stopPropagation();
            select([area.id]);
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
            const position = { x: e.layerX, y: e.layerY };
            setContextMenuPosition(position);
          }}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color={selected ? '#fab005' : '#51cf66'} transparent opacity={0.4} />
        </mesh>
      </PivotControls>
    </>
  );
}
