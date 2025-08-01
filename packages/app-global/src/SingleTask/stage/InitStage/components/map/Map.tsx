import { memo, useEffect, useRef, useState } from "react";
// import vehicleImages from '../../../assets/vehicle/vector.svg';
import { useTranslation } from "react-i18next";
import { Group, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import CloudPoints from "./CloudPoints";
// grid_map: {
//     data: {
//         height: number;
//         pic: string;
//         width: number;
//     };
//     is_mapping: boolean;
//     map_to_cad: {
//         theta: number;
//         x: number;
//         y: number;
//     };
//     origin: {
//         theta: number;
//         x: number;
//         y: number;
//     };
// };
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
        {/* <KonvaImage
          image={image || imagesRef.current}
          name="point-scanImage"
          x={prevData?.current?.pose.x * 20} // 设置图片的 x 位置
          y={0 - prevData.current?.pose.y * 20} // 设置图片的 y 位置
          width={prevData.current?.data.width} // 设置图片的宽度
          height={prevData.current?.data.height} // 设置图片的高度
          offsetX={0}
          offsetY={prevData.current?.data.height}
          rotation={-(prevData.current?.pose.theta * 180) / Math.PI}
          opacity={1}
        /> */}
      </Group>
    </>
  );
};

export default memo(Map);
