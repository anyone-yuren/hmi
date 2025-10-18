/**
 * @description: 获取传感器列表，绘制到地图上并添加动画
 */
import Konva from 'konva';
import { useMemo, useRef } from 'react';
import { Group, Rect } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../../store/safety.store';

// 米转像素
const meterToPixel = (meter: number) => Math.floor(meter);

const PalletModel = () => {
  const groupRef = useRef<Konva.Group>(null);

  const { obsInfo } = useSafetyStore(
    useShallow((state) => ({
      obsInfo: state.obsInfo,
    })),
  );

  const {
    has_goods,
    pallet_right_bottom_point_x = 1000,
    pallet_right_bottom_point_y = 1000,
    pallet_left_top_point_x = -1000,
    pallet_left_top_point_y = -1000,
  } = obsInfo;
  // 计算矩形的坐标和宽高
  const palletRect = useMemo(() => {
    if (
      pallet_left_top_point_x == null ||
      pallet_left_top_point_y == null ||
      pallet_right_bottom_point_x == null ||
      pallet_right_bottom_point_y == null
    ) {
      return null;
    }

    const x1 = 0 - meterToPixel(pallet_left_top_point_y);
    const y1 = 0 - meterToPixel(pallet_left_top_point_x);
    const x2 = 0 - meterToPixel(pallet_right_bottom_point_y);
    const y2 = 0 - meterToPixel(pallet_right_bottom_point_x);

    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    return {
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width,
      height,
    };
  }, [pallet_left_top_point_x, pallet_left_top_point_y, pallet_right_bottom_point_x, pallet_right_bottom_point_y]);
  return (
    <Group name='palletModel' ref={groupRef}>
      {palletRect && has_goods && (
        <Rect
          x={palletRect.x}
          y={palletRect.y}
          width={palletRect.width}
          height={palletRect.height}
          stroke={has_goods ? '#ccc' : '#fff'} // 有货绿色，无货红色
          strokeWidth={4}
          fill={'rgba(33, 33, 33, 0.4)'}
          dash={[10, 5]} // 虚线样式
          cornerRadius={10}
          opacity={0.8}
        />
      )}
    </Group>
  );
};

export default PalletModel;
