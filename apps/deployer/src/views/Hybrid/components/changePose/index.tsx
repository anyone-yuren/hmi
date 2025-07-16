// 智能重定位
import Konva from "konva";
import React, { memo, useEffect } from "react";
import { Group, Image as KonvaImage, Text } from "react-konva";
import { useStageEvents } from "../../hooks/useStage";
import { useHybirdStore } from "../../store/hybird.store";
import { useShallow } from "zustand/react/shallow";
import { useRequest } from "ahooks";
import { initalPose } from "../../service";
import { useHttpCode } from "../../hooks/useHttpCode";

const ChangePose = (props: { floor: number }) => {
  const { useErrorMessage } = useHttpCode();
  const { startTouch, vehiclePosition, beginPose, showAgv } = useHybirdStore(
    useShallow((store) => ({
      startTouch: store.startTouch,
      vehiclePosition: store.vehiclePosition,
      beginPose: store.beginPose,
      showAgv: store.showAgv,
    }))
  );
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
      runInitPose({
        floor_number: props.floor,
        pose: {
          pose_x: vehiclePosition.x / 20,
          pose_y: 0 - vehiclePosition.y / 20,
          pose_angle: vehiclePosition.angle,
        },
      });
    }
  }, [showAgv, beginPose, vehiclePosition]);
  return (
    <Group name="pose-agv">
      {imageObj && beginPose && showAgv && (
        <>
          <KonvaImage
            name="agv"
            image={imageObj}
            x={startTouch?.x}
            y={startTouch?.y}
            rotation={vehiclePosition.rotation}
            offsetX={46 / 2} // 偏移中心
            offsetY={10} // 偏移中心
          />
          <Text
            text={vehiclePosition?.angle?.toFixed(0) + "°"}
            x={startTouch?.x}
            y={startTouch?.y}
            fontSize={12}
            offsetY={30}
            fill="yellow"
          ></Text>
        </>
      )}
    </Group>
  );
};

export default memo(ChangePose);
