import { Vector3 } from 'three';
import { SelectLineData } from '../store';

export function buildSelectLineData(line: any): SelectLineData {
  const start = line.start;
  const end = line.end;

  const dir = end.clone().sub(start);
  const length = dir.length();
  const angle = Math.atan2(dir.y, dir.x); // XY 平面角度（rad）

  return {
    id: line.id,
    length,
    angle,
    points: line.points.map((p: any) => ({
      x: p.x,
      y: p.y,
      z: p.z,
    })),
    startPointId: line.startPointId,
    endPointId: line.endPointId,
  };
}

export function buildBezierSelectLineData(curve: {
  id: number;
  controlPoints: Vector3[];
  sampledPoints: Vector3[];
}): SelectLineData {
  const points = curve.sampledPoints;

  const start = points[0];
  const end = points[points.length - 1];

  const dir = end.clone().sub(start);
  const length = dir.length();
  const angle = Math.atan2(dir.y, dir.x); // XY 平面角度（rad）

  return {
    id: curve.id,
    length,
    angle,
    points: points.map((p) => ({
      x: p.x,
      y: p.y,
      z: p.z,
    })),
  };
}
