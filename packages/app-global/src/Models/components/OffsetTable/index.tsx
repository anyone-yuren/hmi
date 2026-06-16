import {
  GizmoHelper,
  GizmoViewport,
  MapControls,
  OrthographicCamera,
} from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useModelStore } from '../../store';
import { OptimizedLabels } from './components/LabelsLayer';
import { PointsLayer } from './components/PointsLayer';
import { useOffsetTableStore } from './store';

// ================== Utils ==================
function isPointInRect(
  p: THREE.Vector3,
  min: THREE.Vector3,
  max: THREE.Vector3,
) {
  return p.x >= min.x && p.x <= max.x && p.y >= min.y && p.y <= max.y;
}

// ================== Component ==================
export default function OffsetTableScene() {
  const { camera, gl, scene } = useThree();
  const canvas = gl.domElement;

  const { points, selectedIds, setSelectedIds, setEditModal } =
    useOffsetTableStore();

  const setShowMapLoading = useModelStore((s) => s.setShowMapLoading);

  const cancelRect = () => {
    startRef.current = null;
    currentRef.current = null;
    isDrawingRef.current = false;
    setVersion((v) => v + 1);
  };

  // ========== loading ==========
  useEffect(() => {
    setShowMapLoading(true);
    const t = setTimeout(() => setShowMapLoading(false), 2500);
    return () => clearTimeout(t);
  }, [setShowMapLoading]);

  // ================== Rect State ==================
  const startRef = useRef<THREE.Vector3 | null>(null);
  const currentRef = useRef<THREE.Vector3 | null>(null);
  const isDrawingRef = useRef(false);
  const [version, setVersion] = useState(0);

  // ================== Screen → World ==================
  const getWorldPoint = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const p = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, p);

    return p.clone();
  };

  // ================== Finish Rect ==================
  const finishRect = (clientX: number, clientY: number) => {
    if (!startRef.current || !currentRef.current) return;

    const min = new THREE.Vector3(
      Math.min(startRef.current.x, currentRef.current.x),
      Math.min(startRef.current.y, currentRef.current.y),
      0,
    );
    const max = new THREE.Vector3(
      Math.max(startRef.current.x, currentRef.current.x),
      Math.max(startRef.current.y, currentRef.current.y),
      0,
    );

    const newSelected = new Set<string>();

    points.forEach((p) => {
      const pos = new THREE.Vector3(...p.position);
      if (isPointInRect(pos, min, max)) {
        newSelected.add(p.id);
      }
    });

    setSelectedIds(newSelected);

    if (newSelected.size > 0) {
      setEditModal({
        visible: true,
        x: clientX,
        y: clientY,
        targetIds: Array.from(newSelected),
      });
    }

    startRef.current = null;
    currentRef.current = null;
    isDrawingRef.current = false;
    setVersion((v) => v + 1);
  };

  // ================== Pointer Events ==================
  useEffect(() => {
    let lastClick = 0;

    const onPointerDown = (e: PointerEvent) => {
      // ========== 右键：取消框选 ==========
      if (e.button === 2) {
        cancelRect();
        return;
      }

      // 只处理左键
      if (e.button !== 0) return;

      // ========== Ctrl / Meta：点选 ==========
      if (e.ctrlKey || e.metaKey) {
        // Handled by PointsLayer onContextMenu or similar?
        // No, click selection is usually on pointer down/up on the object.
        // But since we use InstancedMesh, we rely on raycasting or the onClick of the mesh.
        // However, PointsLayer doesn't handle Left Click for selection, only Right Click for context menu.
        // We should handle single click selection here if not box selecting.

        // Let's implement single click selection via raycaster here for consistency?
        // Actually, let's keep it simple: Ctrl+Click is handled below or via box select (tiny box).
        // But the previous code had specific raycasting for click.

        // Let's stick to the box select logic which handles single click as a tiny box?
        // Or specific raycast.

        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1,
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // Raycast against InstancedMesh
        let intersectedInstanceId: number | undefined;
        scene.traverse((child) => {
          if (child.type === 'InstancedMesh' && child.userData.isStoragePoint) {
            const mesh = child as THREE.InstancedMesh;
            const intersects = raycaster.intersectObject(mesh);
            if (intersects.length > 0) {
              intersectedInstanceId = intersects[0].instanceId;
            }
          }
        });

        if (intersectedInstanceId !== undefined) {
          const id = points[intersectedInstanceId].id;
          const newSet = new Set(selectedIds);
          newSet.has(id) ? newSet.delete(id) : newSet.add(id);
          setSelectedIds(newSet);
        }

        return;
      }

      // ========== 普通左键：矩形框选 ==========
      const now = Date.now();

      // 双击完成 (Not typical for box select, usually drag release)
      // But keeping existing logic structure if user wanted double click to finish?
      // No, box select is usually drag.

      // Let's stick to Drag = Box.

      if (!isDrawingRef.current) {
        startRef.current = getWorldPoint(e);
        currentRef.current = startRef.current.clone();
        isDrawingRef.current = true;
        setVersion((v) => v + 1);
      }

      lastClick = now;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDrawingRef.current || !startRef.current) return;
      currentRef.current = getWorldPoint(e);
      setVersion((v) => v + 1);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isDrawingRef.current) {
        finishRect(e.clientX, e.clientY);
      }
    };

    const onContextMenu = (e: MouseEvent) => {
      // 防止浏览器默认右键菜单 (handled by Canvas usually but good to enforce)
      // e.preventDefault();
      // Actually we want ContextMenu for our right click features, but not browser's.
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelRect();
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [camera, canvas, points, scene, selectedIds]);

  // ================== Rect Geometry ==================
  const rectPositions = (() => {
    if (!startRef.current || !currentRef.current) return null;

    const a = startRef.current;
    const b = currentRef.current;

    const minX = Math.min(a.x, b.x);
    const maxX = Math.max(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const maxY = Math.max(a.y, b.y);

    return new Float32Array([
      minX,
      minY,
      0,
      maxX,
      minY,
      0,
      maxX,
      minY,
      0,
      maxX,
      maxY,
      0,
      maxX,
      maxY,
      0,
      minX,
      maxY,
      0,
      minX,
      maxY,
      0,
      minX,
      minY,
      0,
    ]);
  })();

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 50]} zoom={20} />

      <MapControls
        makeDefault
        enableRotate={false}
        screenSpacePanning
        mouseButtons={{
          LEFT: null as any,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={10} />

      <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewport />
      </GizmoHelper>

      {/* ================= Layers ================= */}
      <group>
        <PointsLayer />
        <OptimizedLabels />
      </group>

      {/* ================= Rect Visual ================= */}
      {startRef.current && currentRef.current && (
        <group key={version}>
          {/* 半透明填充面 */}
          <mesh
            position={[
              (startRef.current.x + currentRef.current.x) / 2,
              (startRef.current.y + currentRef.current.y) / 2,
              0.01,
            ]}
          >
            <planeGeometry
              args={[
                Math.abs(currentRef.current.x - startRef.current.x),
                Math.abs(currentRef.current.y - startRef.current.y),
              ]}
            />
            <meshBasicMaterial
              color='#00d1d1'
              transparent
              opacity={0.18}
              depthWrite={false}
            />
          </mesh>

          {/* 描边 */}
          {rectPositions && (
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute
                  attach='attributes-position'
                  array={rectPositions}
                  itemSize={3}
                  count={rectPositions.length / 3}
                />
              </bufferGeometry>
              <lineBasicMaterial color='#00ffff' />
            </lineSegments>
          )}
        </group>
      )}
    </>
  );
}
