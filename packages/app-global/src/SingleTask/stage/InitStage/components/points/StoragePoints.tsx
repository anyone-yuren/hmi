import { memo, useEffect, useState } from 'react';
import { Circle, Group, Image as KonvaImage, Rect, Text } from 'react-konva';
import packageImageUrl from '../../../assets/points/package.png';

import { IPoint } from '../../index.d';

interface IMapPointsProps {
  visible: boolean;
  state: number;
  points: IPoint[];
  storageProps: any;
  storageTextVisible: boolean;
  storageTextProps: any;
  onPointsClick: (points: IPoint) => void;
}
const textFontSize = 4;
const StoragePoints = (props: IMapPointsProps) => {
  const { visible, points, storageProps, storageTextVisible, onPointsClick, storageTextProps } = props;
  const [textSizeHashMap, setTextSizeHashMap] = useState<Record<IPoint['id'], any>>({});
  const [packageImages, setPackageImages] = useState('');

  useEffect(() => {
    const image = new Image();
    image.src = packageImageUrl;
    image.onload = () => {
      setPackageImages(image);
    };
    image.onerror = () => {
      console.log('[StoragePoints]:托盘加载失败了');
    };
  }, []);
  return (
    <>
      {points?.map((storage: IPoint) => {
        const isFull = storage?.state === 1;
        return (
          <Group
            key={`storage_point_group_${storage.id}`}
            x={storage.x}
            y={-storage.y}
            onClick={(event) => {
              onPointsClick && onPointsClick(storage);
              event.cancelBubble = true;
            }}
            onTap={(event) => {
              onPointsClick && onPointsClick(storage);
              event.cancelBubble = true;
            }}
            visible={visible}
          >
            {!isFull ? (
              <Rect
                cache={true}
                hitStrokeWidth={0}
                shadowForStrokeEnabled={false}
                perfectDrawEnabled={false}
                {...storageProps}
              />
            ) : (
              <KonvaImage
                cache={true}
                hitStrokeWidth={0}
                shadowForStrokeEnabled={false}
                perfectDrawEnabled={false}
                image={packageImages}
                {...storageProps}
              ></KonvaImage>
            )}
            {storage.offsetX != null && storage.offsetY != null && (
              <Circle
                radius={0.8} // 小圆点半径
                fill={'red'} // 红色填充
                x={0} // 相对于 Group 的位置
                y={0} // 相对于 Group 的位置
              />
            )}
            {storageTextVisible && (
              <Text
                ref={(refs: any) => {
                  const { textWidth, textHeight } = refs || {};
                  textWidth &&
                    textHeight &&
                    !textSizeHashMap[storage.id] &&
                    setTextSizeHashMap((origin) => {
                      return {
                        ...origin,
                        [storage.id]: {
                          width: textWidth,
                          height: textHeight,
                        },
                      };
                    });
                }}
                text={storage.id}
                fill={'#3e86ff'}
                fontSize={textFontSize}
                offsetY={(textSizeHashMap[storage.id]?.height || 2) / 2 - 0.5}
                offsetX={(textSizeHashMap[storage.id]?.width || 2) / 2}
                listening={false}
                {...storageTextProps}
              ></Text>
            )}
          </Group>
        );
      })}
    </>
  );
};

export default memo(StoragePoints);
