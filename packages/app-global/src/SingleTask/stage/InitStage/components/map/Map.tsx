import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Image as KonvaImage, Rect } from 'react-konva';
import useImage from 'use-image';
import { useShallow } from 'zustand/react/shallow';
import { useSingleTaskStore } from '../../../../store/singleTask.store';
import CloudPoints from './CloudPoints';
import RealTimePoints from './RealTimePoints';

const Map = (props: any) => {
  const { floorMapData, cloudPoints } = props;
  if (!floorMapData) return null;
  const { map_to_cad } = floorMapData;
  const [floorMapImages, setFloorMapImages] = useState<any>(null);
  const [floorMapSize, setFloorMapSize] = useState<any>({
    width: 0,
    height: 0,
  });
  const { t } = useTranslation();
  const imagesRef = useRef<any>(null);
  const prevData = useRef<any>(null);

  const { showRealTimePoints } = useSingleTaskStore(
    useShallow((state) => ({
      showRealTimePoints: state.showRealTimePoints,
    })),
  );

  useEffect(() => {
    if (floorMapData?.data && Object.keys(floorMapData?.data).length) {
      setFloorMapSize({
        width: floorMapData?.data?.width,
        height: floorMapData?.data?.height,
      });
      if (floorMapData?.data?.pic) {
        const img = new window.Image();
        img.src = `data:image/png;base64,${floorMapData?.data?.pic}`;
        img.onload = () => setFloorMapImages(img);
      }
    }
  }, [floorMapData?.data]);

  const [image] = useImage(`data:image/png;base64,${cloudPoints?.data?.pic}`);
  if (cloudPoints?.data?.pic && image) {
    imagesRef.current = image;
    prevData.current = cloudPoints;
  }

  useEffect(() => {
    console.log('showRealTimePoints', showRealTimePoints);
  }, [showRealTimePoints]);

  return (
    <>
      <Group name='map'>
        <KonvaImage
          cache={true}
          perfectDrawEnabled={false}
          image={floorMapImages}
          width={floorMapSize?.width}
          height={floorMapSize?.height}
          x={map_to_cad?.x * 20}
          y={0 - map_to_cad?.y * 20}
          offsetY={floorMapSize?.height}
          rotation={0 - (map_to_cad?.theta * 180) / Math.PI}
        ></KonvaImage>
        <Rect
          width={floorMapSize?.width} // 宽度与图片相同
          height={floorMapSize?.height} // 高度与图片相同
          x={map_to_cad?.x * 20} // X 坐标与图片相同
          y={0 - map_to_cad?.y * 20} // Y 坐标与图片相同
          offsetY={floorMapSize?.height} // 垂直偏移量与图片相同
          rotation={0 - (map_to_cad?.theta * 180) / Math.PI} // 旋转角度与图片相同
          stroke={'#00d1d1'} // 边框颜色
          strokeWidth={1} // 边框宽度
        />
        <CloudPoints></CloudPoints>
        {showRealTimePoints && <RealTimePoints></RealTimePoints>}
      </Group>
    </>
  );
};

export default memo(Map);
