import { useAgvType } from '@/hooks/useAgvType';
import { useEffect, useState } from 'react';
import { Group, Image } from 'react-konva';
import { getRect } from '../../utils';

const VehicleImg = () => {
  const rectangle_list = [
    {
      id: 1,
      name: 'head',
      rectangle: [500, 500, 0, -500],
      is_active: false,
      associated_device: 0,
    },
    {
      id: 2,
      name: 'forkarm',
      rectangle: [0, 300, -1000, -300],
      is_active: true,
      associated_device: 1,
    },
  ];
  const headerRect = getRect(rectangle_list[0].rectangle);
  const forkarmRect = getRect(rectangle_list[1].rectangle);
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
