import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export function usePickOnXYPlane() {
  const { camera, gl } = useThree();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z = 0

  return (event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();

    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );

    raycaster.setFromCamera(mouse, camera);

    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);

    return point.clone();
  };
}
