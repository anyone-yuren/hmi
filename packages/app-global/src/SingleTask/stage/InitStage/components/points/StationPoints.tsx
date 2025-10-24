import { useAsyncEffect } from 'ahooks';
import { memo, useState } from 'react';
import { Circle, Group, Image as KonvaImage, Text } from 'react-konva';
import chargeImages from '../../../assets/points/charge.png';
import parkingImages from '../../../assets/points/parking.png';
import { IPoint } from '../../index.d';

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
  const { points, stationProps, onPointsClick, visible, stationTextProps = {}, stationTextVisible } = props;
  const [imagesHashMap, setImagesHashMap] = useState({});
  const [textSizeHashMap, setTextSizeHashMap] = useState<Record<IPoint['id'], any>>({});
  const getPointImage = async (type: string) => {
    const imagesTypeDict = {
      2: parkingImages,
      6: chargeImages,
    };
    if (!Object.keys(imagesTypeDict).includes(type)) {
      return Promise.reject(new Error('[getPointImage]: 获取图片失败,类型不符合'));
    }
    return Promise.resolve(imagesTypeDict[type]);
  };

  useAsyncEffect(async () => {
    console.log('station points', points);
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
          console.log('[StationPoints]:图片加载失败了');
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
            <KonvaImage image={imagesHashMap[station.type]} {...stationProps}></KonvaImage>
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
                fill={'white'}
                fontSize={textFontSize}
                offsetX={(textSizeHashMap[station.id]?.width || 2) / 2}
                offsetY={(textSizeHashMap[station.id]?.height || 2) + (stationProps?.height || 0) / 2}
                {...stationTextProps}
              ></Text>
            )}
            {station.offsetX != null && station.offsetY && (
              <Circle
                radius={0.8} // 小圆点半径
                fill={'red'} // 红色填充
                x={0} // 相对于 Group 的位置
                y={0} // 相对于 Group 的位置
              />
            )}
          </Group>
        );
      })}
    </>
  );
};

export default memo(StationPoints);
