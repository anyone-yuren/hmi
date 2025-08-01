import Arrow from '@/assets/arrow.png';
import Tips from '@/views/Vision/components/settingPart/comp/tips';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VehicleAxis } from '../comp/axis';

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
const SidewayIllustration = () => {
  const { t } = useTranslation();

  return (
    <div className='flex-1'>
      <Tips>
        {t('参数说明')}:
        <br />
        {t('以左侧补偿为例，假设补偿前叉车臂距离左侧车厢100mm，给定左侧补偿系数为-50，可使叉车壁靠近左侧车厢至50mm。')}
        <br />
        {t('右侧补偿系数同理，给定负的右侧补偿系数能让叉车壁靠近右侧车厢。')}
      </Tips>
      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_unloadmove_move_left' />
            <span className='absolute bottom-[20%] left-[-20%]'>100mm</span>
          </div>
        </div>
        <div className='flex items-center px-2'>
          <div>
            <div className='text-[10px] w-[60px] whitespace-nowrap'>{t('X为左右，Y为前后')}</div>
            <VehicleAxis />
            <img className='w-[60px]' src={Arrow} />
          </div>
        </div>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_unloadmove_move_right' />
            <span className='absolute  bottom-[20%] left-[-20%]'>50mm</span>
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
        {t(
          '假设补偿前叉臂根部距离货物前端面20mm，给定左侧前后补偿系数为20，可使货物和叉臂根部距离增加至40mm，叉臂根部远离货物前端面，减小补偿系数，则该距离也减小。',
        )}
      </Tips>
      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_unload_front_left' />
            <span className='absolute bottom-[15%] left-[85%]'>20mm</span>
          </div>
        </div>
        <div className='flex items-center px-2'>
          <div>
            <div className='text-[10px] w-[60px] whitespace-nowrap'>{t('X为左右，Y为前后')}</div>
            <VehicleAxis />
            <img className='w-[60px]' src={Arrow} />
          </div>
        </div>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_unload_front_right' />
            <span className='absolute bottom-[15%] left-[85%]'>40mm</span>
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

export default memo(SidewayIllustration);
