import { useSpring } from '@react-spring/three';
import * as THREE from 'three';

type FlyPoint = {
  x: number;
  y: number;
  zoom?: number;
} | null;

export function useFlyToPointSpring(
  controlsRef: React.RefObject<any>,
  flyToPoint: FlyPoint,
  options?: {
    defaultZoom?: number;
    tension?: number;
    friction?: number;
  },
) {
  const { defaultZoom = 100, tension = 170, friction = 26 } = options || {};

  useSpring({
    to: flyToPoint
      ? {
          x: flyToPoint.x,
          y: flyToPoint.y,
          zoom: flyToPoint.zoom ?? defaultZoom,
        }
      : undefined,

    config: {
      tension,
      friction,
    },

    onChange: ({ value }) => {
      const controls = controlsRef.current;
      if (!controls) return;

      const camera = controls.object as THREE.OrthographicCamera;

      // 平移
      camera.position.x = value.x;
      camera.position.y = value.y;

      // 缩放
      if (value.zoom !== undefined) {
        camera.zoom = value.zoom;
        camera.updateProjectionMatrix();
      }

      // 同步 target
      controls.target.set(value.x, value.y, 0);
      controls.update();
    },
  });
}
