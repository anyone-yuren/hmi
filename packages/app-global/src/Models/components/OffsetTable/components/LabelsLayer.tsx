import { Text as DreiText } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import debounce from 'lodash-es/debounce';
import { memo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useOffsetTableStore } from '../store';

export const OptimizedLabels = memo(() => {
  const { points } = useOffsetTableStore();
  const { camera, gl } = useThree();
  const [visiblePoints, setVisiblePoints] = useState<any[]>([]);

  useEffect(() => {
    const updateVisibility = debounce(() => {
      if (!(camera instanceof THREE.OrthographicCamera)) return;

      // Zoom Threshold
      if (camera.zoom < 25) {
        setVisiblePoints([]);
        return;
      }

      const frustum = new THREE.Frustum();
      const matrix = new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      );
      frustum.setFromProjectionMatrix(matrix);

      // Sort candidates by distance to center
      const center = new THREE.Vector3(0, 0, 0);
      center.set(camera.position.x, camera.position.y, 0);

      const candidates: { point: any; dist: number }[] = [];
      const maxLabels = 50;

      for (let point of points) {
        const vec = new THREE.Vector3(
          point.position[0],
          point.position[1],
          point.position[2]
        );
        if (frustum.containsPoint(vec)) {
          const dist = vec.distanceToSquared(center);
          candidates.push({ point, dist });
        }
      }

      // Sort by distance (closest to center first)
      candidates.sort((a, b) => a.dist - b.dist);

      const visible = candidates.slice(0, maxLabels).map((c) => c.point);

      setVisiblePoints((prev) => {
        if (prev.length !== visible.length) return visible;
        if (prev.length > 0 && prev[0].id !== visible[0].id) return visible;
        return prev;
      });
    }, 200);

    // Listen to controls change?
    // MapControls emits 'change' event via controls ref.
    // But here we don't have direct access to controls instance easily unless we pull it from store or context.
    // Alternative: check in useFrame but throttle.

    // Let's attach listener to controls if possible, or just use throttled useFrame.
    return () => updateVisibility.cancel();
  }, [points, camera]); // Dependencies?

  // Using useFrame with throttle for camera movement updates
  useFrame((state) => {
    // We can check if camera moved
    // For simplicity, let's just run the logic throttled via a ref or counter
    // Or re-use the debounced function logic but trigger it here?
    // Actually debounce is async.

    // Let's use a simpler "check every 10 frames" logic + zoom check
    if (state.clock.elapsedTime % 0.5 < 0.1) {
      // roughly every 0.5s
      if (!(camera instanceof THREE.OrthographicCamera)) return;
      if (camera.zoom < 25) {
        setVisiblePoints((prev) => (prev.length ? [] : prev));
        return;
      }

      const zoom = camera.zoom;
      const maxLabels = Math.max(0, Math.floor((zoom - 25) * 4));
      if (maxLabels === 0) {
        setVisiblePoints((prev) => (prev.length ? [] : prev));
        return;
      }

      const frustum = new THREE.Frustum();
      const matrix = new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      );
      frustum.setFromProjectionMatrix(matrix);

      // Sort candidates by distance to center
      const center = new THREE.Vector3(0, 0, 0);
      center.set(camera.position.x, camera.position.y, 0);

      const candidates: { point: any; dist: number }[] = [];

      for (let point of points) {
        const vec = new THREE.Vector3(
          point.position[0],
          point.position[1],
          point.position[2]
        );
        if (frustum.containsPoint(vec)) {
          const dist = vec.distanceToSquared(center);
          candidates.push({ point, dist });
        }
      }

      // Sort by distance (closest to center first)
      candidates.sort((a, b) => a.dist - b.dist);

      const visible = candidates.slice(0, maxLabels).map((c) => c.point);

      setVisiblePoints((prev) => {
        if (prev.length !== visible.length) return visible;
        const allSame = prev.every((p, i) => p.id === visible[i].id);
        return allSame ? prev : visible;
      });
    }
  });

  return (
    <>
      {visiblePoints.map((p) => (
        <DreiText
          key={p.id}
          position={[p.position[0], p.position[1] + 0.2, p.position[2] + 0.6]}
          fontSize={0.2}
          color='white'
          anchorX='center'
          anchorY='middle'
          outlineWidth={0.01}
          outlineColor='black'
          font='./1Ptrg8zYS_SKggPNwK4vaqI.woff'
        >
          {p.id}
        </DreiText>
      ))}
    </>
  );
});
