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
  const dragging = useRef(false);

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

  /** pointer down：开始拖拽 */
  const onDown = (e: any) => {
    e.stopPropagation();
    // 禁用 controls
    controls && (mapControls.enablePan = false);

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
    controls && (mapControls.enablePan = true);
  };
  const pivotRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    if (!pivotRef.current) return;

    pivotRef.current.traverse((obj) => {
      obj.userData.__gizmo = true;
    });
  }, []);
  return (
    <group>
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

          const mesh = meshRef.current;

          /** 世界坐标 */
          const worldPos = new THREE.Vector3();
          mesh.getWorldPosition(worldPos);

          /** 世界旋转 */
          const worldQuat = new THREE.Quaternion();
          mesh.getWorldQuaternion(worldQuat);

          const euler = new THREE.Euler().setFromQuaternion(worldQuat, 'XYZ');

          /** 世界缩放（如果你允许 scale） */
          const worldScale = new THREE.Vector3();
          mesh.getWorldScale(worldScale);

          // updateArea(area.id, {
          //   center: worldPos.clone(),
          //   rotation: euler.z, // 只关心 Z
          //   width: worldScale.x,
          //   height: worldScale.y,
          // });
        }}
      >
        <mesh
          ref={meshRef}
          position={area.center}
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
      {/* <TransformControls
        onMouseUp={() => {
          const mesh = meshRef.current;
          updateArea(area.id, {
            width: mesh.scale.x,
            height: mesh.scale.y,
            center: mesh.position.clone(),
          });
        }}
        object={meshRef}
        mode='scale' // 'translate' | 'rotate' | 'scale'
      /> */}
    </group>
  );
}
