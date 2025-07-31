import Arrow from '@/assets/arrow.png';
import Tips from '@/views/Vision/components/settingPart/comp/tips';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NormalAxis } from '../comp/axis';
const PureImage = ({ img }: any) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!img) return;
    const loadImage = async (str: string) => {
      const image = await import(`../../../../../../assets/vision/truckload/${str}.png`);
      setImageSrc(image.default);
    };

    loadImage(img);
  }, [img]);
  return <>{imageSrc && <img className='w-full' src={imageSrc} />}</>;
};
const UnloadIllustration = (props: any) => {
  const { t } = useTranslation();

  return (
    <div className='flex-1 '>
      <Tips>
        {t('参数说明')}:
        <br />
        {t('为了确保无人叉车在车厢内尽可能走直线，需要进行观测任务，计算出卡车位置偏差。')}
        <br />
        {t('以两列货物中的左侧为例，为例确保在卸左侧货物过程中尽可能走直线驶入，需要对叉车进行偏移。')}
        <br />
        {t('该偏移量的方向参考地图坐标系，如图例所示需要左偏，则为-300。右侧同理。')}
        <br />
        {t('假设场景内有斜坡，则车体在停靠点时牙尖到坡底的距离建议设置400mm-1200mm。')}
        <br />
        {t('假设无斜坡，则车体在停靠点时牙尖到车厢门口距离大概为1000-1500mm。')}
      </Tips>
      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_unload_move_left' />
            <span className='absolute bottom-[100px] left-[-70px]'>500mm</span>
          </div>
        </div>
        <div className='flex items-center px-2'>
          <div>
            <NormalAxis />
            <img className='w-[60px]' src={Arrow} />
          </div>
        </div>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_unload_move_right' />
            <span className='absolute bottom-[100px] left-[-70px]'>200mm</span>
          </div>
        </div>
      </div>
      <div className='flex py-[10px]'>
        <div className='flex-1 flex justify-center'>{t('补偿前')}</div>
        <div className='flex items-center px-2 w-[60px]'></div>
        <div className='flex-1 flex justify-center'>{t('补偿后')}</div>
      </div>
      <Tips>
        {t('参数说明')}:
        <br />
        {t('假设叉车停靠有角度偏差，在做观测任务过程中会自动计算偏差量，必要时需要人工微调。')}
        <br />
        {t('补偿规则如图')}:
        <br />
        {t('图中车辆逆时针偏移1°，可在角度补偿参数内填写-1，车辆将顺时针摆正。')}
        <br />
        {t('补偿规则')}:
        <br />
        {t('正的补偿，车辆逆时针旋转，负的补偿，车辆顺时针旋转。')}
      </Tips>
      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_unload_rotate_left' />
            <span className='absolute bottom-[24%] left-[55%]'>1°</span>
          </div>
        </div>
        <div className='flex items-center px-2'>
          <div>
            <NormalAxis />
            <img className='w-[60px]' src={Arrow} />
          </div>
        </div>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_unload_rotate_right' />
          </div>
        </div>
      </div>
      <div className='flex py-[10px]'>
        <div className='flex-1 flex justify-center'>{t('补偿前')}</div>
        <div className='flex items-center px-2 w-[60px]'></div>
        <div className='flex-1 flex justify-center'>{t('补偿后')}</div>
      </div>
    </div>
  );
};

export default memo(UnloadIllustration);
