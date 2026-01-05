import * as THREE from 'three';
import { THREE_LAYERS } from '../constants/threeLayers';

// 一键禁止命中
export function markUnpickable(obj: THREE.Object3D) {
  if (!obj) return;

  // 如果本身就是 Mesh / Line
  if (obj.isObject3D) {
    obj.traverse((o: any) => {
      if (o.isMesh || o.isLine || o.isLine2 || o.isPoints) {
        o.raycast = () => null;
      }
    });
    return;
  }
}

// 一键使物体可命中
export function markPickable(obj: THREE.Object3D) {
  obj.traverse((o) => {
    o.layers.set(THREE_LAYERS.DRAW);
    o.raycast = (raycaster, intersects) => {
      const testLayers = new THREE.Layers();
      testLayers.set(THREE_LAYERS.DRAW);
      if (o.layers.test(testLayers)) {
        raycaster.intersectObject(o, true, intersects);
      }
    };
  });
}
