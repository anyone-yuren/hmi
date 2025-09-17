// 智能重定位
import { useRequest } from 'ahooks';
import { memo, useEffect, useMemo } from 'react';
import { Group, Image as KonvaImage, Text } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { useHttpCode } from '../../hooks/useHttpCode';
import { useStageEvents } from '../../hooks/useStage';
import { initalPose } from '../../service';
import { useHybirdStore } from '../../store/hybird.store';
import NewAgv from '../newAgv';

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}
const ChangePose = (props: { floor: number }) => {
  const { useErrorMessage } = useHttpCode();
  const { startTouch, vehiclePosition, beginPose, showAgv, setMapLoading } = useHybirdStore(
    useShallow((store) => ({
      startTouch: store.startTouch,
      vehiclePosition: store.vehiclePosition,
      beginPose: store.beginPose,
      showAgv: store.showAgv,
      setMapLoading: store.setMapLoading,
    })),
  );

  const renderAngleText = useMemo(() => {
    if (vehiclePosition?.angle > 0) {
      return Number((vehiclePosition?.angle || 0)?.toFixed(0));
    } else {
      return Number(((vehiclePosition?.angle || 0) + 360)?.toFixed(0));
    }
  }, [vehiclePosition]);
  const { runAsync: runInitPose } = useRequest(initalPose, {
    manual: true,
    onSuccess: (res: any) => {
      if (res?.error_code !== 10000) {
        useErrorMessage(res?.error_description, res?.solution);
      }
    },
  });

  const { imageObj } = useStageEvents();
  useEffect(() => {
    if (!showAgv && beginPose && vehiclePosition.x) {
      setMapLoading(true);
      runInitPose({
        floor_number: props.floor,
        pose: {
          pose_x: vehiclePosition.x / 20,
          pose_y: 0 - vehiclePosition.y / 20,
          pose_angle: degreesToRadians(renderAngleText),
        },
      })
        .then(() => {
          setMapLoading(false);
        })
        .catch(() => {
          setMapLoading(false);
        });
    }
  }, [showAgv, beginPose, vehiclePosition, renderAngleText]);
  return (
    <Group name='pose-agv'>
      {true && beginPose && showAgv && (
        <NewAgv
          stroke={'red'}
          x={startTouch?.x}
          y={startTouch?.y}
          offsetX={10}
          offsetY={10}
          scaleX={1}
          scaleY={1}
          rotation={vehiclePosition.rotation + 180}
        />
      )}
      {false && imageObj && beginPose && showAgv && (
        <>
          <KonvaImage
            name='agv'
            image={imageObj}
            x={startTouch?.x}
            y={startTouch?.y}
            rotation={vehiclePosition.rotation}
            offsetX={46 / 2} // 偏移中心
            offsetY={10} // 偏移中心
          />
          <Text
            text={renderAngleText + '°'}
            x={startTouch?.x}
            y={startTouch?.y}
            fontSize={12}
            offsetY={30}
            fill='yellow'
          ></Text>
        </>
      )}
    </Group>
  );
};

export default memo(ChangePose);
