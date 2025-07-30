import { Circle, Group } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../store/safety.store';
import { meterToPixel } from '../utils';

// 根据距离计算颜色 (使用 HSL)
const getColorByDistance = (distance: number) => {
  // 最大距离设为 30 米
  const maxDistance = 5;

  // 如果距离大于30米，则设置为红色
  if (distance > maxDistance) {
    return 'hsl(0, 100%, 50%)'; // 红色 (hue 0°, 饱和度 100%，亮度 50%)
  }

  // 根据距离计算 HSL 色值，色相 (H) 从紫色到红色
  const normalizedDistance = distance / maxDistance; // 归一化距离 [0, 1]

  // 紫色对应 H = 270, 红色对应 H = 0
  const hue = 270 - normalizedDistance * 270; // 计算色相，从紫色 (270°) 到红色 (0°)

  // 饱和度和亮度保持固定 (100% 饱和度, 50% 亮度)
  const saturation = 100;
  const lightness = 50;

  // 返回计算后的 HSL 值
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const PointCloud = () => {
  const { seniorPoints, showPointCloud, cloudCategory } = useSafetyStore(
    useShallow((store) => ({
      seniorPoints: store.seniorPoints,
      showPointCloud: store.showPointCloud,
      cloudCategory: store.cloudCategory,
    })),
  );

  return (
    <Group>
      {typeof seniorPoints === 'object' &&
        seniorPoints?.map((item, index) => {
          // if (index % 5 === 0) {
          if (cloudCategory?.includes(item.id)) {
            const distance = Math.sqrt(item.x * item.x + item.y * item.y); // 计算距离
            const color = getColorByDistance(distance); // 获取颜色
            if (distance > 2 && index % 5 !== 0) return null;

            return (
              <Circle
                key={index}
                x={meterToPixel(0 - item.y)}
                y={meterToPixel(0 - item.x)}
                radius={1}
                fill={color}
                listening={false}
              />
            );
          }
        })}
    </Group>
  );
};

export default PointCloud;
