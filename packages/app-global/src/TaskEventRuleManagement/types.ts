export type TaskType = 'PICKUP' | 'DELIVER' | 'CHARGE' | 'RETURN_TO_STANDBY';

export type VehicleModel = 'X20' | 'X20S' | 'K16' | 'O20' | 'R16' | 'SE15';

export interface ConditionBlock {
  vehicleModels: {
    mode: 'ALL' | 'INCLUDE' | 'EXCLUDE';
    values: VehicleModel[];
  };
  vehicles: { mode: 'ALL' | 'INCLUDE' | 'EXCLUDE'; values: string[] };
  locations: {
    mode: 'ALL' | 'POINTS' | 'REGION' | 'EXCLUDE';
    values: string[];
  }; // points IDs or region coords
  heightRanges: { min: number; max: number }[];
  palletTypes: { mode: 'ALL' | 'INCLUDE' | 'EXCLUDE'; values: string[] };
}

export interface Scene {
  id: string;
  name: string;
  taskType: TaskType;
  conditions: ConditionBlock;
}

export type PointType = 'ENTRY_POINT' | 'EXIT_POINT' | 'STORAGE_POINT';

export type EventType = 'VISION' | 'ACTUATOR' | 'CHARGE';

export type VisionSubType = 'SHELF_STATUS_CHECK' | 'PALLET_POSTURE_RECOGNITION';
export type ActuatorSubType = 'LIFT_UP' | 'LIFT_DOWN';
export type ChargeSubType = 'NONE'; // Placeholder if needed

export interface EventNodeParams {
  pointType?: PointType;
  eventType?: EventType;
  subType?: VisionSubType | ActuatorSubType | ChargeSubType;
  // Add other params as needed
}

export interface EventNode {
  id: string;
  type: string; // 'customNode' for React Flow
  position: { x: number; y: number };
  data: {
    label?: string;
    params?: EventNodeParams;
    isStart?: boolean;
    isEnd?: boolean;
    error?: boolean;
    onAddNode?: (id: string) => void;
    onDeleteNode?: (id: string) => void;
  };
}

export interface EventFlow {
  id: string;
  name: string;
  taskType: TaskType;
  isDefault: boolean;
  nodes: EventNode[]; // React Flow nodes
  edges: any[]; // React Flow edges
  status: 'NORMAL' | 'CONFLICT';
}

export interface RuleRelation {
  sceneId: string;
  eventFlowId: string;
}
