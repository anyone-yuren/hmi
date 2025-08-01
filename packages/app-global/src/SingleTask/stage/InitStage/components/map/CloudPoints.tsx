import { memo, useRef } from 'react';
// import vehicleImages from '../../../assets/vehicle/vector.svg';
import { useTranslation } from 'react-i18next';
import { Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { useShallow } from 'zustand/react/shallow';
import { useSingleTaskStore } from '../../../../store/singleTask.store';
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
const CloudPoints = (props: any) => {
  const { t } = useTranslation();
  const imagesRef = useRef<any>(null);
  const prevData = useRef<any>(null);

  const { cloudPoints } = useSingleTaskStore(
    useShallow((state) => ({
      cloudPoints: state.cloudPoints,
    })),
  );

  const [image] = useImage(`data:image/png;base64,${cloudPoints?.data?.pic}`);
  if (image) {
    imagesRef.current = image;
    prevData.current = cloudPoints;
  }

  return (
    <>
      <KonvaImage
        image={image || imagesRef.current}
        name='point-scanImage'
        x={prevData?.current?.pose.x * 20} // 设置图片的 x 位置
        y={0 - prevData.current?.pose.y * 20} // 设置图片的 y 位置
        width={prevData.current?.data.width} // 设置图片的宽度
        height={prevData.current?.data.height} // 设置图片的高度
        offsetX={0}
        offsetY={prevData.current?.data.height}
        rotation={-(prevData.current?.pose.theta * 180) / Math.PI}
        opacity={1}
      />
    </>
  );
};

export default memo(CloudPoints);
