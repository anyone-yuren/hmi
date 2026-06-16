import { EColor } from '../types';
declare interface IInfoGroupRectProps {
  stroke?: string;
  fill?: string;
  opacity?: number;
}

declare interface IInfoGroupTextProps {
  fill?: string;
  fontSize?: number;
}

export const PAINTING_RECT_GROUP = 'painting';
export const PAINTED_RECTS_GROUP = 'paintedRects';
export const PAINTED_POINTS_GROUP = 'paintedPoints';
export const WAREHOUSE_GROUP = 'warehouseGroup';
export const LOCATION_POINTS_GROUP = 'locationPointsGroup';
export const RCS_POINTS_GROUP = 'rcsPointsGroup';

export const STAGE_NAME = 'editorStage';
export const BORDER_NAME = 'borderName';
export const TOOLTIP_NAME = 'tooltipName';
export const AREA_GROUP_NAME = 'areaGroupName';
export const TUNNEL_GROUP_NAME = 'tunnelGroupName';
export const LAYER_GROUP_NAME = 'layerGroupName';
export const TUNNELAREA_GROUP_NAME = 'tunnelAreaGroupName';
export const SHELF_GROUP_NAME = 'shelfGroupName';
export const STAGE_GROUP_NAME = 'stageGroupName';
export const STAGE_AREA_GROUP_NAME = 'stageAreaGroupName';
export const RCL_GROUP_NAME = 'RCLGroupName';
export const TRANSFER_POSITION_GROUP_NAME = 'tansferPositionGroupName';
export const TRANSFER_SLOT_GROUP_NAME = 'tansferSlotGroupName';

export const RCS_POINT_PREFIX = 'rcs-point-';
export const POINT_NAME_PREFIX = 'point-';
export const RECT_NAME_PREFIX = 'rect-';
export const AREA_NAME_PREFIX = 'area-';
export const lAYER_NAME_PREFIX = 'layer-';
export const RCL_NAME_PREFIX = 'rcl-';
export const LOCATION_NAME_PREFIX = 'location-';
export const TUNNEL_NAME_PREFIX = 'tunnel-';
export const TUNNELAREA_NAME_PREFIX = 'tunnelarea-';
export const SHELF_NAME_PREFIX = 'shelf-';
export const ROUTE_NAME_PREFIX = 'route-';
export const STAGE_POINT_AREA_PREFIX = 'stage-area-';
export const STAGE_POINT_PREFIX = 'stage-point-';
export const TRANSFER_POINT_PREIFX = 'transfer-point';
export const TRANSFER_POINT_AREA_PREIFX = 'transfer-area-point'; // 接驳位
export const TRANSFER_AREA_PREIFX = 'transfer-slot-area-point'; // 接驳区

export const areaRect: IInfoGroupRectProps = {
  fill: '#f7faff',
  stroke: '#2c7dfa',
  opacity: 0.8,
};
export const areaText: IInfoGroupTextProps = {
  fontSize: 48,
  fill: '#2563eb',
};

export const layerRect: IInfoGroupRectProps = {
  fill: 'transparent',
  stroke: EColor.layer,
  opacity: 0.8,
};
export const layerText: IInfoGroupTextProps = {
  fontSize: 48,
  fill: EColor.layer,
};

export const rclRect: IInfoGroupRectProps = {
  fill: 'transparent',
  stroke: EColor.rcl,
  opacity: 0.8,
};
export const rclText: IInfoGroupTextProps = {
  fontSize: 48,
  fill: EColor.rcl,
};

export const tunnelRect: IInfoGroupRectProps = {
  fill: 'transparent',
  stroke: '#999',
  opacity: 0.8,
};
export const tunnelText: IInfoGroupTextProps = {
  fontSize: 48,
  fill: '#333',
};

export const shelfRect: IInfoGroupRectProps = {
  fill: 'transparent',
  opacity: 0.8,
  stroke: '#a21caf',
};
export const shelfText: IInfoGroupTextProps = {
  fontSize: 48,
  fill: '#6b21a8',
};

export const transferSlotRect: IInfoGroupRectProps = {
  stroke: EColor.transferSlot,
  fill: 'transparent',
};

export const transferSlotText: IInfoGroupTextProps = {
  fontSize: 48,
  fill: EColor.transferSlot,
};

export const transferPositionRect: IInfoGroupRectProps = {
  stroke: EColor.transferPosition,
  fill: 'transparent',
};

export const transferPositionText: IInfoGroupTextProps = {
  fontSize: 48,
  fill: EColor.transferPosition,
};

export const stagePointsRect: IInfoGroupRectProps = {
  stroke: EColor.stagePoint,
  fill: 'transparent',
};

export const stagePointsText: IInfoGroupTextProps = {
  fontSize: 48,
  fill: EColor.stagePoint,
};
