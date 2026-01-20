export type CapabilityNodeConfig = {
  id: string;
  children?: string[];
};

export const CAPABILITY_STRUCTURE: CapabilityNodeConfig[] = [
  { id: 'network' },
  { id: 'steer' },
  { id: 'camera' },
  { id: 'visual_param' },
  {
    id: 'lidar',
    children: ['lidar_2d', 'lidar_3d', 'lidar_loc'],
  },
  { id: 'avoid' },
  { id: 'chassis' },
];

export const CAPABILITY_ORDER = [
  'network',
  'steer',
  'camera',
  'visual_param',
  'lidar_2d',
  'lidar_3d',
  'lidar_loc',
  'lidar',
  'avoid',
  'chassis',
] as const;

export const CAPABILITY_LABEL: Record<string, string> = {
  network: '网络就绪',
  steer: '舵轮标定',
  camera: '相机标定',
  visual_param: '视觉参数标定',
  lidar_2d: '2D雷达标定',
  lidar_3d: '3D雷达标定',
  lidar_loc: '定位雷达标定',
  lidar: '雷达标定',
  avoid: '避障建模',
  // 底盘
  chassis: '底盘标定',
};

export const EDGES = [
  ['network', 'steer'],
  ['steer', 'camera'],
  ['camera', 'visual_param'],
  ['visual_param', 'lidar'],
  ['lidar_2d', 'lidar'],
  ['lidar_3d', 'lidar'],
  ['lidar_loc', 'lidar'],
  ['lidar', 'avoid'],
  ['avoid', 'chassis'],
];
