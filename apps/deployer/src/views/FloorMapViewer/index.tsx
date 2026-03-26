import { AimOutlined, BuildOutlined, LaptopOutlined } from '@ant-design/icons';
import { useSize } from 'ahooks';
import { Card, ConfigProvider, FloatButton } from 'antd';
import Hammer from 'hammerjs';
import Konva from 'konva';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FastLayer, Group, Image as KonvaImage, Stage } from 'react-konva';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import useMapFloorData from '../Hybrid/hooks/mapFloorData';
import { useHybirdStore } from '../Hybrid/store/hybird.store';
import CanvasOnline from './components/CanvasOnline';
import DynamicMapElements from './components/DynamicMapElements';
import OnlinePoint from './components/OnlinePoint';
interface FloorMapViewerProps {
  floor?: number;
}

const FloorMapViewer: React.FC<FloorMapViewerProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useSize(containerRef);
  const { getFloorMapData } = useMapFloorData();
  const [stage, setStage] = useState<Konva.Stage | null>(null);
  const navigate = useNavigate();

  const handleStageRef = useCallback((node: Konva.Stage) => {
    if (node) {
      setStage(node);
    }
  }, []);

  useEffect(() => {
    if (!stage) return;

    // 初始化居中
    const container = stage.container();
    if (container) {
      const { offsetWidth, offsetHeight } = container;
      stage.position({ x: offsetWidth / 2, y: offsetHeight / 2 });
      stage.scale({ x: 1, y: 1 });
      stage.batchDraw();
    }

    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isMobile) return;

    let hammer: HammerManager | null = null;
    // 动态引入 hammerjs 避免打包时 window undefined 问题，并增加 try-catch
    try {
      hammer = new Hammer(stage.container());
      hammer.get('pinch').set({ enable: true });

      let oldScale = stage.scaleX();
      let oldPos = { x: 0, y: 0 };

      hammer.on('pinchstart', () => {
        setIsDrag(true);
        oldScale = stage.scaleX();
        oldPos = stage.position();
      });

      hammer.on('pinchmove', (e: any) => {
        requestAnimationFrame(() => {
          const pointer = stage.getPointerPosition();
          if (!pointer) return;
          const newScale = oldScale * e.scale;
          // 限制最小缩放
          const limitedScale = Math.max(0.5, newScale);
          const mousePointTo = {
            x: (pointer.x - oldPos.x) / oldScale,
            y: (pointer.y - oldPos.y) / oldScale,
          };
          stage.scale({ x: limitedScale, y: limitedScale });
          stage.position({
            x: pointer.x - mousePointTo.x * limitedScale,
            y: pointer.y - mousePointTo.y * limitedScale,
          });
          stage.batchDraw();
        });
      });

      hammer.on('pinchend', () => {
        setIsDrag(false);
      });
    } catch (e) {
      console.error('Hammerjs init failed:', e);
    }

    return () => {
      if (hammer) {
        hammer.off('pinch');
        hammer.destroy();
      }
    };
  }, [stage]);

  const onWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage()!;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition()!;

    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    newScale = Math.max(0.5, Math.min(5, newScale));

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage.position(newPos);
    stage.batchDraw();

    setIsDrag(true);
    if ((window as any).wheelTimeout) clearTimeout((window as any).wheelTimeout);
    (window as any).wheelTimeout = setTimeout(() => {
      setIsDrag(false);
    }, 200);
  };

  const { floorMapData, isDrag, robot_current_status, agvPosition, showPointCloud, setShowPointCloud, setIsDrag } =
    useHybirdStore(
      useShallow((state) => ({
        floorMapData: state.floorData,
        isDrag: state.isDrag,
        robot_current_status: state.robot_current_status,
        agvPosition: state.agvPosition,
        showPointCloud: state.showPointCloud,
        setShowPointCloud: state.setShowPointCloud,
        setIsDrag: state.setIsDrag,
      })),
    );

  const [floor, setFloor] = React.useState(robot_current_status.floor_number || 1);

  // 定位到车辆位置
  const locateVehicle = useCallback(() => {
    if (!stage || !agvPosition) return;
    const container = stage.container();
    const { offsetWidth, offsetHeight } = container;

    // 假设 AGV 坐标需要转换 (x/50, -y/50)
    // 目标是让 AGV 处于屏幕中心
    // stage.x = center.x - agv.x * scale
    // stage.y = center.y - agv.y * scale

    const agvX = agvPosition.x / 50;
    const agvY = -agvPosition.y / 50;

    // 保持当前缩放比例，或者重置为 1？通常重置为 1 或保持当前缩放
    // 这里重置为 1 以确保可见
    const scale = 1;

    stage.to({
      x: offsetWidth / 2 - agvX * scale,
      y: offsetHeight / 2 - agvY * scale,
      scaleX: scale,
      scaleY: scale,
      duration: 0.3,
    });
  }, [stage, agvPosition]);

  // 初始化时定位
  useEffect(() => {
    if (stage && agvPosition && agvPosition.x !== undefined) {
      // 简单防抖或只执行一次?
      // 需求：初始化的时候车辆位置显示在视图中间
      // 可以加个 ref 标记是否已初始化
    }
  }, [stage]); // 依赖 agvPosition 可能会导致每次移动都重置，需要控制

  const initRef = useRef(false);
  useEffect(() => {
    if (stage && agvPosition && agvPosition.x !== undefined && !initRef.current) {
      locateVehicle();
      initRef.current = true;
    }
  }, [stage, agvPosition, locateVehicle]);

  const floorMapDataRef = useRef(floorMapData);
  if (!isDrag) {
    floorMapDataRef.current = floorMapData;
  }
  const currentFloorMapData = floorMapDataRef.current;

  // 请求楼层数据
  useEffect(() => {
    if (floor) {
      getFloorMapData(floor);
    }
  }, [floor]);

  // 处理地图图片
  const { grid_map } = currentFloorMapData || {};
  const data = grid_map ? grid_map.data : {};
  const map_to_cad = grid_map ? grid_map.map_to_cad : null;
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (data && data.pic) {
      const img = new window.Image();
      img.src = `data:image/png;base64,${data.pic}`;
      img.onload = () => setImage(img);
    } else {
      setImage(null);
    }
  }, [data?.pic]);

  const renderMap = useMemo(() => {
    if (!image || !data || !map_to_cad) return null;

    return (
      <KonvaImage
        image={image}
        name='floor_slam_map_standalone'
        x={map_to_cad?.x * 20}
        y={0 - map_to_cad?.y * 20}
        width={data.width}
        height={data.height}
        offset={{ x: 0, y: data?.height }}
        rotation={0 - (map_to_cad?.theta * 180) / Math.PI}
      />
    );
  }, [image, data, map_to_cad]);

  const locationToPc = () => {
    navigate('/hybridPc');
  };

  return (
    <div className='w-full h-full relative bg-white' ref={containerRef}>
      {size && (
        <Stage
          width={size.width}
          height={size.height}
          ref={handleStageRef}
          draggable={true}
          onWheel={onWheel}
          onDragStart={() => setIsDrag(true)}
          onDragEnd={() => setIsDrag(false)}
        >
          <FastLayer name='standalone-map-layer'>
            <Group name='map'>{renderMap}</Group>
          </FastLayer>
          <DynamicMapElements />
          <CanvasOnline />
        </Stage>
      )}
      <ConfigProvider theme={{}}>
        {/* 悬浮控件区域 */}
        <div className='absolute top-4 left-4 z-10 flex flex-col gap-2'>
          <Card size='small' className='w-[220px]'>
            <OnlinePoint />
          </Card>
        </div>

        <div className='absolute right-6 bottom-6 z-10 flex gap-4'>
          <FloatButton
            icon={<BuildOutlined />}
            type={showPointCloud ? 'primary' : 'default'}
            onClick={() => setShowPointCloud(!showPointCloud)}
            style={{ position: 'relative', inset: 'auto' }}
          />
          <FloatButton
            icon={<AimOutlined />}
            type='primary'
            onClick={locateVehicle}
            style={{ position: 'relative', inset: 'auto' }}
          />
          <FloatButton
            icon={<LaptopOutlined />}
            type='primary'
            onClick={locationToPc}
            style={{ position: 'relative', inset: 'auto' }}
          />
        </div>
      </ConfigProvider>
    </div>
  );
};

export default FloorMapViewer;
