import { mapValues } from 'lodash';
import { Arrow, Group, Rect, Text } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { useHybirdStore } from '../../Hybrid/store/hybird.store';
import { useSafetyStore } from '../store/safety.store';
import { meterToPixel } from '../utils';

const AvoidanceGroup = ({ width = 0, height = 0 }: any) => {
  const { setSetting, obstacleData } = useSafetyStore(
    useShallow((store) => {
      return {
        setSetting: store.setSetting,
        obstacleData: store.obstacleData,
      };
    }),
  );

  const obsSlectData = mapValues(obstacleData, (item) => item);
  const { stageScale } = useHybirdStore(
    useShallow((store) => {
      return {
        stageScale: store.stageScale,
      };
    }),
  );

  return obstacleData ? (
    <Group>
      <Rect
        name='left-avoidance-empty'
        onTap={() => setSetting(true)}
        onClick={() => setSetting(true)}
        width={meterToPixel(obstacleData.stop_region_left)}
        height={meterToPixel(
          height,
          //  +
          //   obstacleData.stop_distance_backward_empty +
          //   obstacleData.stop_distance_forward_empty
        )}
        x={-meterToPixel(obstacleData.stop_region_left)}
        // y={0 - meterToPixel(obstacleData.stop_distance_forward_empty)}
        // fill="red"
        stroke={'red'}
        strokeWidth={2}
        opacity={0.5}
      ></Rect>
      <Rect
        name='right-avoidance-empty'
        onTap={() => setSetting(true)}
        onClick={() => setSetting(true)}
        width={meterToPixel(obstacleData.stop_region_right)}
        height={meterToPixel(
          height,
          // +
          //   obstacleData.stop_distance_backward_empty +
          //   obstacleData.stop_distance_forward_empty
        )}
        x={meterToPixel(width)}
        // y={0 - meterToPixel(obstacleData.stop_distance_forward_empty)}
        // fill="red"
        stroke={'red'}
        strokeWidth={2}
        opacity={0.5}
      ></Rect>
      <Rect
        name='left-avoidance'
        onTap={() => setSetting(true)}
        onClick={() => setSetting(true)}
        width={meterToPixel(obstacleData.stop_distance_left_empty)}
        height={meterToPixel(height)}
        x={-meterToPixel(obstacleData.stop_distance_left_empty)}
        y={0}
        fill='yellow'
        opacity={0.5}
      ></Rect>

      <Group name='left'>
        <Arrow
          x={meterToPixel(-obstacleData.stop_distance_left_empty)}
          y={meterToPixel(height) / 2}
          points={[0, 0, meterToPixel(obstacleData.stop_distance_left_empty), 0]} // 从起点到终点的线段
          pointerLength={5} // 箭头长度
          pointerWidth={5} // 箭头宽度
          stroke='block' // 线条颜色
          fill='block'
          strokeWidth={1} // 线条宽度
        />
        {/* 第二端箭头（反向） */}
        <Arrow
          x={-meterToPixel(obstacleData.stop_distance_left_empty)}
          y={meterToPixel(height) / 2}
          points={[meterToPixel(obstacleData.stop_distance_left_empty), 0, 0, 0]} // 反向箭头
          pointerLength={5}
          pointerWidth={5}
          stroke='block'
          fill='block'
          strokeWidth={1}
        />

        {/* 添加文字标记箭头 */}
        <Text
          x={-meterToPixel(obstacleData.stop_distance_left_empty) - 30} // 文字水平居中
          y={meterToPixel(height) / 2 - 6} // 文字的位置稍微高于箭头
          text={`${obstacleData.stop_distance_left_empty}m`} // 显示矩形的宽度
          fontSize={12}
          fontFamily='Calibri'
          fill='block'
        />
      </Group>
      <Rect
        name='right-avoidance'
        onTap={() => setSetting(true)}
        onClick={() => setSetting(true)}
        width={meterToPixel(obstacleData.stop_distance_right_empty)}
        height={meterToPixel(height)}
        x={meterToPixel(width)}
        y={0}
        fill='yellow'
        opacity={0.5}
      ></Rect>
      <Group name='right'>
        <Arrow
          x={meterToPixel(width)}
          y={meterToPixel(height) / 2}
          points={[meterToPixel(obstacleData.stop_distance_right_empty), 0, 0, 0]} // 从起点到终点的线段
          pointerLength={5} // 箭头长度
          pointerWidth={5} // 箭头宽度
          stroke='block' // 线条颜色
          fill='block'
          strokeWidth={1} // 线条宽度
        />

        {/* 第二端箭头（反向） */}
        <Arrow
          x={meterToPixel(width)}
          y={meterToPixel(height) / 2}
          points={[0, 0, meterToPixel(obstacleData.stop_distance_right_empty), 0]} // 反向箭头
          pointerLength={5}
          pointerWidth={5}
          stroke='block'
          fill='block'
          strokeWidth={1}
        />

        {/* 添加文字标记箭头 */}
        <Text
          x={meterToPixel(width) + meterToPixel(obstacleData.stop_distance_right_empty) + 2} // 文字水平居中
          y={meterToPixel(height) / 2 - 6} // 文字的位置稍微高于箭头
          text={`${obstacleData.stop_distance_right_empty}m`} // 显示矩形的宽度
          fontSize={12}
          fontFamily='Calibri'
          fill='block'
        />
      </Group>
      <Rect
        name='front-avoidance'
        width={meterToPixel(width + obstacleData.stop_region_left + obstacleData.stop_region_right)}
        onTap={() => setSetting(true)}
        onClick={() => setSetting(true)}
        height={meterToPixel(obstacleData.stop_distance_forward_empty)}
        x={0 - meterToPixel(obstacleData.stop_region_left)}
        y={-meterToPixel(obstacleData.stop_distance_forward_empty)}
        fill='yellow'
        opacity={0.3}
      ></Rect>
      <Group x={meterToPixel(width) / 2} y={-(obstacleData.stop_distance_forward_empty / 10)}>
        <Arrow
          points={[0, 0, 0, -meterToPixel(obstacleData.stop_distance_forward_empty)]} // 从起点到终点的线段
          pointerLength={5} // 箭头长度
          pointerWidth={5} // 箭头宽度
          stroke='block' // 线条颜色
          fill='block'
          strokeWidth={1} // 线条宽度
        />
        {/* 第二端箭头（反向） */}
        <Arrow
          points={[0, -meterToPixel(obstacleData.stop_distance_forward_empty), 0, 0]} // 反向箭头
          pointerLength={5}
          pointerWidth={5}
          stroke='block'
          strokeWidth={1}
          fill='block'
        />

        {/* 添加文字标记箭头 */}
        <Text
          y={-meterToPixel(obstacleData.stop_distance_forward_empty) - 12} // 文字的位置稍微高于箭头
          x={-10}
          text={`${obstacleData.stop_distance_forward_empty}m`} // 显示矩形的宽度
          fontSize={12}
          fontFamily='Calibri'
          fill='block'
        />
      </Group>
      <Rect
        name='back-avoidance'
        onTap={() => setSetting(true)}
        onClick={() => setSetting(true)}
        width={meterToPixel(width + obstacleData.stop_region_left + obstacleData.stop_region_right)}
        height={meterToPixel(obstacleData.stop_distance_backward_empty)}
        x={0 - meterToPixel(obstacleData.stop_region_left)}
        y={meterToPixel(height)}
        fill='yellow'
        opacity={0.3}
      ></Rect>
      <Group x={meterToPixel(width) / 2} y={meterToPixel(height)}>
        <Arrow
          points={[0, 0, 0, meterToPixel(obstacleData.stop_distance_backward_empty)]} // 从起点到终点的线段
          pointerLength={5} // 箭头长度
          pointerWidth={5} // 箭头宽度
          stroke='block' // 线条颜色
          fill='block'
          strokeWidth={1} // 线条宽度
        />
        {/* 第二端箭头（反向） */}
        <Arrow
          points={[0, meterToPixel(obstacleData.stop_distance_backward_empty), 0, 0]} // 反向箭头
          pointerLength={5}
          pointerWidth={5}
          fill='block'
          stroke='block'
          strokeWidth={1}
        />

        {/* 添加文字标记箭头 */}
        <Text
          y={meterToPixel(obstacleData.stop_distance_backward_empty)}
          text={`${obstacleData.stop_distance_backward_empty}m`} // 显示矩形的宽度
          x={-10}
          fontSize={12}
          fontFamily='Calibri'
          fill='block'
        />
      </Group>
    </Group>
  ) : null;
};

export default AvoidanceGroup;
