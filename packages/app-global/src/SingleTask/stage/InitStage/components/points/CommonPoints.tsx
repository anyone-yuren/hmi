import { memo, useEffect, useState } from "react";
import { Circle, Group, Text } from "react-konva";

import { IOriginPoints, IPoint } from "../../index.d";

interface IMapPointsProps {
  visible: boolean;
  points: IPoint[];
  commonProps: any;
  commonTextVisible: boolean;
  commonTextProps: IOriginPoints["commonTextProps"] | any;
  onPointsClick: (point: IPoint) => void;
}
const CommonPoints = (props: IMapPointsProps) => {
  const {
    visible,
    points,
    commonProps,
    commonTextVisible,
    commonTextProps,
    onPointsClick,
  } = props;
  // const { textVisible, ...renderProps } = commonProps;
  const [textSizeHashMap, setTextSizeHashMap] = useState<
    Record<IPoint["id"], any>
  >({});
  const textFontSize = 4;
  useEffect(() => {
    // HTMLFormControlsCollection.log
    // console.log('commonTextProps', commonTextProps);
  }, [commonTextProps]);
  return (
    <>
      {points?.map((point: IPoint) => {
        return (
          <Group
            key={"common_point_group_" + point.id}
            x={point.x}
            y={-point.y}
            onClick={(event) => {
              onPointsClick && onPointsClick(point);
              event.cancelBubble = true;
            }}
            onTap={(event) => {
              onPointsClick && onPointsClick(point);
              event.cancelBubble = true;
            }}
            visible={visible}
          >
            {commonTextVisible && (
              <Text
                ref={(refs: any) => {
                  const { textWidth, textHeight } = refs || {};
                  textWidth &&
                    textHeight &&
                    !textSizeHashMap[point.id] &&
                    setTextSizeHashMap((origin) => {
                      return {
                        ...origin,
                        [point.id]: {
                          width: textWidth,
                          height: textHeight,
                        },
                      };
                    });
                }}
                text={point.id}
                fill={"black"}
                fontSize={textFontSize}
                offsetX={(textSizeHashMap[point.id]?.width || 2) / 2}
                offsetY={
                  (textSizeHashMap[point.id]?.height || 2) +
                  commonTextProps?.height / 2
                }
                {...commonTextProps}
              ></Text>
            )}
            <Circle
              cache={true}
              hitStrokeWidth={0}
              shadowForStrokeEnabled={false}
              perfectDrawEnabled={false}
              onClick={() => {
                console.log("handle point", point);
              }}
              {...commonProps}
            />
          </Group>
        );
      })}
    </>
  );
};

export default memo(CommonPoints);
