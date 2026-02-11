import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function usePickOnXYPlane() {
  const { camera, gl } = useThree();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z = 0

  return (event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) return null;

    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );

    raycaster.setFromCamera(mouse, camera);

    const point = new THREE.Vector3();
    const target = raycaster.ray.intersectPlane(plane, point);

    if (!target) return null;
    if (!Number.isFinite(target.x) || !Number.isFinite(target.y) || !Number.isFinite(target.z)) return null;

    return point.clone();
  };
}
