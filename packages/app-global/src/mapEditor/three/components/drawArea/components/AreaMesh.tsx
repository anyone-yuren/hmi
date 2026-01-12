import { PivotControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MapControls as MapControlsImpl } from 'three-stdlib';
import { useShallow } from 'zustand/react/shallow';
import { AreaData, useAreaStore } from '../store/areaStore';

export function AreaMesh({ area }: { area: AreaData }) {
  const { controls } = useThree();
  const mapControls = controls as MapControlsImpl;

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

  const startCenterRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const lastDeltaRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const [pivotKey, setPivotKey] = useState(0);

  return selected ? (
    <PivotControls
      visible={selected}
      ref={pivotRef}
      key={pivotKey}
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
      annotations={true}
      scaleAxes={[true, true, false]}
      /** 拖拽开始 / 结束 */
      onDrag={(localMatrix, deltaLocalMatrix, worldMatrix, deltaWorldMatrix) => {
        lastDeltaRef.current.setFromMatrixPosition(deltaWorldMatrix);
        // 直接从 deltaWorldMatrix 提取位置增量
        const deltaPosition = new THREE.Vector3();
        deltaPosition.setFromMatrixPosition(deltaWorldMatrix);

        console.log(`增量移动: X=${deltaPosition.x}, Y=${deltaPosition.y}`);
      }}
      onDragStart={() => {
        mapControls.enabled = false;
        startCenterRef.current = { ...area.center };
      }}
      onDragEnd={() => {
        mapControls.enabled = true;

        if (!startCenterRef.current) return;

        const start = startCenterRef.current;
        const delta = lastDeltaRef.current;

        updateArea(area.id, {
          center: {
            x: start.x + delta.x,
            y: start.y + delta.y,
            z: start.z,
          },
        });

        // 清理
        lastDeltaRef.current.set(0, 0, 0);
        startCenterRef.current = null;
        // ⭐关键：强制 PivotControls 重新挂载
        setPivotKey((k) => k + 1);
      }}
    >
      <mesh
        position={[area.center.x, area.center.y, area.center.z]}
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
  ) : (
    <>
      <mesh
        position={[area.center.x, area.center.y, area.center.z]}
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
    </>
  );
}
