import { useAgvType } from '@/hooks/useAgvType';
import { useEffect, useState } from 'react';
import { Group, Image } from 'react-konva';

const VehicleImg = () => {
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
          x={-200}
          y={-400}
          opacity={0.8}
          width={400}
          height={800}
        />
      )}
    </Group>
  );
};

export default VehicleImg;
