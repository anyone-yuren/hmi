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
const SpaceIllustration = (props: any) => {
  const { t } = useTranslation();

  return (
    <div className='flex-1'>
      <Tips>
        {t('deployer.vision.paramExplanation')}:
        <br />
        {t('deployer.vision.truckloadSpaceLegendTips1')}
        <br />
        {t('deployer.vision.truckloadSpaceLegendTips2')}
      </Tips>
      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-[73%] relative'>
            <PureImage img='Q20_truckload_loadspace_move_left' />
            <span className='absolute top-[20%] left-[-5%]'>10mm</span>
          </div>
        </div>
        <div className='flex items-center px-2'>
          <div>
            <div className='text-[10px] w-[60px] whitespace-nowrap'>{t('deployer.vision.axisTips')}</div>
            <VehicleAxis />
            <img className='w-[60px]' src={Arrow} />
          </div>
        </div>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_loadspace_move_right' />
          </div>
        </div>
      </div>
      <div className='flex py-[10px]'>
        <div className='flex-1 flex justify-center'>{t('deployer.vision.beforeCompensation')}</div>
        <div className='flex items-center px-2 w-[60px]'></div>
        <div className='flex-1 flex justify-center'>{t('deployer.vision.afterCompensation')}</div>
      </div>
    </div>
  );
};

export default memo(SpaceIllustration);
