interface ControlPoint {
  edgeID: number;
  order: number;
  x: number;
  y: number;
}
interface IMapEdges {
  edgeId: number;
  directionType: number;
  type: number;
  start: string;
  end: number;
  length: number;
  controlPoint: ControlPoint[];
  isObstacle: boolean;
  isVirtual: boolean;
  floor: number;
}

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
interface IMapPoints {
  pointId: number;
  vertexType: number;
  vertexTypes: number[];
  x: number;
  y: number;
  state: number;
  isObstacle: boolean;
  obstacleVehicles: number[];
  variableBits: number;
  floor: number;
}
