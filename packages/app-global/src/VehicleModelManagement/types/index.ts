export interface VehicleModel {
  id: string;
  name: string;
  code: string;
  type: string;
  template: string;
  stationTypeCount: number;
  status: 'enabled' | 'disabled';
  updateTime: string;
  trayModels?: string[];
  parkingRuleIds?: string[];
  parameterValues?: Record<string, any>; // Stores values for each parameter group
}

export type VehicleType = 'x20' | 'SE15' | 'SE14' | 'K16' | 'O20' | 'R16';

export type ParameterGroup =
  | 'basic_id'
  | 'physical'
  | 'kinematics'
  | 'behavior'
  | 'safety'
  | 'planning';

export interface ParameterConfig {
  [key: string]: any;
}

export const VEHICLE_TYPES: VehicleType[] = [
  'x20',
  'SE15',
  'SE14',
  'K16',
  'O20',
  'R16',
];

export const TRAY_MODELS = [
  { label: 'Standard Tray T1', value: 'T1' },
  { label: 'Heavy Tray T2', value: 'T2' },
  { label: 'Compact Tray T3', value: 'T3' },
];

export const PARAMETER_GROUPS: { key: ParameterGroup; label: string }[] = [
  { key: 'basic_id', label: '基础识别参数' },
  { key: 'physical', label: '物理尺寸与几何模型' },
  { key: 'kinematics', label: '运动学 / 动力学参数' },
  { key: 'behavior', label: '行为能力开关' },
  { key: 'safety', label: '安全模型参数' },
  { key: 'planning', label: '规划与校验辅助参数' },
];

// Constants for select options
export const REFERENCE_POINTS = [
  { label: 'Center', value: 'CENTER' },
  { label: 'Rear Axle', value: 'REAR_AXLE' },
  { label: 'Front Axle', value: 'FRONT_AXLE' },
];

export const STEERING_TYPES = [
  { label: 'Differential (Diff)', value: 'DIFF' },
  { label: 'Ackermann', value: 'ACKERMANN' },
  { label: 'Omni', value: 'OMNI' },
];

export interface ParkingRule {
  id: string;
  name: string;
  vehicleModelIds: string[];
  stationType: string; // or string[] if multiple types
  priority: number;
  enabled: boolean;
  description?: string;
  // Parking Point Generation Rules
  parkingPoint: {
    anchor: string;
    offsetX: number;
    offsetY: number;
    direction: string;
    angle: number;
  };
  // Safety Constraints
  safety: {
    visualDetection: boolean;
    obstacleAvoidanceScheme?: string;
  };
  updateTime: string;
}
