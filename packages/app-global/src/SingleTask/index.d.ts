import Konva from 'konva';

export interface IPoint {
  id: string;
  type: number;
  types?: number[];
  state?: number;
  x: number;
  y: number;
}

export interface IVehicle {
  id: string;
  x: number;
  y: number;
  angle: number;
}

export interface ITaskItem {
  task_group_id: string;
  loop_count?: number;
  task_interval?: string;
  task_state: "Init" | "Running" | "Completed" | "Cancel" | "Error";
  tasks: ISubTaskItem[];
}

export interface ISubTaskItem {
  task_id: string;
  task_point_id: string;
  task_type: "Pick" | "Place" | "Null" | "Charge";
  task_state: "Init" | "Running" | "Completed" | "Cancel" | "Error";
  loop_count: string
}

// 0调度 3单机 100其他
export type IMode = 0 | 3 | 100
