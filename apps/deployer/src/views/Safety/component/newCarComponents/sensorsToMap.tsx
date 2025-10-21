/**
 * @description: 获取传感器列表，绘制到地图上并添加动画
 */
import { useRequest } from 'ahooks';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { Circle, Group, Text } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { getDeviceList } from '../../service';
import { useSafetyStore } from '../../store/safety.store';

// 米转像素
const meterToPixel = (meter: number) => Math.floor(meter * 1000);

const DeviceList = () => {
  const groupRef = useRef<Konva.Group>(null);

  const { obsInfo } = useSafetyStore(
    useShallow((state) => ({
      obsInfo: state.obsInfo,
    })),
  );

  const { sensor_sources = [4, 5], sensor_description, x, y } = obsInfo;
  const { data: deviceList = [] } = useRequest(getDeviceList);

  useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;
    const layer = group.getLayer();
    if (!layer) return;

    // Konva.Animation 创建动画
    const anim = new Konva.Animation((frame) => {
      const time = frame?.time ?? 0;

      // 遍历 group 下的所有 Circle
      group
        .getChildren((node) => node instanceof Konva.Circle)
        .forEach((circle) => {
          const fill = circle.fill();
          if (fill === '#0000ff') {
            // 蓝色传感器呼吸闪烁
            const scale = 1 + 0.2 * Math.sin(time / 300);
            circle.scale({ x: scale, y: scale });
            const alpha = 0.8 + 0.2 * Math.sin(time / 400);
            circle.opacity(alpha);
          }
        });
    }, layer);

    anim.start();

    return () => anim.stop();
  }, [deviceList?.data, sensor_description]);
  console.log('sensor_description', sensor_description);
  console.log('deviceList', deviceList.data);

  return (
    <Group name='device' ref={groupRef}>
      {/* 当前观察者位置 */}
      {sensor_description.length ? (
        <Circle radius={30} fill='red' x={meterToPixel(0 - y)} y={meterToPixel(0 - x)} />
      ) : null}

      {/* 设备列表 */}
      {deviceList?.data?.map((item) => (
        <>
          <Circle
            key={item.id}
            radius={16}
            fill={sensor_description.includes(item.name) ? '#0000ff' : '#00ff00'}
            x={0 - meterToPixel(item.y)}
            y={0 - meterToPixel(item.x)}
          />

          <Text
            text={item.name}
            x={0 - meterToPixel(item.y)}
            y={0 - meterToPixel(item.x) - 60}
            fontSize={54}
            fill={sensor_description.includes(item.name) ? '#0000ff' : '#00ff00'}
          />
        </>
      ))}
    </Group>
  );
};

export default DeviceList;
