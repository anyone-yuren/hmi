/**
 * @description: 获取传感器列表，绘制到地图上
 */
import { useRequest } from 'ahooks';
import { Circle, Group } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { getDeviceList } from '../../service';
import { useSafetyStore } from '../../store/safety.store';

// 将米转换成像素
const meterToPixel = (meter: number) => Math.floor(meter * 1000);

const DeviceList = () => {
  const { obsInfo } = useSafetyStore(
    useShallow((state) => ({
      obsInfo: state.obsInfo,
    })),
  );

  const { sensor_sources = [4, 5], x, y } = obsInfo;
  const { data: deviceList = [] } = useRequest(getDeviceList);

  console.log(deviceList);

  // 自定义缓动函数
  // const customEasing = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  // ✅ 使用 loop 循环动画，而不是 setState 翻转
  // const springs = useSpring({
  //   from: { scaleX: 1, scaleY: 1, opacity: 1 },
  //   to: async (next) => {
  //     while (true) {
  //       await next({ scaleX: 2, scaleY: 2, opacity: 0 });
  //       await next({ scaleX: 0.5, scaleY: 0.5, opacity: 1 });
  //     }
  //   },
  //   config: {
  //     duration: 600,
  //   },
  // });

  return (
    <Group name='device'>
      {sensor_sources.length ? (
        <Circle radius={30} fill='red' x={meterToPixel(0 - y)} y={meterToPixel(0 - x)}></Circle>
      ) : null}
      {deviceList?.data?.map((item) => (
        <Circle
          key={item.id}
          radius={20}
          fill={sensor_sources.includes(item.id) ? '#0000ff' : '#00ff00'}
          // {...springs}
          x={0 - meterToPixel(item.y)}
          y={0 - meterToPixel(item.x)}
        />
      ))}
    </Group>
  );
};

export default DeviceList;
