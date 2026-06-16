// components/DragDrawPolygon.tsx
import { Line } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { nanoid } from 'nanoid';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useAreaStore } from '../store/areaStore';

function calcPolygonCenter(points: { x: number; y: number }[]) {
  let area = 0;
  let cx = 0;
  let cy = 0;

  const n = points.length;
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const cross = p1.x * p2.y - p2.x * p1.y;

    area += cross;
    cx += (p1.x + p2.x) * cross;
    cy += (p1.y + p2.y) * cross;
  }

  area *= 0.5;

  // 防止异常（极小多边形）
  if (Math.abs(area) < 1e-6) {
    const avg = points.reduce(
      (acc, p) => {
        acc.x += p.x;
        acc.y += p.y;
        return acc;
      },
      { x: 0, y: 0 },
    );
    return {
      x: avg.x / points.length,
      y: avg.y / points.length,
      z: 0,
    };
  }

  return {
    x: cx / (6 * area),
    y: cy / (6 * area),
    z: 0,
  };
}

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
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);

  const pointsRef = useRef<THREE.Vector3[]>([]);
  const [previewPoint, setPreviewPoint] = useState<THREE.Vector3 | null>(null);

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
    pointsRef.current = [];
    setPreviewPoint(null);
  };

  const finish = () => {
    if (pointsRef.current.length < 3) {
      reset();
      return;
    }

    const id = nanoid();

    const points = pointsRef.current.map((p) => ({
      x: p.x,
      y: p.y,
    }));

    const center = calcPolygonCenter(points);

    addArea({
      id,
      type: 'area',
      points: pointsRef.current.map((p) => ({ x: p.x, y: p.y })),
      name: `区域${id}`,
      center: new THREE.Vector3(center.x, center.y, center.z),
      width: 0,
      height: 0,
    });

    reset();
    setMode('select');
    select([id]);
  };

  useEffect(() => {
    if (mode !== 'draw-area') return;

    const dom = gl.domElement;
    if (controls) {
      (controls as any).enablePan = false;
    }

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const p = getPoint(e);
      if (p) {
        pointsRef.current.push(p.clone());
      }
    };

    const onMove = (e: MouseEvent) => {
      if (pointsRef.current.length === 0) return;
      const p = getPoint(e);
      if (p) {
        setPreviewPoint(p);
      }
    };

    // const onDblClick = () => finish();
    // ⭐ 右键完成
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // 非常重要：禁止系统右键菜单
      e.stopPropagation();

      finish();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') finish();
      if (e.key === 'Escape') reset();
    };

    dom.addEventListener('click', onClick);
    dom.addEventListener('mousemove', onMove);
    // dom.addEventListener('dblclick', onDblClick);
    dom.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      dom.removeEventListener('click', onClick);
      dom.removeEventListener('mousemove', onMove);
      // dom.removeEventListener('dblclick', onDblClick);
      dom.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeyDown);
      if (controls) {
        (controls as any).enablePan = true;
      }
    };
  }, [mode]);

  /** 轮廓点（包含预览点） */
  const linePoints = useMemo(() => {
    const rawPts = [...pointsRef.current];
    if (previewPoint) rawPts.push(previewPoint);

    // Filter adjacent duplicates to prevent degenerate segments
    const filtered: THREE.Vector3[] = [];
    for (const p of rawPts) {
      if (filtered.length === 0) {
        filtered.push(p);
      } else {
        if (filtered[filtered.length - 1].distanceTo(p) > 0.01) {
          filtered.push(p);
        }
      }
    }
    return filtered;
  }, [previewPoint, pointsRef.current.length]);

  /** 面几何 */
  const shapeGeometry = useMemo(() => {
    if (pointsRef.current.length < 3) return null;
    const shape = new THREE.Shape(pointsRef.current.map((p) => new THREE.Vector2(p.x, p.y)));
    return new THREE.ShapeGeometry(shape);
  }, [pointsRef.current.length]);

  return (
    <>
      {/* 面 */}
      {shapeGeometry && (
        <mesh geometry={shapeGeometry} position={[0, 0, 0.05]} renderOrder={1}>
          <meshBasicMaterial color='#a855f7' transparent opacity={0.3} depthTest={false} />
        </mesh>
      )}

      {/* 边 */}
      {linePoints.length > 1 && (
        <Line points={linePoints} color='#a855f7' lineWidth={1} position={[0, 0, 0.05]} renderOrder={2} />
      )}
    </>
  );
}
