export interface DeviceParameter {
  key: string;
  parameter: string;
  name: string;
  type: string;
  value: string;
  min?: number;
  max?: number;
  description?: string;
}
