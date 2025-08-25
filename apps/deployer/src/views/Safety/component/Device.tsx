import { animated, useSpring } from '@react-spring/konva';
import { useInterval, useRequest } from 'ahooks';
import { Circle, Group } from 'react-konva';
import { getDeviceList } from '../service';

import { memo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../store/safety.store';
import { meterToPixel } from '../utils';
const DeviceList = () => {
  const { obsInfo } = useSafetyStore(
    useShallow((state) => {
      return {
        obsInfo: state.obsInfo,
      };
    }),
  );

  const { sensor_sources = [4, 5], x, y } = obsInfo;
  const { data: deviceList = [] } = useRequest(getDeviceList);
  const [active, setActive] = useState(false);
  // 自定义缓动函数（比如easeInOut）
  const customEasing = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };
  const { scale, opacity } = useSpring({
    scale: active ? 2 : 0.5,
    opacity: active ? 0 : 1,
    config: {
      duration: active ? 600 : 0,
      friction: 20,
      tension: 180,
      easing: customEasing,
    }, // 使用更平滑的物理配置
  });

  useInterval(() => {
    setActive(!active);
  }, 600);
  return (
    <Group name='device'>
      {deviceList?.data?.map((item) => {
        if (!sensor_sources?.includes(item.id)) return null;
        return (
          <>
            <Circle radius={10} fill='red' x={meterToPixel(0 - y)} y={meterToPixel(0 - x)}></Circle>
            <animated.Circle
              radius={6}
              fill='#FF0000'
              scaleX={scale}
              scaleY={scale}
              opacity={opacity}
              x={0 - meterToPixel(item.y)}
              y={0 - meterToPixel(item.x)}
            ></animated.Circle>
            <Circle radius={4} fill='#FF0000' x={0 - meterToPixel(item.y)} y={0 - meterToPixel(item.x)}></Circle>
          </>
        );
      })}
    </Group>
  );
};
export default memo(DeviceList);
