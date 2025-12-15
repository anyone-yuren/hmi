// components/MouseTracker.tsx
import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

export function MouseTracker() {
  const { camera, mouse, raycaster, size } = useThree();
  const [position, setPosition] = useState<THREE.Vector3 | null>(null);
  const [screenPosition, setScreenPosition] = useState({ x: 0, y: 0 });

  // 监听鼠标移动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = e.target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();

      // 屏幕坐标
      setScreenPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // 更新3D坐标
  useEffect(() => {
    const updatePosition = () => {
      raycaster.setFromCamera(mouse, camera);

      // 检测与不同平面的交点
      const planes = [
        { normal: new THREE.Vector3(0, 0, 1), constant: 0 }, // Z=0
        { normal: new THREE.Vector3(0, 0, 1), constant: 1 }, // Z=1
        { normal: new THREE.Vector3(0, 0, 1), constant: -1 }, // Z=-1
      ];

      for (const plane of planes) {
        const intersectionPoint = new THREE.Vector3();
        const planeObj = new THREE.Plane(plane.normal, plane.constant);
        const intersects = raycaster.ray.intersectPlane(planeObj, intersectionPoint);

        if (intersects) {
          setPosition(intersectionPoint);
          break;
        }
      }
    };

    const interval = setInterval(updatePosition, 16); // ~60fps
    return () => clearInterval(interval);
  }, [camera, mouse, raycaster]);

  if (!position) return null;

  return null;
}
