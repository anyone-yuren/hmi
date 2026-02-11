import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { MapControls as MapControlsImpl } from "three-stdlib";
import { useShallow } from "zustand/react/shallow";
import {
  queryPointsInPolygon,
  useAreaQuery,
} from "../../../../selection/spatialIndex";
import { AreaData, useAreaStore } from "../store/areaStore";

import { useDebounceFn } from "ahooks";

/** ---------- 计算多边形中心 ---------- */
function calcPolygonCenter(points: { x: number; y: number }[]) {
  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const cross = p1.x * p2.y - p2.x * p1.y;
    area += cross;
    cx += (p1.x + p2.x) * cross;
    cy += (p1.y + p2.y) * cross;
  }

  area *= 0.5;

  if (Math.abs(area) < 1e-6) {
    const avg = points.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), {
      x: 0,
      y: 0,
    });
    return { x: avg.x / points.length, y: avg.y / points.length, z: 0 };
  }

  return {
    x: cx / (6 * area),
    y: cy / (6 * area),
    z: 0,
  };
}

export function AreaMesh({ area }: { area: AreaData }) {
  const { camera, gl, controls } = useThree();
  const mapControls = controls as MapControlsImpl;
  const {
    selectedIds,
    select,
    updateArea,
    setContextMenuPosition,
    setPointsInArea,
  } = useAreaStore(
    useShallow((s) => ({
      selectedIds: s.selectedIds,
      select: s.select,
      updateArea: s.updateArea,
      setContextMenuPosition: s.setContextMenuPosition,
      setPointsInArea: s.setPointsInArea,
    })),
  );

  const selected = selectedIds.includes(area.id);

  /** ---------- Raycast ---------- */
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));

  const getPoint = (e: PointerEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.current.setFromCamera(mouse.current, camera);
    const p = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane.current, p);
    return p;
  };

  /** ---------- 草稿态 ---------- */
  const draggingIndex = useRef<number | null>(null);
  const draftPointsRef = useRef<{ x: number; y: number }[] | null>(null);
  const draftCenterRef = useRef<{ x: number; y: number; z: number } | null>(
    null,
  );
  const [, forceRender] = useState(0);

  const polygon = draftPointsRef.current ?? area.points;

  const pointsInArea = useAreaQuery(area.points);

  useEffect(() => {
    if (!selected) return;
    setPointsInArea(area.id, pointsInArea as any);
  }, [selected]);
  const { run: runComputeAfterDrag } = useDebounceFn(
    (points: { x: number; y: number }[]) => {
      const result = queryPointsInPolygon(points);
      setPointsInArea(area.id, result as any);
    },
    { wait: 200 },
  );

  const renderPoints = draftPointsRef.current ?? area.points;
  const renderCenter = draftCenterRef.current ?? area.center;

  /** ---------- Geometry ---------- */
  const shapeGeometry = useMemo(() => {
    if (renderPoints.length < 3) return null;

    const shape = new THREE.Shape(
      renderPoints.map(
        (p) => new THREE.Vector2(p.x - renderCenter.x, p.y - renderCenter.y),
      ),
    );

    return new THREE.ShapeGeometry(shape);
  }, [renderPoints, renderCenter]);

  /** ---------- 拖拽监听 ---------- */
  useEffect(() => {
    const dom = gl.domElement;

    const onMove = (e: PointerEvent) => {
      if (draggingIndex.current === null) return;
      if (!draftPointsRef.current) return;

      const p = getPoint(e);
      draftPointsRef.current[draggingIndex.current] = { x: p.x, y: p.y };

      draftCenterRef.current = calcPolygonCenter(draftPointsRef.current);
      forceRender((n) => n + 1);
    };

    const onUp = () => {
      if (!draftPointsRef.current || draggingIndex.current === null) return;

      updateArea(area.id, {
        points: draftPointsRef.current,
        center: new THREE.Vector3(
          draftCenterRef.current!.x,
          draftCenterRef.current!.y,
          draftCenterRef.current!.z,
        ),
      });
      // 计算当前区域内的点
      runComputeAfterDrag(draftPointsRef.current);
      draggingIndex.current = null;
      draftPointsRef.current = null;
      draftCenterRef.current = null;
      mapControls && (mapControls.enabled = true);
    };

    dom.addEventListener("pointermove", onMove);
    dom.addEventListener("pointerup", onUp);

    return () => {
      dom.removeEventListener("pointermove", onMove);
      dom.removeEventListener("pointerup", onUp);
    };
  }, [area.id]);

  return (
    <>
      {/* ---------- 多边形 ---------- */}
      <mesh
        position={[renderCenter.x, renderCenter.y, renderCenter.z + 0.05]}
        renderOrder={1}
        onPointerDown={(e) => {
          e.stopPropagation();
          select(selected ? [] : [area.id]);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
          setContextMenuPosition({ x: e.layerX, y: e.layerY });
        }}
      >
        {shapeGeometry && (
          <primitive object={shapeGeometry} attach="geometry" />
        )}
        <meshBasicMaterial
          color={selected ? "#fab005" : "#a855f7"}
          transparent
          opacity={selected ? 0.4 : 0.25}
          depthTest={false}
        />
      </mesh>

      {/* ---------- 顶点 ---------- */}
      {selected &&
        renderPoints.map((p, i) => (
          <mesh
            key={i}
            position={[p.x, p.y, 0.1]}
            renderOrder={2}
            onPointerDown={(e) => {
              e.stopPropagation();
              draggingIndex.current = i;
              draftPointsRef.current = area.points.map((pt) => ({ ...pt }));
              draftCenterRef.current = { ...area.center };
              mapControls && (mapControls.enabled = false);
            }}
          >
            <circleGeometry args={[0.6, 16]} />
            <meshBasicMaterial color="#ff922b" depthTest={false} />
          </mesh>
        ))}
    </>
  );
}
