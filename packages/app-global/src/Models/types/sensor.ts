export interface FilterStrategy {
  id: string;
  name: string;
  height: number;        // 高度限制
  angle: number;         // 角度范围
  verticalDist: number;  // 纵向距离
  horizontalDist: number;// 横向距离
}

export interface SensorItem {
  id: string;
  name: string;
  type: 'lidar' | 'radar' | 'camera';
  showPointCloud: boolean; // 点云显示可见性开关
  filters: FilterStrategy[];
}