import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../store';

interface PointData {
  id: number;
  position: THREE.Vector3;
  createdAt: Date;
}
const MAX_LABEL_DISTANCE = 10; // 10 米

const SPRITE_SIZE = 0.35; // 🔴 控制“屏幕中文字大小”

/* ======================= */
/* 创建文字 Sprite 工具函数 */
/* ======================= */

function createTextSprite(text: string, color: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 256);

  ctx.fillStyle = color;
  ctx.font = 'bold 96px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const material = new THREE.SpriteMaterial({
    map: texture,
    depthTest: false,
    transparent: true,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(SPRITE_SIZE, SPRITE_SIZE, 1);

  return sprite;
}

function DrawPoints() {
  const { paramsPanelCollapsed, selectDrawType } = useMapEditorStore(
    useShallow((s) => ({
      paramsPanelCollapsed: s.paramsPanelCollapsed,
      selectDrawType: s.selectDrawType,
    })),
  );

  console.log('selectDrawType', selectDrawType);

  const { camera } = useThree();

  useFrame(() => {
    spritesRef.current.forEach((sprite) => {
      const distance = camera.position.distanceTo(sprite.position);
      sprite.visible = distance <= MAX_LABEL_DISTANCE;
    });
  });

  const pick = usePickOnXYPlane();

  const [points, setPoints] = useState<PointData[]>([]);
  const [hoveredPointId, setHoveredPointId] = useState<number | null>(null);

  const meshRef = useRef<THREE.InstancedMesh>(null);
  const spritesRef = useRef<Map<number, THREE.Sprite>>(new Map());

  const nextIdRef = useRef(1);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  /* ======================= */
  /* 点几何体 */
  /* ======================= */

  const geometry = useMemo(() => new THREE.CylinderGeometry(0.04, 0.04, 0.001, 16), []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ff9900',
        emissive: '#ff9900',
        emissiveIntensity: 0.25,
      }),
    [],
  );

  /* ======================= */
  /* 初始化 instanceColor */
  /* ======================= */

  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;

    if (!mesh.instanceColor) {
      const colors = new Float32Array(mesh.count * 3);
      mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
    }
  }, []);

  /* ======================= */
  /* 更新 InstancedMesh */
  /* ======================= */

  useEffect(() => {
    if (!meshRef.current) return;

    points.forEach((p, i) => {
      dummy.position.set(p.position.x, p.position.y, 0.001);
      dummy.rotation.set(Math.PI / 2, 0, 0);
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(i, dummy.matrix);

      const color = p.id === hoveredPointId ? '#ff4444' : '#ff9900';
      meshRef.current!.setColorAt(i, new THREE.Color(color));
    });

    meshRef.current.count = points.length;
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [points, hoveredPointId, dummy]);

  /* ======================= */
  /* 同步 Sprite（创建 / 更新） */
  /* ======================= */

  useEffect(() => {
    points.forEach((p, index) => {
      if (spritesRef.current.has(p.id)) return;

      const sprite = createTextSprite(String(index + 1), '#ffffff');
      sprite.position.set(p.position.x, p.position.y, 0.01);

      spritesRef.current.set(p.id, sprite);
    });

    return () => {};
  }, [points]);

  /* ======================= */
  /* Hover：同步文字颜色 */
  /* ======================= */

  useEffect(() => {
    spritesRef.current.forEach((sprite, id) => {
      const canvas = sprite.material.map!.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = id === hoveredPointId ? '#ff4444' : '#ffffff';
      ctx.font = 'bold 64px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const index = points.findIndex((p) => p.id === id);
      ctx.fillText(String(index + 1), 128, 64);

      sprite.material.map!.needsUpdate = true;
    });
  }, [hoveredPointId, points]);

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
          id: nextIdRef.current++,
          position: p.clone(),
          createdAt: new Date(),
        },
      ]);
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [pick, paramsPanelCollapsed, selectDrawType]);

  /* ======================= */
  /* Hover 事件 */
  /* ======================= */

  const onPointerMove = (e: any) => {
    if (e.instanceId === undefined) return;
    const point = points[e.instanceId];
    if (!point) return;

    setHoveredPointId(point.id);
  };

  const onPointerOut = () => {
    setHoveredPointId(null);
  };

  /* ======================= */
  /* 渲染 */
  /* ======================= */

  return (
    <>
      {/* 点 */}
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, points.length]}
        onPointerMove={onPointerMove}
        onPointerOut={onPointerOut}
      />

      {/* 数字 Sprite */}
      {[...spritesRef.current.values()].map((sprite) => (
        <primitive key={sprite.uuid} object={sprite} />
      ))}
    </>
  );
}

export default DrawPoints;
