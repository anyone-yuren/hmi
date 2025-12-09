import { useRef } from 'react';
import { Group, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { useShallow } from 'zustand/react/shallow';
import { useHybirdStore } from '../../store/hybird.store';

export default function PointsCloud() {
  const { scanHead, robot_current_status, showPointCloud } = useHybirdStore(
    useShallow((state) => ({
      scanHead: state.scan_head,
      showPointCloud: state.showPointCloud,
      robot_current_status: state.robot_current_status,
    })),
  );
  // system_status为【1，2】时，表示正在建图或者是扩展
  // const { system_status = 0 } = robot_current_status;

  const showmageRef = useRef<any>();

  const prevData = useRef<any>();

  const [image] = useImage(`data:image/png;base64,${scanHead?.data?.pic}`);

  if (image) {
    showmageRef.current = image;
    prevData.current = scanHead;
  }

  return (
    <Group>
      {/* {scanImage && [1, 2].includes(system_status as number) && ( */}
      {showPointCloud && prevData?.current && (
        <KonvaImage
          image={image || showmageRef.current}
          name='point-scanImage'
          x={prevData?.current?.pose.x * 20} // 设置图片的 x 位置
          y={0 - prevData.current?.pose.y * 20} // 设置图片的 y 位置
          width={prevData.current?.data.width} // 设置图片的宽度
          height={prevData.current?.data.height} // 设置图片的高度
          offsetX={0}
          offsetY={prevData.current?.data.height}
          rotation={-(prevData.current?.pose.theta * 180) / Math.PI}
          // 阴影
          // shadowColor="black"
          // shadowBlur={5}
          // 透明度
          opacity={1}
        />
      )}
      {/* )} */}
    </Group>
  );
}
