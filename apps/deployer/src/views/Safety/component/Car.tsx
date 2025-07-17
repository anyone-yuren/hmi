import { mapValues } from 'lodash';
import { Group, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { config_agv_info } from '../service';
import { meterToPixel } from '../utils/index';
import AvoidanceGroup from './avoidance';
import DeviceList from './Device';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Car = (props: any) => {
  const { t } = useTranslation();
  const [avg_info, setAvg_info] = useState<any>({});

  const getAvgInfo = async () => {
    const res = await config_agv_info();
    if (res) {
      let resData = res;
      setAvg_info(resData);
    }
  };
  useEffect(() => {
    getAvgInfo();
  }, []);

  const getForkImage = (executor: number) => {
    const ForkTypes = {
      1: '/assets/X14.png', // 假设这里有对应图片
      2: '/assets/X20.png', // 假设这里有对应图片
    };

    return ForkTypes[executor] || '/assets/X20.png'; // 默认图片
  };

  const { executor = 2 } = avg_info;

  const forkImagePath = getForkImage(executor);

  const [image] = useImage(forkImagePath); // 使用 useImage 钩子加载图片
  // const {
  //   data: footPoints = {
  //     data: {
  //       x1: 1.256,
  //       y1: 0.47,
  //       x2: -0.41,
  //       y2: 0.47,
  //       x3: -0.41,
  //       y3: -0.47,
  //       x4: 1.256,
  //       y4: -0.47,
  //     },
  //   },
  // } = useRequest(getFootPrint);
  // const [image] = useImage(X20);
  const footPoints = {
    data: {
      x4: 1.256,
      y4: 0.47,
      x1: -0.41,
      y1: 0.47,
      x2: -0.41,
      y2: -0.47,
      x3: 1.256,
      y3: -0.47,
    },
  };

  const { x1, y1, x2, y2, x3, y3, x4, y4 } = mapValues(footPoints?.data ?? {}, (value) => Number(value.toFixed(2)));
  const width = Math.abs(y1 - y2); // 或 Math.abs(x4 - x3)
  const height = Math.abs(0 - x1 - (0 - x4)); // 或 Math.abs(y2 - y4)

  // 计算左上角的坐标
  const leftTopX = 0 - y4;
  const leftTopY = 0 - x4;
  return (
    <>
      <Group
        x={meterToPixel(leftTopX)} // 假设乘以100来转换为像素
        y={meterToPixel(leftTopY)}
      >
        <Group name='car'>
          <KonvaImage
            height={meterToPixel(width)}
            width={meterToPixel(height)}
            image={image}
            name='car-image'
            rotation={90}
            offsetY={meterToPixel(width)}
            // offsetX={meterToPixel(height)}
            x={0}
            y={0}
          />
          {/* 创建叉臂 */}
          {/* <Group x={0} y={0} name="left-arm">
            <Rect
              width={20}
              height={meterToPixel(height)}
              fill="#8c8c8c"
              strokeWidth={2}
            />
          </Group>
          <Group x={-20} name="right-arm">
            <Rect
              x={meterToPixel(width)}
              y={0}
              width={20}
              height={meterToPixel(height)}
              fill="#8c8c8c"
              strokeWidth={2}
            />
          </Group>
          <Group x={0} y={0} name="car-header">
            <Rect
              width={meterToPixel(width)}
              height={50}
              fill="#fff"
              strokeWidth={2}
            />
          </Group> */}
        </Group>
        {footPoints.data ? <AvoidanceGroup width={width} height={height} /> : null}
      </Group>
      <DeviceList />
    </>
  );
};

export default Car;
