// import convexHull from 'monotone-convex-hull-2d';
import React from "react";
import {
  // common
  COMMON_POINT_COLOR,
  COMMON_POINT_RADIUS,
  COMMON_POINT_TEXT_COLOR,
  // common text
  COMMON_POINT_TEXT_VISIBLE,
  STATION_POINT_HEIGHT,
  STATION_POINT_STROKE,
  // station
  STATION_POINT_WIDTH,
  STORAGE_POINT_FILL,
  STORAGE_POINT_HEIGHT,
  STORAGE_POINT_STROKE,
  STORAGE_POINT_STROKE_WIDTH,
  // storage
  STORAGE_POINT_WIDTH,
} from "../constants/index";
import { IOriginPoints, IPoint } from "../index.d";
const usePoints = (props: IOriginPoints) => {
  const {
    points = [],

    commonVisible = true,
    commonProps = {},
    commonTextVisible = true,
    commonTextProps = {},

    storageVisible = true,
    storageProps = {},
    storageTextVisible = true,
    storageTextProps = {},

    stationVisible = true,
    stationProps = {},
    stationTextVisible = true,
    stationTextProps = {},

    boundary = [],
    scale,
    visibleConfig = {},
  } = props;
  const [common_visible, set_common_visible] = React.useState(commonVisible);
  const [common_props, set_common_props] = React.useState({
    radius: COMMON_POINT_RADIUS,
    fill: COMMON_POINT_COLOR,
    textVisible: COMMON_POINT_TEXT_VISIBLE,
    ...commonProps,
  });
  const [common_text_visible, set_common_text_visible] =
    React.useState(commonTextVisible);
  const [common_text_props, set_common_text_props] = React.useState({
    fill: COMMON_POINT_TEXT_COLOR,
    height: STORAGE_POINT_WIDTH, // 用库位的点位去定义普通点的文字的高度
    ...commonTextProps,
  });

  const [storage_visible, set_storage_visible] = React.useState(storageVisible);
  const [storage_props, set_storage_props] = React.useState({
    width: STORAGE_POINT_WIDTH,
    height: STORAGE_POINT_HEIGHT,
    fill: STORAGE_POINT_FILL,
    stroke: STORAGE_POINT_STROKE,
    strokeWidth: STORAGE_POINT_STROKE_WIDTH,
    offsetX: STORAGE_POINT_WIDTH / 2,
    offsetY: STORAGE_POINT_HEIGHT / 2,
    ...storageProps,
  });
  const [storage_text_visible, set_storage_text_visible] =
    React.useState(storageTextVisible);
  const [storage_text_props, set_storage_text_props] = React.useState({
    ...storageTextProps,
  });

  const [station_visible, set_station_visible] = React.useState(stationVisible);
  const [station_props, set_station_props] = React.useState({
    width: STATION_POINT_WIDTH,
    height: STATION_POINT_HEIGHT,
    stroke: STATION_POINT_STROKE,
    offsetX: STATION_POINT_WIDTH / 2,
    offsetY: STATION_POINT_HEIGHT / 2,
    strokeWidth: STORAGE_POINT_STROKE_WIDTH,
    ...stationProps,
  });
  const [station_text_visible, set_station_text_visible] =
    React.useState(stationTextVisible);
  const [station_text_props, set_station_text_props] = React.useState({
    ...stationTextProps,
  });
  // 库位的判断: 先只判断type,看看后面是直接判断types,多个类型.
  const isStorage = (point: IPoint) => {
    return point.type === 1 || point.type === 4;
  };
  // 是特殊类型的点: 2为充电点,6为待命点,point是值引用,可以直接改.
  const isStation = (point: IPoint) => {
    if (point.types && point.types?.length > 1) {
      point.types?.includes(2) && (point.type = 2);
      point.types?.includes(6) && (point.type = 6); // 覆盖,只取一种.
      return point.types?.includes(2) || point.types?.includes(6);
    }
    return point.type === 2 || point.type === 6;
  };
  // 普通的小圆点 视觉点也当做是普通点
  const isCommon = (point: IPoint) => {
    // 大于多个点的普通点不显示
    return (
      (point.type === 0 || point.type === 3 || point.type === 5) &&
      point?.types?.length === 1
    );
  };

  const isInside = (point: IPoint) => {
    const [x1, y1, x2, y2] = boundary;
    if (!boundary.length) {
      return true;
    }
    return isPointInRectangle(point.x, point.y, x1, y1, x2, y2);
  };

  function isPointInRectangle(px, py, x1, y1, x2, y2) {
    return px >= x1 && px <= x2 && py >= y2 && py <= y1;
  }

  const origin_points = React.useMemo(() => {
    const all: any = [];
    let common: IPoint[] = [];
    let storage: IPoint[] = [];
    const station: IPoint[] = [];
    const hashMap: Record<IPoint["id"], IPoint> = {};
    // 左下和右上的点位
    let { x1, y1, x2, y2 } = {
      x1: points.length ? points[0].x : 0,
      y1: points.length ? points[0].y : 0,
      x2: points.length ? points[0].x : 0,
      y2: points.length ? points[0].y : 0,
    };

    for (let index = 0; index < points.length; index += 1) {
      const _points = points[index];
      storage_visible &&
        isStorage(_points) &&
        isInside(_points) &&
        storage.push(_points);
      station_visible &&
        isStation(_points) &&
        isInside(_points) &&
        station.push(_points);
      common_visible &&
        isCommon(_points) &&
        isInside(_points) &&
        common.push(_points);
      _points.x < x1 && (x1 = _points.x);
      _points.y < y1 && (y1 = _points.y);
      _points.x > x2 && (x2 = _points.x);
      _points.y > y2 && (y2 = _points.y);
      all.push([_points.x, -_points.y]);
      hashMap[_points.id] = _points;
      _points?.types && _points?.types.length > 2 && console.log(_points);
    }
    // 暂时做库位就行了,普通点要拉小才显示，不需要过滤
    const storage_percent = Math.ceil(storage.length / 500);
    storage.length >= 500 &&
      (storage = storage.filter((_, index) => index % storage_percent == 0));

    const common_percent = Math.ceil(common.length / 300);
    common.length >= 300 &&
      (common = common.filter((_, index) => index % common_percent == 0));

    // 直接硬补偿
    return {
      common,
      storage,
      station,
      hashMap,
      extremum: [x1 - 60, y1 - 60, x2 + 60, y2 + 60],
      polygon: [],
    };
  }, [
    station_visible,
    common_visible,
    storage_visible,
    boundary,
    points,
    scale,
    visibleConfig,
  ]);

  return {
    hashMap: origin_points.hashMap,
    extremum: origin_points.extremum,

    common: origin_points.common,
    commonProps: common_props,
    commonVisible: common_visible,

    commonTextVisible: common_text_visible,
    commonTextProps: common_text_props,

    storage: origin_points.storage,
    storageVisible: storage_visible,
    storageProps: storage_props,

    storageTextVisible: storage_text_visible,
    storageTextProps: storage_text_props,

    station: origin_points.station,
    stationVisible: station_visible,
    stationProps: station_props,

    stationTextVisible: station_text_visible,
    stationTextProps: station_text_props,

    polygon: origin_points.polygon,
  };
};
export default usePoints;
