import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../store';
// 定义点的数据结构
interface PointData {
  id: number;
  position: THREE.Vector3;
  createdAt: Date;
  // 可以添加其他自定义数据
  customData?: Record<string, any>;
  color?: string; // 点的颜色
  hoverColor?: string; // 悬停时的颜色
}

function DrawPoints() {
  const { paramsPanelCollapsed } = useMapEditorStore(
    useShallow((state) => {
      return {
        paramsPanelCollapsed: state.paramsPanelCollapsed,
      };
    }),
  );
  const { camera, scene, raycaster, pointer } = useThree();
  const pick = usePickOnXYPlane();
  const [points, setPoints] = useState<PointData[]>([]);
  const [hoveredPointId, setHoveredPointId] = useState<number | null>(null); // 当前悬停的点ID
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const nextIdRef = useRef(1); // 用于生成递增ID
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // 颜色配置
  const colors = useMemo(
    () => ({
      normal: 'orange', // 正常状态颜色
      hover: '#ff4444', // 悬停状态颜色
      normalEmissive: '#ff9900', // 正常自发光颜色
      hoverEmissive: '#ff0000', // 悬停自发光颜色
    }),
    [],
  );

  // 检测是否点击到了点
  const checkPointClick = (event: MouseEvent): number | null => {
    const canvas = event.target as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();

    // 计算归一化设备坐标
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    pointer.set(x, y);
    raycaster.setFromCamera(pointer, camera);

    // 检测与点的碰撞
    if (meshRef.current) {
      const intersects = raycaster.intersectObject(meshRef.current);
      if (intersects.length > 0) {
        return intersects[0].instanceId ?? null;
      }
    }

    return null;
  };

  // 点击事件 - 区分点击点和添加点
  useEffect(() => {
    if (!meshRef.current || !paramsPanelCollapsed) return;
    debugger;
    const onClick = (e: MouseEvent) => {
      // 首先检查是否点击到了点
      const instanceId = checkPointClick(e);

      if (instanceId !== null) {
        // 点击到了点，触发点点击事件
        console.log('点击到了点，instanceId:', instanceId);
        const pointData = points[instanceId];
        console.log('点数据:', pointData);

        // 可以在这里处理点的点击逻辑，比如显示详细信息、编辑、删除等
        handlePointClick(pointData);

        // 阻止事件继续传播，防止触发添加点
        e.stopPropagation();
        return;
      }

      // 没有点击到点，添加新点
      const p = pick(e);
      if (!p) return;

      const newPoint: PointData = {
        id: nextIdRef.current++,
        position: p,
        createdAt: new Date(),
        // 可以在这里添加自定义数据
        customData: {
          label: `点${nextIdRef.current - 1}`,
        },
        color: colors.normal, // 初始颜色
        hoverColor: colors.hover, // 悬停颜色
      };

      setPoints((prev) => [...prev, newPoint]);
    };

    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [pick, points, camera, raycaster, pointer, colors, paramsPanelCollapsed]);

  // 处理点点击事件
  const handlePointClick = (pointData: PointData) => {
    // 这里可以处理点的点击逻辑
    console.log(`点击了点 ${pointData.id}:`, {
      position: pointData.position,
      createdAt: pointData.createdAt,
      customData: pointData.customData,
    });

    // 示例：高亮被点击的点
    if (meshRef.current && pointData.id !== undefined) {
      // 可以通过修改点的颜色或大小来高亮
      // 这里只是打印信息，您可以根据需要扩展
    }
  };

  // 处理悬停事件 - 鼠标移入点
  // 鼠标悬停事件
  const handlePointerOver = (instanceId: number) => {
    if (hoveredPointId === points[instanceId]?.id) return; // 已经是悬停点，不重复执行

    setHoveredPointId(points[instanceId]?.id ?? null);

    if (meshRef.current) {
      meshRef.current.setColorAt(instanceId, new THREE.Color(colors.hover));
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  };

  // 鼠标移出事件
  const handlePointerOut = (instanceId: number) => {
    if (hoveredPointId !== points[instanceId]?.id) return; // 不是当前悬停点，不执行

    setHoveredPointId(null);

    if (meshRef.current) {
      meshRef.current.setColorAt(instanceId, new THREE.Color(colors.normal));
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    }
  };

  // 每次 points 更新，更新 InstancedMesh
  useEffect(() => {
    if (!meshRef.current) return;

    // 为每个实例设置颜色属性
    points.forEach((point, i) => {
      dummy.position.set(point.position.x, point.position.y, point.position.z ?? 0.01);
      dummy.rotation.set(Math.PI / 2, 0, 0); // 沿 X 轴旋转 90 度
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // 如果是悬停状态的点，设置悬停颜色
      const currentColor = point.id === hoveredPointId ? colors.hover : colors.normal;

      // 更新位置
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // 更新颜色
      meshRef.current!.setColorAt(i, new THREE.Color(currentColor));
    });

    meshRef.current.count = points.length;
    meshRef.current.instanceMatrix.needsUpdate = true;

    // 更新实例颜色
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [points, dummy, hoveredPointId, colors]);

  // 几何体和材质
  const geometry = useMemo(() => new THREE.CylinderGeometry(0.01, 0.01, 0.001, 16), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: colors.normal,
        emissive: colors.normalEmissive,
        emissiveIntensity: 0.2,
      }),
    [colors],
  );

  // 为每个点创建单独的事件处理
  const handlePointPointerOver = (index: number) => () => {
    handlePointerOver(index);
  };

  const handlePointPointerOut = (index: number) => () => {
    handlePointerOut(index);
  };

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, points.length]}
        onPointerOver={(e) => {
          if (paramsPanelCollapsed) return;
          e.stopPropagation();
          if (e.instanceId !== undefined) handlePointerOver(e.instanceId);
        }}
        onPointerOut={(e) => {
          if (paramsPanelCollapsed) return;
          e.stopPropagation();
          if (e.instanceId !== undefined) handlePointerOut(e.instanceId);
        }}
      />
    </>
  );
}

export default DrawPoints;
