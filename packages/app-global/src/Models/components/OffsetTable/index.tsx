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
import { useOffsetTableStore } from './store';

// ================== Constants ==================
const POINT_SIZE = 0.5;
const SELECTED_COLOR = '#1890ff';
const OFFSET_COLOR = '#faad14';
const DEFAULT_COLOR = '#d9d9d9';

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
    const t = setTimeout(() => setShowMapLoading(false), 500);
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
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1,
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const meshes: THREE.Object3D[] = [];
        scene.traverse((obj) => {
          if (obj.userData?.id) meshes.push(obj);
        });

        const hits = raycaster.intersectObjects(meshes);
        if (hits.length > 0) {
          const id = hits[0].object.userData.id;
          const newSet = new Set(selectedIds);
          newSet.has(id) ? newSet.delete(id) : newSet.add(id);
          setSelectedIds(newSet);
        }

        return;
      }

      // ========== 普通左键：矩形框选 ==========
      const now = Date.now();

      // 双击完成
      if (isDrawingRef.current && now - lastClick < 300) {
        finishRect(e.clientX, e.clientY);
        lastClick = 0;
        return;
      }

      lastClick = now;

      // 开始绘制
      if (!isDrawingRef.current) {
        startRef.current = getWorldPoint(e);
        currentRef.current = startRef.current.clone();
        isDrawingRef.current = true;
        setVersion((v) => v + 1);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDrawingRef.current || !startRef.current) return;
      currentRef.current = getWorldPoint(e);
      setVersion((v) => v + 1);
    };

    const onContextMenu = (e: MouseEvent) => {
      // 防止浏览器默认右键菜单
      e.preventDefault();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelRect();
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
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

  // ================== Right Click ==================
  const handleContextMenu = (e: any, id: string) => {
    e.stopPropagation();

    let newSelected = new Set(selectedIds);
    if (!newSelected.has(id)) {
      newSelected = new Set([id]);
      setSelectedIds(newSelected);
    }

    setEditModal({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      targetIds: Array.from(newSelected),
    });
  };

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
      <directionalLight position={[10, 10, 10]} intensity={1} />

      <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewport />
      </GizmoHelper>

      {/* ================= Points ================= */}
      <group>
        {points.map((point) => {
          const isSelected = selectedIds.has(point.id);
          const hasOffset = point.offset.x !== 0 || point.offset.y !== 0;

          let color = DEFAULT_COLOR;
          if (hasOffset) color = OFFSET_COLOR;
          if (isSelected) color = SELECTED_COLOR;

          return (
            <mesh
              key={point.id}
              position={new THREE.Vector3(...point.position)}
              userData={{ id: point.id }}
              onContextMenu={(e) => handleContextMenu(e, point.id)}
            >
              <boxGeometry args={[POINT_SIZE, POINT_SIZE, 0.1]} />
              <meshStandardMaterial color={color} />
            </mesh>
          );
        })}
      </group>

      {/* ================= Rect Visual ================= */}
      {rectPositions && (
        <lineSegments key={version}>
          <bufferGeometry>
            <bufferAttribute
              attach='attributes-position'
              array={rectPositions}
              itemSize={3}
              count={rectPositions.length / 3}
            />
          </bufferGeometry>
          <lineBasicMaterial color='#00d1d1' />
        </lineSegments>
      )}
    </>
  );
}
