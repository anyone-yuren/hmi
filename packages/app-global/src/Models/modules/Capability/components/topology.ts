export const CAPABILITY_ORDER = [
  'network',
  'steer',
  'camera',
  'lidar',
  'avoid',
  'chassis',
] as const;

export const CAPABILITY_LABEL: Record<string, string> = {
  network: '网络就绪',
  steer: '舵轮标定',
  camera: '相机标定',
  lidar: '雷达标定',
  avoid: '避障建模',
  // 底盘
  chassis: '底盘标定',
};

export const EDGES = [
  ['network', 'steer'],
  ['steer', 'camera'],
  ['camera', 'lidar'],
  ['lidar', 'avoid'],
  ['avoid', 'chassis'],
];
