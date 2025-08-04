import { useUpdateEffect } from 'ahooks';
import Konva from 'konva';
import { memo, useEffect, useRef, useState } from 'react';
import { Group, Image as KonvaImage } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { useHybirdStore } from '../../store/hybird.store';
const SlamLayer = () => {
  const mapRef = useRef(null);

  const {
    floorMapData,
    addSlamMappingData,
    robot_current_status,
    slam_frozen_map,
    hybirdStage,
    setStagePos,
    setStageScale,
  } = useHybirdStore(
    useShallow((state) => ({
      floorMapData: state.floorData,
      addSlamMappingData: state.addSlamMappingData,
      robot_current_status: state.robot_current_status,
      slam_frozen_map: state.slam_frozen_map,
      hybirdStage: state.hybirdStage,
      setStagePos: state.setStagePos,
      setStageScale: state.setStageScale,
    })),
  );
  const { floor_number = 0, system_status = 0 } = robot_current_status;
  const [isImageReady, setIsImageReady] = useState(false);
  if (!floorMapData) return null;
  const { grid_map } = floorMapData;
  const data = grid_map ? grid_map.data : {};
  const map_to_cad = grid_map ? grid_map.map_to_cad : null;
  const slamOrigin = grid_map ? grid_map.origin : {};
  const [image, setImage] = useState(null);

  // 定位到中心
  useUpdateEffect(() => {
    if (
      !image ||
      !hybirdStage ||
      typeof hybirdStage !== 'object' ||
      !hybirdStage.attrs ||
      !map_to_cad ||
      !data?.width ||
      !data?.height ||
      !mapRef.current
    ) {
      console.log('⏳ 等待资源加载完成...');
      return;
    }
    const stage = mapRef.current.getStage();
    const scale = mapRef.current && stage?.scaleX();
    if (!scale || scale <= 0) {
      console.warn('❌ scaleX 无效:', scale);
      return;
    }

    const x = stage.width() / 2 - (data.width * scale) / 2 - map_to_cad.x * 20 * scale;
    const y = stage.height() / 2 - (data.height * scale) / 2 + data.height * scale + map_to_cad.y * 20 * scale;

    console.log('🎯 执行定位:', { x, y, scale });
    if (!stage || !stage?.attrs || !map_to_cad || !scale) return;
    stage &&
      stage.to &&
      stage.to({
        x,
        y,
        duration: 0.5,
        easing: Konva.Easings.EaseInOut,
        onFinish: () => {
          const tween = new Konva.Tween({
            node: hybirdStage,
            duration: 0.3, // 缓慢缩放的持续时间
            scaleX: 1 * 0.8, // 新的横向缩放比例
            scaleY: 1 * 0.8, // 新的纵向缩放比例
            easing: Konva.Easings.EaseInOut, // 缓动效果
            onFinish: () => {
              tween.destroy();
              // 处理画线不完整问题
              setStagePos({ x: 0, y: 0 });
              setStageScale(0.8);
            },
          });

          tween.play();
        },
      });
  }, [hybirdStage?.attrs, setStageScale, grid_map, data, hybirdStage, image]);

  // 新建的地图
  const {
    data: addSlamBuilding = {},
    map_to_cad: addSlamBuildingToCad = {},
    origin: addSlamBuildingOrigin = {},
  } = addSlamMappingData;
  const [addImage, setAddImage] = useState(null);

  useEffect(() => {
    if (addSlamBuilding && addSlamBuilding?.pic) {
      const img = new window.Image();
      img.src = `data:image/png;base64,${addSlamBuilding.pic}`;
      img.onload = () => setAddImage(img);
    }
    if (!addSlamBuilding?.pic) {
      setAddImage(null);
    }
  }, [addSlamBuilding]);

  // 渲染地图
  useEffect(() => {
    if (data && data.pic) {
      const img = new window.Image();
      img.src = `data:image/png;base64,${data.pic}`;
      img.onload = () => setImage(img);
      setIsImageReady(true); // 设置为已加载
    }
    if (!data.pic) {
      setImage(null);
      setIsImageReady(false);
    }
  }, [data]);

  // 扩展中的地图
  // 新建的地图
  const {
    data: slamFrozenData = {},
    map_to_cad: slamFrozenDataToCad = {},
    origin: slamFrozenDataOrigin = {},
  } = slam_frozen_map;

  const [frozenImage, setFrozenImage] = useState(null);

  useEffect(() => {
    if (slamFrozenData && slamFrozenData?.pic) {
      const img = new window.Image();
      img.src = `data:image/png;base64,${slamFrozenData.pic}`;
      img.onload = () => setFrozenImage(img);
    }
    if (!slamFrozenData?.pic) {
      setFrozenImage(null);
    }
  }, [slam_frozen_map]);

  return (
    <Group name='map' ref={mapRef}>
      {/* 扩展中的slam地图 固定不变的 */}
      {frozenImage && system_status === 2 && (
        <KonvaImage
          image={frozenImage}
          // opacity={0.6}
          x={(slamFrozenDataToCad.x + slamFrozenDataOrigin.x) * 20} // 设置图片的 x 位置
          y={0 - (slamFrozenDataToCad.y + slamFrozenDataOrigin.y) * 20} // 设置图片的 y 位置
          width={slamFrozenData.width} // 设置图片的宽度
          height={slamFrozenData.height} // 设置图片的高度
          offsetX={0}
          offsetY={slamFrozenData.height}
          rotation={0 - (slamFrozenDataToCad.theta * 180) / Math.PI}
        />
      )}
      {/* 渲染data中的pic图片 当systenm_status为2的时候不渲染,表示在扩展 */}
      {image && system_status !== 2 && (
        <KonvaImage
          image={image}
          name='floor_slam_map'
          // x={map_to_cad.x * 20} // 设置图片的 x 位置
          // y={0 - map_to_cad.y * 20} // 设置图片的 y 位置
          x={map_to_cad.x * 20}
          y={0 - map_to_cad.y * 20}
          width={data.width} // 设置图片的宽度
          height={data.height} // 设置图片的高度
          offset={{ x: 0, y: data.height }}
          rotation={0 - (map_to_cad.theta * 180) / Math.PI}
        />
      )}
      {/* 新建的地图  */}
      {addImage && [1, 2].includes(system_status) && (
        <KonvaImage
          image={addImage}
          // opacity={0.8}
          x={addSlamBuildingOrigin.x * 20} // 设置图片的 x 位置
          y={0 - addSlamBuildingOrigin.y * 20} // 设置图片的 y 位置
          width={addSlamBuilding.width} // 设置图片的宽度
          height={addSlamBuilding.height} // 设置图片的高度
          offsetX={0}
          offsetY={addSlamBuilding.height}
          rotation={0 - (addSlamBuildingOrigin.theta * 180) / Math.PI}
        />
      )}
    </Group>
  );
};

export default memo(SlamLayer);
