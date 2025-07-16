export enum EOperationMode {
  Drag = 'drag',
  Selection = 'selection',
  Rect = 'rect',
  Point = 'anchor',
}

export enum ETabKey {
  Overview = 'overview',
  Area = 'area',
  Tunnel = 'tunnel',
  TunnelArea = 'tunnelArea',
  Layer = 'layer',
  RCL = 'rcl',
  Location = 'location',
  Shelf = 'shelf',
  Route = 'route',
  LocationGroup = 'locationGroup',
  TransferPosition = 'transferPosition',
  TransferSlot = 'transferSlot',
}

export enum EColor {
  area = '#007aff',
  tunnel = '#78716c',
  shelf = '#a855f7',
  location = '#7e22ce',
  rcsPoint = '#333',
  stagePoint = '#4f46e5',
  transferPosition = '#22c55e',
  transferSlot = '#14532d',
  layer = '#f59e0b',
  active = '#f97316',
  rcl = '#2dd4bf',
}

export enum EViewType {
  '2D' = '2D',
  '3D' = '3D',
}

export enum ETabViewMode {
  WMS = 'wms',
  WCS = 'wcs',
  Draw = 'draw',
}
