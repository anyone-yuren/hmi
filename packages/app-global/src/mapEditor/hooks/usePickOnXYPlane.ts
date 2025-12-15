import { useThree } from '@react-three/fiber';
import { useCallback } from 'react';
import * as THREE from 'three';

export function usePickOnXYPlane() {
  const { camera } = useThree();

  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  return useCallback(
    (ndc: THREE.Vector2) => {
      raycaster.setFromCamera(ndc, camera);

      const point = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, point);

      return point;
    },
    [camera],
  );
}
