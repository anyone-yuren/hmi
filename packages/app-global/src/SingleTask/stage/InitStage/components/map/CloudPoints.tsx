import { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { useShallow } from 'zustand/react/shallow';
import { useSingleTaskStore } from '../../../../store/singleTask.store';

const CloudPoints = (props: any) => {
  const { t } = useTranslation();
  const imagesRef = useRef<any>(null);
  const prevData = useRef<any>(null);

  const { cloudPoints, setCloudPoints } = useSingleTaskStore(
    useShallow((state) => ({
      cloudPoints: state.cloudPoints,
      setCloudPoints: state.setCloudPoints,
    })),
  );

  const [image] = useImage(`data:image/png;base64,${cloudPoints?.data?.pic}`);
  if (image) {
    imagesRef.current = image;
    prevData.current = cloudPoints;
  }

  useEffect(() => {
    setCloudPoints({});
    prevData.current = null;
    imagesRef.current = null;
  }, []);

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
