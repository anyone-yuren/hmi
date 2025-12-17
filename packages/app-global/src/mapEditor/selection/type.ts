// 统一选中模型
import * as THREE from 'three';
export type SelectableType = 'point' | 'line';
export type PointSubType = 'normal' | 'bin' | 'standby';

export interface SelectableItem {
  id: string | number;
  type: SelectableType;

  //pont
  pointType?: PointSubType;
  position?: THREE.Vector3;

  // line
  lineObject?: THREE.Object3D;

  // RBush AABB
  minX?: number;
  minY?: number;
  maxX?: number;
  maxY?: number;
}
