import Konva from 'konva';
import React, { type ElementRef, forwardRef, memo, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Group, Layer, Line, Rect, Stage } from 'react-konva';
import { Html } from 'react-konva-utils';

import { getBoundaryFromExtremum } from '../utils';
import useBoundary from './hooks/useBoundary';
import useLines from './hooks/useLines';
import usePoints from './hooks/usePoints';
import IInitStage, { IPoint } from './index.d';

import Map from './components/map/Map';
import Points from './components/points/Points';

import { useUpdateEffect } from 'ahooks';
import Vehicles from './components/vehicle/Vehicles';
import { useZoom } from './hooks/useZoom';

Konva.hitOnDragEnabled = true;
Konva.pixelRatio = 1;
(Konva as any).isWebGLAvailable = true;

const InitStage = forwardRef((props: IInitStage, ref) => {
  const {
    size = { width: 0, height: 0 },
    stageStyle = {
      backgroundColor: '#151620',
    },
    boundary = {},
    points,
    defaultMapCenter,
    pointsValue = undefined,
    onPointsSelect,
    activePointsPopup = undefined,
    activePointsPopupDivProps = {},
    vehicles = [],
    setAttrs = undefined,
    moveToTarget = { x: null, y: null, scale: null },
    lines,
    infiniteView, // 无限视距
    allPointsVisible,
    floorMapData = null,
    activePointStroke = '#12d1d1',
  } = props;

  const [activePoints, setActivePoints] = useState<any>([]);
  const [touchendSign, setTouchendSign] = useState(true);
  const [maxScale, setMaxScale] = useState(1);
  const [mapRationView, setMapRationView] = useState(1); // 比例尺,1像素对应多少实际地图。地图的坐标实际对应的是毫米mm
  const visibleConfig = useMemo(() => {
    return {
      polygon: false,
      line: true,
      commonPoints: allPointsVisible ? true : mapRationView <= 50 && mapRationView > 1,
      commonText: allPointsVisible ? true : mapRationView <= 30 && mapRationView > 1,
      stationPoints: true,
      stationText: true,
      storagePoints: allPointsVisible ? true : mapRationView <= 100 && mapRationView > 1,
      storageText: allPointsVisible ? true : mapRationView <= 50 && mapRationView > 1,
    };
  }, [mapRationView]);

  const [stageViewBoundary, setStageViewBoundary] = useState<any>([]);
  const stageRef = React.useRef<ElementRef<typeof Stage>>(null);
  const vehicleRef = React.useRef<any>({});
  const { currentScale, setCurrentScale } = useZoom(stageRef, {
    min: !infiniteView ? maxScale * 0.9 : 0,
    max: !infiniteView ? 0.25 : 10000,
  });
  const {
    points: boundaryPoints,
    setPoints: setBoundaryPoints,
    visible: boundaryVisible,
    props: boundaryProps,
    width: boundaryWidth,
    height: boundaryHeight,
  } = useBoundary(boundary);
  const {
    hashMap: pointHashMap,
    common: commonPoints,
    commonVisible,
    commonProps,
    commonTextVisible,
    commonTextProps,
    extremum,
    storage: storagePoints,
    storageVisible,
    storageProps,
    storageTextVisible,
    storageTextProps,
    station: stationPoints,
    stationVisible,
    stationProps,
    stationTextProps,
    stationTextVisible,
    polygon: polygonPoints,
  } = usePoints({
    ...points,
    boundary: stageViewBoundary,
    scale: currentScale,
    visibleConfig,
  });
  const {
    lines: commonLines,
    hashMap: lineHashMap,
    lineProps,
  } = useLines({
    ...lines,
    boundary: stageViewBoundary,
    scale: currentScale,
    visibleConfig,
  });

  useImperativeHandle(ref, () => ({
    setStageScale: (scale) => {
      const stage: any = stageRef.current?.getStage();
      stage.scale({ x: scale, y: scale });
      setCurrentScale(scale);
      setMapRationView(1 / scale);
    },
    getVehiclePosition: () => {
      return vehicleRef?.current?.getVehiclePosition() || {};
    },
  }));

  const initMapCenter = React.useMemo(() => {
    if (defaultMapCenter) {
      return defaultMapCenter;
    }
    if (boundaryPoints.length) {
      const [x, , , , , minY] = boundaryPoints;
      return { x, y: minY };
    }
    return { x: null, y: null };
  }, [defaultMapCenter, boundaryPoints]);

  useEffect(() => {
    if (boundaryPoints.length) return;
    if (extremum.length) {
      let [x1, y1, x2, y2] = extremum;
      setBoundaryPoints(getBoundaryFromExtremum({ minX: x1, maxX: x2, minY: -y2, maxY: -y1 }));
    }
  }, [boundaryPoints, extremum]);

  useEffect(() => {
    // 开始移动了
    const stage: any = stageRef.current?.getStage();
    const scale = moveToTarget?.scale || stage.scaleX();
    if (moveToTarget.x != null && moveToTarget.y !== null) {
      stage.scale({ x: scale, y: scale });
      setCurrentScale(scale);
      moveToTarget?.scale && setMapRationView(1 / moveToTarget?.scale);
      const target = {
        x: -moveToTarget.x * scale + size.width / 2,
        y: -moveToTarget.y * scale + size.height / 2,
      };
      stage.position(target);
    }
  }, [moveToTarget]);

  // 得动动脑子计算
  useUpdateEffect(() => {
    // 不需要初始化定位的相关逻辑，直接定位到车
    return;
    if (!size.height || !size.width) return;
    const { x, y } = initMapCenter;
    if (x === null && y === null) return;
    const stage: any = stageRef.current?.getStage();
    const scale = Math.min(size.width / boundaryWidth, size.height / boundaryHeight);
    const originPosition = { x: -x * scale, y: -y * scale };
    if (size.width / boundaryWidth < size.height / boundaryHeight) {
      originPosition.y = originPosition.y - (boundaryHeight * scale) / 2 + size.height / 2;
    } else {
      originPosition.x = originPosition.x - (boundaryWidth * scale) / 2 + size.width / 2;
    }
    stage.scale({ x: scale, y: scale });
    stage.position(originPosition);
    stage.batchDraw();
    setMapRationView(1 / scale);
    setMaxScale(scale);
  }, [initMapCenter, boundaryWidth, boundaryHeight, size]);

  useEffect(() => {
    if (
      points?.points?.length ||
      !floorMapData?.data ||
      !floorMapData?.map_to_cad ||
      (moveToTarget?.x != null && moveToTarget?.y != null)
    )
      return;

    const { map_to_cad, data: floorMapSize } = floorMapData;
    const stage: any = stageRef.current?.getStage();

    const scale = Math.min(size.width / floorMapSize?.width, size.height / floorMapSize?.height);
    // 这两个坐标需要区分是缩放x还是缩放y,要重新定。等换另外的图再搞。
    const map_to_cad_x = map_to_cad?.x * 20 + (size.width - floorMapSize?.width * scale) / 2;
    const map_to_cad_y = 0 - map_to_cad?.y * 20 + size?.height;

    stage.scale({ x: scale, y: scale });
    stage.position({ x: map_to_cad_x, y: map_to_cad_y });
    stage.batchDraw();
  }, [points, floorMapData, size, moveToTarget]);

  useEffect(() => {
    // 将选中的点位拿出去
    pointsValue !== undefined && setActivePoints(pointsValue);
  }, [pointsValue, activePoints]);

  // 点击点位
  const onPointsClick = (storage: IPoint) => {
    const withoutPointsValue = pointsValue === undefined;
    // 区别在这里
    let newActivePoints: IPoint['id'][] = withoutPointsValue ? [...activePoints] : [...pointsValue];
    newActivePoints.includes(storage.id)
      ? (newActivePoints = newActivePoints.filter((id: IPoint['id']) => id != storage.id))
      : newActivePoints.push(storage.id);
    withoutPointsValue && setActivePoints(newActivePoints);
    onPointsSelect && onPointsSelect(newActivePoints);
  };

  // 动态获取可视区域
  useEffect(() => {
    const { x, y, scaleX, scaleY, width, height } = stageRef?.current?.attrs;
    if (!x || !y) {
      return;
    }
    const mapStagePosition = {
      x: -x / scaleX,
      y: y / scaleY,
    };
    const mapStageWidth = {
      width: width / scaleX,
      height: height / scaleY,
    };
    setStageViewBoundary([
      mapStagePosition.x,
      mapStagePosition.y,
      mapStagePosition.x + mapStageWidth.width,
      mapStagePosition.y - mapStageWidth.height,
    ]);
    setMapRationView(1 / scaleX);
  }, [currentScale, touchendSign]);

  const moveToVehicle = (position) => {
    const scale = 3;
    const stage: any = stageRef.current?.getStage();
    stage.scale({ x: scale, y: scale });
    setCurrentScale(scale);
    moveToTarget?.scale && setMapRationView(1 / moveToTarget?.scale);
    const target = {
      x: -position.x * scale * 20 + size.width / 2,
      y: position.y * scale * 20 + size.height / 2,
    };
    stage.position(target);
  };

  return (
    <div className='relative'>
      <Stage
        width={size.width}
        height={size.height}
        style={stageStyle}
        draggable
        ref={stageRef}
        onTouchend={() => {
          setTouchendSign((origin) => !origin);
        }}
        onDragEnd={() => {
          setTouchendSign((origin) => !origin);
        }}
        onContextMenu={(event) => {
          event.evt.preventDefault();
        }}
        onClick={() => {
          if (!activePoints.length) {
            return;
          }
          setActivePoints([]);
          onPointsSelect && onPointsSelect([]);
        }}
        onTap={() => {
          if (!activePoints.length) {
            return;
          }
          setActivePoints([]);
          onPointsSelect && onPointsSelect([]);
        }}
      >
        <Layer name='map'>
          <Map floorMapData={floorMapData} scale={currentScale}></Map>
        </Layer>
        {/* 缩放显示的问题，应该与地图实际的尺寸有关系想想如何处理 */}
        {/* 线放最底下,先看缩放的关系 */}
        {visibleConfig.line && (
          <Layer name='lines' listening={false}>
            {boundaryVisible && <Line listening={false} points={boundaryPoints} {...boundaryProps}></Line>}
            {/* Type: 1-直线，2-曲线，3-圆弧 */}
            {commonLines?.map((line: any) => {
              return (
                <Line
                  listening={false}
                  id={line.id + ''}
                  key={line.id}
                  points={visibleConfig.storagePoints ? line.controls : line.simpleControls}
                  stroke='#6d83be'
                  strokeWidth={1}
                  {...lineProps}
                />
              );
            })}
          </Layer>
        )}

        {/* 点位理论上不会变的 */}
        <Layer name='points' listening={true}>
          <Rect x={0} y={0} width={1} height={1} fill={'green'}></Rect>
          {commonVisible && visibleConfig.commonPoints && (
            <Points.Common
              points={commonPoints}
              commonTextVisible={commonTextVisible && visibleConfig.commonText}
              {...{ commonProps, commonTextProps, onPointsClick }}
            />
          )}
          {storageVisible && visibleConfig.storagePoints && (
            <Points.Storage
              activePoints={activePoints}
              points={storagePoints}
              storageTextVisible={storageTextVisible && visibleConfig.storageText}
              {...{ storageProps, storageTextProps, onPointsClick }}
            />
          )}
          {stationVisible && visibleConfig.stationPoints && (
            <Points.Station
              points={stationPoints}
              {...{
                stationProps,
                onPointsClick,
                stationTextVisible,
                stationTextProps,
              }}
            />
          )}
        </Layer>

        {/* 车应该在线上 */}
        <Layer name='vehicle' listening={false}>
          <Vehicles ref={vehicleRef} moveToVehicle={moveToVehicle}></Vehicles>
        </Layer>

        <Layer name='activePoints'>
          {activePoints?.map((id) => {
            return (
              <Group key={`ActivePoints_${id}`} x={pointHashMap[id]?.x} y={-pointHashMap[id]?.y}>
                <Rect
                  cache={false}
                  width={7}
                  height={7}
                  offsetX={7 / 2}
                  offsetY={7 / 2}
                  stroke={activePointStroke}
                  strokeWidth={0.5}
                  onClick={(event) => {
                    onPointsClick(pointHashMap[id]);
                    event.cancelBubble = true;
                  }}
                  onTap={(event) => {
                    onPointsClick(pointHashMap[id]);
                    event.cancelBubble = true;
                  }}
                />
                {activePointsPopup ? (
                  <Html
                    transform
                    transformFunc={(attrs) => {
                      const newAttrs = { ...attrs, scaleX: 1, scaleY: 1 };
                      return setAttrs ? setAttrs(attrs, currentScale) : newAttrs;
                    }}
                    divProps={{
                      ...activePointsPopupDivProps,
                    }}
                  >
                    {activePointsPopup(id)}
                  </Html>
                ) : null}
              </Group>
            );
          })}
        </Layer>
      </Stage>
      <div className='absolute bottom-0 left-0 w-full flex justify-end'>
        <div
          className='relative'
          style={{
            height: '10px',
            width: '100px',
            border: '1px solid white',
            borderTop: 'none',
            borderBottom: '5px solid white',
            bottom: '10px',
            right: '10px',
          }}
        >
          <span className='absolute' style={{ left: '50%', top: '-20px', transform: 'translateX(-50%)' }}>
            {(((mapRationView * 100) / 1000) * 20).toFixed(2) + 'm'}
          </span>
        </div>
      </div>
    </div>
  );
});

export default memo(InitStage);
