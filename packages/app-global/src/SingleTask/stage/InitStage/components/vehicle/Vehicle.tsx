import { memo, useEffect, useMemo, useRef, useState } from 'react';
// import vehicleImages from '../../../assets/vehicle/vector.svg';
import { useAsyncEffect } from 'ahooks';
import Konva from 'konva';
import { useTranslation } from 'react-i18next';
import { Circle, Group, Image as KonvaImage, Rect } from 'react-konva';
import { Html } from 'react-konva-utils';
import { IVehicle } from '../../index.d';
/** state
 * 0-已规划  6-已分配 7-交管确认 3-已下发  4-行驶中 1-事件失败  2-被交管  5-已路过
 */
const radius = 4;
const width = radius * 2;
export const getPowerColor = (power: number) => {
  if (power > 60) {
    return '#31e2c3';
  }
  if (power > 20) {
    return '#ff9f43';
  }
  return '#ee5253';
};

const Vehicle = (props: IVehicle | any) => {
  const { id, x, y, angle, image, state, lightImage, lineHashMap, tracks, showVehiclePopup, trafficControlCar, power } =
    props;
  const [images, setImages] = useState<any>(null);
  const [lightImages, setLightImages] = useState<any>(null);
  const { t } = useTranslation();

  const vehicleStatus = useMemo(() => {
    const vehicleStatusDict = {
      0: t('deployer.singleTask.normal'),
      1: t('deployer.singleTask.manual'),
      2: t('deployer.singleTask.traffic'),
      3: t('deployer.singleTask.error'),
    };
    const vehicleStatusColorDict = {
      0: 'white',
      1: 'white',
      2: 'white',
      3: 'red',
    };
    let name = vehicleStatusDict[state];
    const color = vehicleStatusColorDict[state];
    if (state === 2) {
      name += `(${trafficControlCar})`;
    }
    return { name, color };
  }, [state]);

  const getVehicleImage = async (imageName: string) => {
    let imageModule: any = {};
    if (!imageName) {
      imageModule = await import(`../../../assets/vehicle/vector.svg`);
      return imageModule.default;
    }
    try {
      imageModule = await import(`../../../assets/vehicle/${imageName}.png`);
    } catch (error) {
      imageModule = await import(`../../../assets/vehicle/vector.svg`);
    }
    return imageModule.default;
  };
  const getVehicleLightImage = async (imageName: string) => {
    const imageModule = await import(`../../../assets/vehicle/lights/${imageName}.png`);
    return imageModule.default;
  };

  useEffect(() => {
    console.log('showVehiclePopup', showVehiclePopup);
  }, [showVehiclePopup]);

  useAsyncEffect(async () => {
    const newImage = new Image();
    const imagesPath = await getVehicleImage(image);
    newImage.src = imagesPath;
    newImage.onload = () => {
      setImages(newImage);
    };
    newImage.onerror = () => {
      console.log('[Vehicle]:图片加载失败了');
    };
  }, [image]);

  useAsyncEffect(async () => {
    if (!lightImage) return;
    const newImage = new Image();
    const imagesPath = await getVehicleLightImage(lightImage);
    newImage.src = imagesPath;
    newImage.onload = () => {
      setLightImages(newImage);
    };
    newImage.onerror = () => {
      console.log('[Vehicle]:图片加载失败了');
    };
  }, [lightImage]);

  const vehicleLightImageRef = useRef<Konva.Image>(null);
  useEffect(() => {
    const angularSpeed = 90;
    const anim = new Konva.Animation(function (frame) {
      if (vehicleLightImageRef.current) {
        const angleDiff = (frame!.timeDiff * angularSpeed) / 600;
        vehicleLightImageRef.current.rotate(angleDiff);
      }
    });

    anim.start();

    return () => {
      anim.stop();
    };
  }, []);

  const outlineHeight = Math.abs(props.lkX2 - props.lkX1);
  const outlineWidth = Math.abs(props.lkY2 - props.lkY1);
  const vehicleImageAspectRatio = useMemo(() => (images ? images?.width / images?.height : 1), [images]);
  const vehicleLightSize = useMemo(() => Math.max(outlineWidth, outlineHeight) * 1.8, [outlineWidth, outlineHeight]);
  const vehicleLightImageAspectRatio = useMemo(
    () => (lightImages && lightImages?.width / lightImages?.height) || 1,
    [lightImages],
  );
  const CircleRadius = () => Math.sqrt(width * width + ((width * 25) / 33) * ((width * 25) / 33));

  if (!image) {
    return (
      <Group key={'vehicle_' + id} x={x} y={y}>
        <Circle radius={CircleRadius() / 2} fill={'#BEE8E8'} stroke={'white'} strokeWidth={1} />
        <KonvaImage
          image={images}
          width={width}
          height={width * (25 / 33)}
          offsetX={width / 2 + 0.5}
          offsetY={radius * (25 / 33)}
          rotation={angle}
        ></KonvaImage>
      </Group>
    );
  }
  return (
    <>
      <Group key={'vehicle_' + id} x={x} y={y} offsetY={-(outlineHeight / 2) - props.lkX1} rotation={angle}>
        <KonvaImage
          cache={true}
          ref={vehicleLightImageRef}
          perfectDrawEnabled={false}
          image={lightImages}
          width={vehicleLightSize * vehicleLightImageAspectRatio}
          height={vehicleLightSize}
          offsetX={(vehicleLightSize * vehicleLightImageAspectRatio) / 2}
          offsetY={vehicleLightSize / 2}
        ></KonvaImage>
        <Group>
          <KonvaImage
            cache={true}
            image={images}
            width={outlineHeight * vehicleImageAspectRatio}
            height={outlineHeight}
            offsetX={(outlineHeight * vehicleImageAspectRatio) / 2}
            offsetY={outlineHeight / 2}
            rotation={180}
          ></KonvaImage>
          <Rect
            perfectDrawEnabled={false}
            width={outlineWidth}
            height={outlineHeight}
            offsetX={outlineWidth / 2}
            offsetY={outlineHeight / 2}
            stroke={'#00cbca'}
            strokeWidth={10}
            fill='transparent'
            dash={[0.05, 0.025, 0.05]}
          />
          <Rect
            width={100}
            height={100}
            offsetX={100 / 2}
            offsetY={100 / 2 + outlineHeight / 2 + props.lkX1}
            fill='red'
          ></Rect>
        </Group>
      </Group>
      <Group key={'vehicle_tooltip' + id} x={x} y={y}>
        {showVehiclePopup && (
          <Html
            transform
            transformFunc={(attrs) => {
              const newAttrs = { ...attrs, scaleX: 1.3, scaleY: 1.3 };
              return newAttrs;
            }}
            divProps={{
              style: {
                zIndex: 9,
                fontSize: '10px',
                touchAction: 'none',
                pointerEvents: 'none',
                userSelect: 'none',
                willChange: 'transform',
                background: '#00000060',
                borderRadius: '5px',
                padding: '5px',
                color: 'white',
              },
            }}
          >
            <div>{`编号: ${id}`}</div>
            <div>
              <span>{`状态: `}</span>
              <span style={{ color: vehicleStatus.color }}>{`${vehicleStatus.name}`}</span>
            </div>
            <div>
              <span>{`电量: `}</span>
              <span style={{ color: getPowerColor(power) }}>{`${Math.floor(power)}%`}</span>
            </div>
          </Html>
        )}
      </Group>
    </>
  );
};

export default memo(Vehicle);
