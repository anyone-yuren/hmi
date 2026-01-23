import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useOffsetTableStore } from '../store';

const POINT_SIZE = 6; // 屏幕像素
const SELECTED_COLOR = new THREE.Color('#00ff00');
const OFFSET_COLOR = new THREE.Color('#faad14');
const DEFAULT_COLOR = new THREE.Color('#d9d9d9');

export const PointsLayer = memo(() => {
  const { points, selectedIds, setEditModal, setSelectedIds } =
    useOffsetTableStore();

  const pointsRef = useRef<THREE.Points>(null);

  /**
   * 1️⃣ geometry：position + color
   */
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);

    points.forEach((p, i) => {
      positions.set(p.position, i * 3);
      DEFAULT_COLOR.toArray(colors, i * 3);
    });

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geo;
  }, [points]);

  /**
   * 2️⃣ material：一定要 vertexColors
   */
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 6,
      sizeAttenuation: true, // 屏幕像素大小
      vertexColors: true,
    });
  }, []);

  /**
   * 3️⃣ 颜色更新（选中 / offset）
   */
  useEffect(() => {
    if (!pointsRef.current) return;

    const colorAttr = pointsRef.current.geometry.getAttribute(
      'color',
    ) as THREE.BufferAttribute;

    points.forEach((p, i) => {
      const isSelected = selectedIds.has(p.id);
      const hasOffset = p.offset.x !== 0 || p.offset.y !== 0;

      let color = DEFAULT_COLOR;
      if (hasOffset) color = OFFSET_COLOR;
      if (isSelected) color = SELECTED_COLOR;

      colorAttr.setXYZ(i, color.r, color.g, color.b);
    });

    colorAttr.needsUpdate = true;
  }, [points, selectedIds]);

  /**
   * 4️⃣ 右键交互（raycaster 原生支持）
   */
  const handleContextMenu = (e: any) => {
    e.stopPropagation();

    const index = e.index; // ⚠️ Points 用 index，不是 instanceId
    if (index === undefined) return;

    const point = points[index];
    if (!point) return;

    let newSelected = new Set(selectedIds);
    if (!newSelected.has(point.id)) {
      newSelected = new Set([point.id]);
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
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      onContextMenu={handleContextMenu}
      userData={{ isStoragePoint: true }}
    />
  );
});
