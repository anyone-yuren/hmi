import Konva from "konva";
import React, { memo, useState, useEffect } from "react";
import {
  Image as KonvaImage,
  Text,
  Group,
  Layer,
  Rect,
  Stage,
  Line,
} from "react-konva";
import { useAsyncEffect } from "ahooks";
import { IPoint } from "../../index.d";
import chargeImages from "../../../assets/points/charge.png";
import parkingImages from "../../../assets/points/parking.png";

interface IMapPointsProps {
  visible: boolean;
  points: IPoint[];
  stationProps: any;
  onPointsClick: (point: IPoint) => void;
  stationTextProps?: any;
  stationTextVisible?: boolean;
}
const textFontSize = 4;
const StationPoints = (props: IMapPointsProps) => {
  const {
    points,
    stationProps,
    onPointsClick,
    visible,
    stationTextProps = {},
    stationTextVisible,
  } = props;
  const [imagesHashMap, setImagesHashMap] = useState({});
  const [textSizeHashMap, setTextSizeHashMap] = useState<
    Record<IPoint["id"], any>
  >({});
  // const images = import.meta.glob('@gbeata/mapping/assets/points/*.png');
  // const images = import.meta.glob('../../../assets/points/*.png');
  const getPointImage = async (type: string) => {
    const imagesTypeDict = {
      2: parkingImages,
      6: chargeImages,
    };
    if (!Object.keys(imagesTypeDict).includes(type)) {
      return Promise.reject(
        new Error("[getPointImage]: 获取图片失败,类型不符合")
      );
    }
    // const imagePath = `../../../assets/points/${imagesTypeDict[type]}.png`;
    // console.log('[StationPoints]: images/imagePath => ', images, imagePath);
    // const module: any = await images[imagePath]();
    return Promise.resolve(imagesTypeDict[type]);
  };

  useAsyncEffect(async () => {
    // 这里得优化
    points?.map(async (point: IPoint) => {
      if (!imagesHashMap[point.type]) {
        const imagePath = await getPointImage(point.type.toString());
        const image = new Image();
        image.src = imagePath;
        image.onload = () => {
          setImagesHashMap((origin: any) => {
            return {
              ...origin,
              [point.type]: image,
            };
          });
        };
        image.onerror = () => {
          console.log("[StationPoints]:图片加载失败了");
        };
      }
    });
  }, [points]);
  return (
    <>
      {points?.map((station: IPoint) => {
        return (
          <Group
            key={`station_point_group_${station.id}`}
            x={station.x}
            y={-station.y}
            onClick={(event) => {
              onPointsClick && onPointsClick(station);
              event.cancelBubble = true;
            }}
            onTap={(event) => {
              onPointsClick && onPointsClick(station);
              event.cancelBubble = true;
            }}
            visible={visible}
          >
            <KonvaImage
              image={imagesHashMap[station.type]}
              {...stationProps}
            ></KonvaImage>
            {stationTextVisible && (
              <Text
                ref={(refs: any) => {
                  const { textWidth, textHeight } = refs || {};
                  textWidth &&
                    textHeight &&
                    !textSizeHashMap[station.id] &&
                    setTextSizeHashMap((origin) => {
                      return {
                        ...origin,
                        [station.id]: {
                          width: textWidth,
                          height: textHeight,
                        },
                      };
                    });
                }}
                text={station.id}
                fill={"black"}
                fontSize={textFontSize}
                offsetX={(textSizeHashMap[station.id]?.width || 2) / 2}
                offsetY={
                  (textSizeHashMap[station.id]?.height || 2) +
                  (stationProps?.height || 0) / 2
                }
                {...stationTextProps}
              ></Text>
            )}
          </Group>
        );
      })}
    </>
  );
};

export default memo(StationPoints);
