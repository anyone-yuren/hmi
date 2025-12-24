import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../hooks/usePickOnXYPanel';
import { useSelectionStore } from '../../selection/selectionStore';
import { querySpatialIndex, rebuildSpatialIndex } from '../../selection/spatialIndex';
import { SelectableItem } from '../../selection/type';
import { useMapEditorStore } from '../../store';

/* ======================= */
/* 配置参数 */
/* ======================= */

const LABEL_VISIBLE_ZOOM = 40;
const SPRITE_WORLD_SIZE = 0.35;
const SPRITE_Z_OFFSET = 0.02;
const CANVAS_SIZE = 256;

/* ======================= */
/* 工具函数 */
/* ======================= */

function createTextSprite(text: string, color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.fillStyle = color;
  ctx.font = 'bold 96px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, CANVAS_SIZE / 2, CANVAS_SIZE / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({
    map: texture,
    depthTest: false,
    transparent: true,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(SPRITE_WORLD_SIZE, SPRITE_WORLD_SIZE, 1);

  return sprite;
}

function safeUpdateSprite(sprite: THREE.Sprite, draw: (ctx: CanvasRenderingContext2D) => void) {
  const map = sprite.material.map;
  if (!map) return;

  const canvas = map.image as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  draw(ctx);
  map.needsUpdate = true;
}

function getOrthoViewBounds(cam: THREE.OrthographicCamera) {
  const halfW = (cam.right - cam.left) / (2 * cam.zoom);
  const halfH = (cam.top - cam.bottom) / (2 * cam.zoom);

  return {
    minX: cam.position.x - halfW,
    maxX: cam.position.x + halfW,
    minY: cam.position.y - halfH,
    maxY: cam.position.y + halfH,
  };
}

/* ======================= */
/* 类型 */
/* ======================= */

interface PointData {
  id: number;
  position: THREE.Vector3;
  createdAt: Date;
}

/* ======================= */
/* 主组件 */
/* ======================= */

export default function DrawPoints() {
  const { paramsPanelCollapsed, selectDrawType } = useMapEditorStore(
    useShallow((s) => ({
      paramsPanelCollapsed: s.paramsPanelCollapsed,
      selectDrawType: s.selectDrawType,
    })),
  );

  const { selectedIds } = useSelectionStore(
    useShallow((s) => ({
      selectedIds: s.selectedIds,
    })),
  );

  const { camera, scene } = useThree();
  const pick = usePickOnXYPlane();

  const [points, setPoints] = useState<PointData[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  /* ======================= */
  /* InstancedMesh */
  /* ======================= */

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const geometry = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 0.001, 16), []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ff9900',
        emissive: '#ff9900',
        emissiveIntensity: 0.25,
        vertexColors: true, // ✅ 必须
      }),
    [],
  );

  /* ======================= */
  /* Sprite 虚拟化池 */
  /* ======================= */

  const spritePool = useRef<Map<number, THREE.Sprite>>(new Map());
  const visibleSpriteIds = useRef<Set<number>>(new Set());

  function hideAllSprites() {
    visibleSpriteIds.current.forEach((id) => {
      const s = spritePool.current.get(id);
      if (s) s.visible = false;
    });
    visibleSpriteIds.current.clear();
  }

  function showSprite(p: PointData, index: number) {
    let sprite = spritePool.current.get(p.id);

    if (!sprite) {
      sprite = createTextSprite(String(index + 1), '#ffffff');
      sprite.position.set(p.position.x, p.position.y, SPRITE_Z_OFFSET);
      spritePool.current.set(p.id, sprite);
      scene.add(sprite);
    }

    sprite.visible = true;
    visibleSpriteIds.current.add(p.id);
  }

  /* ======================= */
  /* 相机变化监听（核心） */
  /* ======================= */

  const lastCameraState = useRef({ zoom: 0, x: 0, y: 0 });

  useFrame(() => {
    const cam = camera as THREE.OrthographicCamera;

    const stateChanged =
      cam.zoom !== lastCameraState.current.zoom ||
      cam.position.x !== lastCameraState.current.x ||
      cam.position.y !== lastCameraState.current.y;

    if (!stateChanged) return;

    lastCameraState.current = {
      zoom: cam.zoom,
      x: cam.position.x,
      y: cam.position.y,
    };

    hideAllSprites();

    if (cam.zoom < LABEL_VISIBLE_ZOOM) return;

    const bounds = getOrthoViewBounds(cam);
    const visiblePoints = querySpatialIndex(bounds) as PointData[];

    visiblePoints.forEach((p) => {
      const index = points.findIndex((pt) => pt.id === p.id);
      if (index !== -1) {
        showSprite(p, index);
      }
    });
  });

  /* ======================= */
  /* Sprite 颜色 / 文本更新 */
  /* ======================= */

  useEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    if (cam.zoom < LABEL_VISIBLE_ZOOM) return;

    visibleSpriteIds.current.forEach((id) => {
      const sprite = spritePool.current.get(id);
      if (!sprite) return;

      safeUpdateSprite(sprite, (ctx) => {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.fillStyle = selectedIds.has(id) ? '#4ade80' : id === hoveredId ? '#ff4444' : '#ffffff';

        ctx.font = 'bold 96px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const index = points.findIndex((p) => p.id === id);
        ctx.fillText(String(index + 1), CANVAS_SIZE / 2, CANVAS_SIZE / 2);
      });
    });
  }, [hoveredId, selectedIds, points, camera]);

  /* ======================= */
  /* InstancedMesh 更新 */
  /* ======================= */

  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;

    points.forEach((p, i) => {
      dummy.position.set(p.position.x, p.position.y, 0.001);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);

      let color = '#ff9900';
      if (selectedIds.has(p.id)) color = '#00d1d1';
      if (p.id === hoveredId) color = '#ff4444';

      mesh.setColorAt(i, new THREE.Color(color));
    });

    mesh.count = points.length;
    mesh.instanceMatrix.needsUpdate = true;

    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [points, hoveredId, selectedIds, dummy]);

  /* ======================= */
  /* 空间索引 */
  /* ======================= */

  useEffect(() => {
    const items: SelectableItem[] = points.map((p) => ({
      id: p.id,
      type: 'point',
      position: p.position,
      minX: p.position.x,
      maxX: p.position.x,
      minY: p.position.y,
      maxY: p.position.y,
    }));

    rebuildSpatialIndex(items);
  }, [points]);

  /* ======================= */
  /* 点击添加点 */
  /* ======================= */

  useEffect(() => {
    if (!paramsPanelCollapsed || selectDrawType !== 'point') return;

    const onClick = (e: MouseEvent) => {
      const p = pick(e);
      if (!p) return;

      setPoints((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          position: p.clone(),
          createdAt: new Date(),
        },
      ]);
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [pick, paramsPanelCollapsed, selectDrawType]);

  /* ======================= */
  /* Hover */
  /* ======================= */

  const onPointerMove = (e: any) => {
    if (e.instanceId === undefined) return;
    const p = points[e.instanceId];
    if (p) setHoveredId(p.id);
  };

  const onPointerOut = () => setHoveredId(null);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, points.length]}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
    />
  );
}
