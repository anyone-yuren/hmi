import { memo, useEffect, useState } from 'react';
import { Group, Image as KonvaImage, Rect, Text } from 'react-konva';
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
                fill={'black'}
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
