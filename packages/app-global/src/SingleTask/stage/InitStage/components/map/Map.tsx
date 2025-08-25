import { memo, useEffect, useRef, useState } from 'react';
// import vehicleImages from '../../../assets/vehicle/vector.svg';
import { useTranslation } from 'react-i18next';
import { Group, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import CloudPoints from './CloudPoints';

const Map = (props: any) => {
  const { floorMapData, cloudPoints } = props;
  const [floorMapImages, setFloorMapImages] = useState<any>(null);
  const [floorMapSize, setFloorMapSize] = useState<any>({
    width: 0,
    height: 0,
  });
  const { t } = useTranslation();
  const imagesRef = useRef<any>(null);
  const prevData = useRef<any>(null);

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
  if (image) {
    imagesRef.current = image;
    prevData.current = cloudPoints;
  }

  return (
    <>
      <Group>
        <KonvaImage
          cache={true}
          perfectDrawEnabled={false}
          image={floorMapImages}
          width={floorMapSize?.width}
          height={floorMapSize?.height}
          x={0}
          y={0}
          // offsetX={0}
          offsetY={floorMapSize?.height}
        ></KonvaImage>
        <CloudPoints></CloudPoints>
      </Group>
    </>
  );
};

export default memo(Map);
