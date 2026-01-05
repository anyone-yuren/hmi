import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../hooks/usePickOnXYPanel';
import { useSelectionStore } from '../../selection/selectionStore';
import { querySpatialIndex, rebuildSpatialIndex } from '../../selection/spatialIndex';
import { SelectableItem } from '../../selection/type';
import { useMapEditorStore } from '../../store';
import { THREE_LAYERS } from '../../three/constants/threeLayers';

/* ======================= */
/* 配置参数 */
/* ======================= */
const LABEL_VISIBLE_ZOOM = 40;
const SPRITE_WORLD_SIZE = 0.35;
const SPRITE_Z_OFFSET = 0.02;
const CANVAS_SIZE = 256;

/* ======================= */
/* Sprite 工具 */
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
/* Hook: usePointLabels */
/* ======================= */
function usePointLabels(
  staticPoints: any[],
  flyHighlightId: number | null,
  selectedIds: Set<number>,
  hoveredId: number | null,
  camera: THREE.Camera,
  scene: THREE.Scene,
) {
  const spritePool = useRef<Map<number, THREE.Sprite>>(new Map());
  const visibleSpriteIds = useRef<Set<number>>(new Set());

  function hideAllSprites() {
    visibleSpriteIds.current.forEach((id) => {
      spritePool.current.get(id)!.visible = false;
    });
    visibleSpriteIds.current.clear();
  }

  function showSprite(p: any, index: number) {
    let sprite = spritePool.current.get(p.id);
    if (!sprite) {
      sprite = createTextSprite(String(index + 1), '#ffffff');
      sprite.position.set(p.position.x, p.position.y, SPRITE_Z_OFFSET);
      spritePool.current.set(p.id, sprite);
      scene.add(sprite);
    } else {
      // 更新位置
      sprite.position.set(p.position.x, p.position.y, SPRITE_Z_OFFSET);
    }

    sprite.visible = true;
    visibleSpriteIds.current.add(p.id);
  }

  function refresh(force = false) {
    const cam = camera as THREE.OrthographicCamera;

    if (!force && cam.zoom < LABEL_VISIBLE_ZOOM) {
      hideAllSprites();
      return;
    }

    const bounds = getOrthoViewBounds(cam);
    const visiblePoints = new Map<number, any>();

    (querySpatialIndex(bounds) as any[]).forEach((p) => {
      visiblePoints.set(p.id, p);
    });

    // flyTo 点强制显示
    if (flyHighlightId != null) {
      const flyPoint = staticPoints.find((p) => p.id === flyHighlightId);
      if (flyPoint) visiblePoints.set(flyPoint.id, flyPoint);
    }

    hideAllSprites();

    visiblePoints.forEach((p) => {
      const index = staticPoints.findIndex((pt) => pt.id === p.id);
      if (index !== -1) showSprite(p, index);
    });

    // 更新颜色
    visibleSpriteIds.current.forEach((id) => {
      const sprite = spritePool.current.get(id)!;
      safeUpdateSprite(sprite, (ctx) => {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.fillStyle =
          id === flyHighlightId
            ? '#facc15'
            : id === hoveredId
              ? '#ff4444'
              : selectedIds.has(id)
                ? '#4ade80'
                : '#ffffff';
        const index = staticPoints.findIndex((p) => p.id === id);
        ctx.font = 'bold 96px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(index + 1), CANVAS_SIZE / 2, CANVAS_SIZE / 2);
      });
    });
  }

  // 清理
  function dispose() {
    spritePool.current.forEach((sprite) => {
      scene.remove(sprite);
      sprite.material.map?.dispose();
      sprite.material.dispose();
    });
    spritePool.current.clear();
    visibleSpriteIds.current.clear();
  }

  return { refresh, dispose };
}

/* ======================= */
/* 主组件 */
/* ======================= */
export default function DrawPoints() {
  const { gl, camera, scene, controls } = useThree();
  const pick = usePickOnXYPlane();
  const downPos = useRef({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const hasCameraMoved = useRef(false);

  useEffect(() => {
    if (!controls) return;

    const onStart = () => {
      hasCameraMoved.current = false;
    };

    const onChange = () => {
      // 只有真正发生相机变化，才算拖动
      hasCameraMoved.current = true;
    };

    const onEnd = () => {
      isDragging.current = hasCameraMoved.current;

      // ⚠️ click 会在 end 之后触发，所以要延后一帧再清
      requestAnimationFrame(() => {
        isDragging.current = false;
        hasCameraMoved.current = false;
      });
    };

    controls.addEventListener('start', onStart);
    controls.addEventListener('change', onChange);
    controls.addEventListener('end', onEnd);

    return () => {
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('change', onChange);
      controls.removeEventListener('end', onEnd);
    };
  }, [controls]);

  const { paramsPanelCollapsed, selectSubDrawType, staticPoints, setStaticPoints, flyToPoint } = useMapEditorStore(
    useShallow((s) => ({
      paramsPanelCollapsed: s.paramsPanelCollapsed,
      selectSubDrawType: s.selectSubDrawType,
      staticPoints: s.staticPoints,
      setStaticPoints: s.setStaticPoints,
      flyToPoint: s.flyToPoint,
    })),
  );

  const { selectedIds } = useSelectionStore(useShallow((s) => ({ selectedIds: s.selectedIds })));
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const flyHighlightId = useMemo(() => {
    if (!flyToPoint) return null;
    if ('id' in flyToPoint) return flyToPoint.id;

    let min = Infinity;
    let id: number | null = null;
    staticPoints.forEach((p) => {
      const d = (p.position.x - flyToPoint.x) ** 2 + (p.position.y - flyToPoint.y) ** 2;
      if (d < min) {
        min = d;
        id = p.id;
      }
    });
    return id;
  }, [flyToPoint, staticPoints]);

  /* ======================= */
  /* InstancedMesh 设置 */
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
        vertexColors: true,
      }),
    [],
  );

  /* ======================= */
  /* 初始化空间索引 */
  /* ======================= */
  useEffect(() => {
    const items: SelectableItem[] = staticPoints.map((p) => ({
      id: p.id,
      type: 'point',
      position: p.position,
      minX: p.position.x,
      maxX: p.position.x,
      minY: p.position.y,
      maxY: p.position.y,
    }));
    rebuildSpatialIndex(items);
  }, [staticPoints]);

  /* ======================= */
  /* hover & instancedMesh 更新 */
  /* ======================= */
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (staticPoints.length === 0) {
      mesh.count = 0;
      return;
    }

    staticPoints.forEach((p, i) => {
      dummy.position.set(p.position.x, p.position.y, 0.001);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);

      let color = '#ff9900';
      if (p.id === flyHighlightId) color = '#facc15';
      else if (p.id === hoveredId) color = '#ff4444';
      else if (selectedIds?.has(p.id)) color = '#00d1d1';

      mesh.setColorAt(i, new THREE.Color(color));
    });

    mesh.count = staticPoints.length;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor!.needsUpdate = true;
  }, [staticPoints, hoveredId, selectedIds, flyHighlightId]);

  /* ======================= */
  /* Sprite 管理 hook */
  /* ======================= */
  const { refresh, dispose } = usePointLabels(staticPoints, flyHighlightId, selectedIds, hoveredId, camera, scene);

  /* ======================= */
  /* camera dirty 监听 */
  /* ======================= */
  const lastCamera = useRef({ x: 0, y: 0, zoom: 0 });
  useFrame(() => {
    const cam = camera as THREE.OrthographicCamera;
    if (
      cam.zoom !== lastCamera.current.zoom ||
      cam.position.x !== lastCamera.current.x ||
      cam.position.y !== lastCamera.current.y
    ) {
      lastCamera.current = { x: cam.position.x, y: cam.position.y, zoom: cam.zoom };
      refresh();
    }
  });

  /* ======================= */
  /* 点击添加点 */
  /* ======================= */
  useEffect(() => {
    if (!paramsPanelCollapsed || selectSubDrawType !== 'locationPoint') return;

    const onClick = (e: MouseEvent) => {
      if (isDragging.current) return;
      const p = pick(e);
      if (!p) return;

      const newPoints = [...staticPoints, { id: Date.now(), position: p.clone() }];
      setStaticPoints(newPoints);
      // ✅ 立刻刷新 sprite
      refresh(true);
    };

    gl.domElement.addEventListener('click', onClick);
    return () => gl.domElement.removeEventListener('click', onClick);
  }, [pick, paramsPanelCollapsed, selectSubDrawType, staticPoints]);

  /* ======================= */
  /* Pointer 事件 */
  /* ======================= */
  const onPointerMove = (e: any) => {
    if (e.instanceId === undefined) return;
    setHoveredId(staticPoints[e.instanceId]?.id ?? null);
  };
  const onPointerOut = () => setHoveredId(null);

  /* ======================= */
  /* 初始化设置 */
  /* ======================= */
  useEffect(() => {
    meshRef.current?.layers.set(THREE_LAYERS.DRAW);
    refresh(true);
    return () => dispose();
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, staticPoints.length]}
      onPointerMove={onPointerMove}
      onPointerOut={onPointerOut}
    />
  );
}
