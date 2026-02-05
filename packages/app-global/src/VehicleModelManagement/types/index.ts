export interface VehicleModel {
  id: string;
  name: string;
  code: string;
  type: string;
  template: string;
  stationTypeCount: number;
  status: 'enabled' | 'disabled';
  updateTime: string;
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

export const PARAMETER_GROUPS: { key: ParameterGroup; label: string }[] = [
  { key: 'basic_id', label: '基础识别参数' },
  { key: 'physical', label: '物理尺寸与几何模型' },
  { key: 'kinematics', label: '运动学 / 动力学参数' },
  { key: 'behavior', label: '行为能力开关' },
  { key: 'safety', label: '安全模型参数' },
  { key: 'planning', label: '规划与校验辅助参数' },
];
