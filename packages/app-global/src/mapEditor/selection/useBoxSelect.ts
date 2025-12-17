// useBoxSelect.ts
import { useThree } from '@react-three/fiber';
import { spatialIndex } from './spatialIndex';

export function useBoxSelect() {
  const { camera, gl } = useThree();

  const finish = (start: [number, number], end: [number, number]) => {
    const rect = gl.domElement.getBoundingClientRect();
    const minX = Math.min(start[0], end[0]);
    const maxX = Math.max(start[0], end[0]);
    const minY = Math.min(start[1], end[1]);
    const maxY = Math.max(start[1], end[1]);

    const candidates = spatialIndex.search({ minX: -Infinity, minY: -Infinity, maxX: Infinity, maxY: Infinity });

    const selected = candidates.filter((obj) => {
      const pos = obj.position.clone();
      const ndc = pos.project(camera);
      const x = ((ndc.x + 1) / 2) * rect.width;
      const y = ((1 - ndc.y) / 2) * rect.height;
      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    });

    return selected;
  };

  return { finish };
}
