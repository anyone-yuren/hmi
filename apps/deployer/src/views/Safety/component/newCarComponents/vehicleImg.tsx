import { useAgvType } from '@/hooks/useAgvType';
import { useEffect, useState } from 'react';
import { Group, Image } from 'react-konva';
import { getRect } from '../../utils';

const VehicleImg = (props: {
  rectangleList: { id: number; name: string; rectangle: number[]; is_active: boolean; associated_device: number }[];
}) => {
  const { rectangleList = [] } = props;
  const [a, b, c, d] = rectangleList[0]?.rectangle;
  const headerRect = getRect([c, d, a, b]);
  const [a1, b1, c1, d1] = rectangleList[1]?.rectangle;
  const forkarmRect = getRect([c1, d1, a1, b1]);
  const agvType = useAgvType();
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  // 获取图片路径（注意这里用相对路径，不要 "@/..."）
  const getImagePath = (imageName: string) => {
    return new URL(`../../../../assets/vehicles/${imageName}`, import.meta.url).href;
  };

  useEffect(() => {
    if (!agvType) return;

    const imageObj = new window.Image();
    imageObj.src = getImagePath(`${agvType}.png`);
    imageObj.onload = () => {
      setImg(imageObj); // ✅ 只有加载完成才传给 <Image />
    };
  }, [agvType]);

  return (
    <Group>
      {img && (
        <Image
          image={img} // ✅ 必须是 HTMLImageElement
          x={headerRect.x}
          y={headerRect.y}
          opacity={0.8}
          width={headerRect.width}
          height={headerRect.height + forkarmRect.height}
          // height={headerRect.height}
        />
      )}
    </Group>
  );
};

export default VehicleImg;
