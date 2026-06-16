import { useRef, useMemo, useEffect } from 'react';
import { BoxGeometry, LineSegments, LineBasicMaterial, BufferGeometry, Vector3 } from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useBodyOutlineStore } from '../store/bodyOutlineStore';

interface BodyOutlineProps {
  bodyMesh: any;
  isVisible?: boolean;
}

/**
 * 车体轮廓面组件 - 绘制可配置的车体边框
 */
export function BodyOutline({ bodyMesh, isVisible = true }: BodyOutlineProps) {
  const lineRef = useRef(null);
  const { bodyOutlineConfig } = useBodyOutlineStore(
    useShallow((state) => ({
      bodyOutlineConfig: state.bodyOutlineConfig,
    })),
  );

  // 创建轮廓线几何体
  const outlineGeometry = useMemo(() => {
    const { width, height, length } = bodyOutlineConfig;

    // 定义8个顶点
    const halfWidth = width / 2;
    const halfLength = length / 2;

    const vertices = [
      // 前面
      new Vector3(-halfLength, 0, -halfWidth),
      new Vector3(-halfLength, 0, halfWidth),
      new Vector3(-halfLength, height, halfWidth),
      new Vector3(-halfLength, height, -halfWidth),
      // 后面
      new Vector3(halfLength, 0, -halfWidth),
      new Vector3(halfLength, 0, halfWidth),
      new Vector3(halfLength, height, halfWidth),
      new Vector3(halfLength, height, -halfWidth),
    ];

    const geometry = new BufferGeometry();
    const positions: number[] = [];

    // 绘制立方体的12条边
    const edges = [
      // 前面
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      // 后面
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      // 连接前后
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];

    edges.forEach(([start, end]) => {
      positions.push(vertices[start].x, vertices[start].y, vertices[start].z);
      positions.push(vertices[end].x, vertices[end].y, vertices[end].z);
    });

    geometry.setAttribute('position', new (require('three').BufferAttribute)(new Float32Array(positions), 3));

    return geometry;
  }, [bodyOutlineConfig]);

  // 更新材质颜色和其他属性
  useEffect(() => {
    if (lineRef.current) {
      const line = lineRef.current as any;

      // 转换hex颜色到十进制
      const hexColor = bodyOutlineConfig.color.replace('#', '0x');
      line.material.color.setHex(parseInt(hexColor as string));
      line.material.transparent = bodyOutlineConfig.opacity < 1;
      line.material.opacity = bodyOutlineConfig.opacity;
      line.material.linewidth = bodyOutlineConfig.lineWidth;
      line.material.needsUpdate = true;
    }
  }, [bodyOutlineConfig.color, bodyOutlineConfig.opacity, bodyOutlineConfig.lineWidth]);

  if (!isVisible || !bodyOutlineConfig.enabled) {
    return null;
  }

  return (
    <lineSegments ref={lineRef} geometry={outlineGeometry}>
      <lineBasicMaterial
        color={bodyOutlineConfig.color}
        transparent={bodyOutlineConfig.opacity < 1}
        opacity={bodyOutlineConfig.opacity}
        linewidth={bodyOutlineConfig.lineWidth}
        fog={false}
      />
    </lineSegments>
  );
}
