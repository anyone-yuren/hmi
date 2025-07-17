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
  //   const base64 =
  //     "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIwIiBmaWxsPSJjdXJyZW50Q29sb3IiPjxhbmltYXRlIGlkPSJzdmdTcGlubmVyc1B1bHNlMzAiIGZpbGw9ImZyZWV6ZSIgYXR0cmlidXRlTmFtZT0iciIgYmVnaW49IjA7c3ZnU3Bpbm5lcnNQdWxzZTMyLmJlZ2luKzAuNHMiIGNhbGNNb2RlPSJzcGxpbmUiIGR1cj0iMS4ycyIga2V5U3BsaW5lcz0iLjUyLC42LC4yNSwuOTkiIHZhbHVlcz0iMDsxMSIvPjxhbmltYXRlIGZpbGw9ImZyZWV6ZSIgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgYmVnaW49IjA7c3ZnU3Bpbm5lcnNQdWxzZTMyLmJlZ2luKzAuNHMiIGNhbGNNb2RlPSJzcGxpbmUiIGR1cj0iMS4ycyIga2V5U3BsaW5lcz0iLjUyLC42LC4yNSwuOTkiIHZhbHVlcz0iMTswIi8+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMCIgZmlsbD0iY3VycmVudENvbG9yIj48YW5pbWF0ZSBpZD0ic3ZnU3Bpbm5lcnNQdWxzZTMxIiBmaWxsPSJmcmVlemUiIGF0dHJpYnV0ZU5hbWU9InIiIGJlZ2luPSJzdmdTcGlubmVyc1B1bHNlMzAuYmVnaW4rMC40cyIgY2FsY01vZGU9InNwbGluZSIgZHVyPSIxLjJzIiBrZXlTcGxpbmVzPSIuNTIsLjYsLjI1LC45OSIgdmFsdWVzPSIwOzExIi8+PGFuaW1hdGUgZmlsbD0iZnJlZXplIiBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBiZWdpbj0ic3ZnU3Bpbm5lcnNQdWxzZTMwLmJlZ2luKzAuNHMiIGNhbGNNb2RlPSJzcGxpbmUiIGR1cj0iMS4ycyIga2V5U3BsaW5lcz0iLjUyLC42LC4yNSwuOTkiIHZhbHVlcz0iMTswIi8+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMCIgZmlsbD0iY3VycmVudENvbG9yIj48YW5pbWF0ZSBpZD0ic3ZnU3Bpbm5lcnNQdWxzZTMyIiBmaWxsPSJmcmVlemUiIGF0dHJpYnV0ZU5hbWU9InIiIGJlZ2luPSJzdmdTcGlubmVyc1B1bHNlMzAuYmVnaW4rMC44cyIgY2FsY01vZGU9InNwbGluZSIgZHVyPSIxLjJzIiBrZXlTcGxpbmVzPSIuNTIsLjYsLjI1LC45OSIgdmFsdWVzPSIwOzExIi8+PGFuaW1hdGUgZmlsbD0iZnJlZXplIiBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBiZWdpbj0ic3ZnU3Bpbm5lcnNQdWxzZTMwLmJlZ2luKzAuOHMiIGNhbGNNb2RlPSJzcGxpbmUiIGR1cj0iMS4ycyIga2V5U3BsaW5lcz0iLjUyLC42LC4yNSwuOTkiIHZhbHVlcz0iMTswIi8+PC9jaXJjbGU+PC9zdmc+";
  //   const [image] = useImage(base64);
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
