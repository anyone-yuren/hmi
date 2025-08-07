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
const PoseIllustration = () => {
  const { t } = useTranslation();

  return (
    <div className='flex-1'>
      <Tips>
        {t('deployer.vision.paramExplanation')}:
        <br />
        {t('deployer.vision.truckLoadPoseLegendTips1')}
        <br />
        {t('deployer.vision.truckLoadPoseLegendTips2')}
        <br />
        {t('deployer.vision.axisDescTips')}
      </Tips>
      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_loadpose_outside_left' />
            <span className='absolute bottom-[25%] left-[-20%]'>200mm</span>
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
            <PureImage img='Q20_truckload_loadpose_outside_right' />
            <span className='absolute  bottom-[25%] left-[-20%]'>100mm</span>
          </div>
        </div>
      </div>
      <div className='flex py-[10px]'>
        <div className='flex-1 flex justify-center'>{t('deployer.vision.beforeCompensation')}</div>
        <div className='flex items-center px-2 w-[60px]'></div>
        <div className='flex-1 flex justify-center'>{t('deployer.vision.afterCompensation')}</div>
      </div>
      <Tips>
        {t('deployer.vision.paramExplanation')}:
        <br />
        {t('deployer.vision.truckLoadPoseLegendTips3')}
        <br />
        {t('deployer.vision.truckLoadPoseLegendTips4')}
      </Tips>
      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_loadpose_stop_left' />
            <span className='absolute top-[40%] left-[55%]'>100mm</span>
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
            <PureImage img='Q20_truckload_loadpose_stop_right' />
            <span className='absolute top-[40%] left-[55%]'>200mm</span>
          </div>
        </div>
      </div>
      <div className='flex py-[10px]'>
        <div className='flex-1 flex justify-center'>{t('deployer.vision.beforeCompensation')}</div>
        <div className='flex items-center px-2 w-[60px]'></div>
        <div className='flex-1 flex justify-center'>{t('deployer.vision.afterCompensation')}</div>
      </div>

      <Tips>
        {t('deployer.vision.paramExplanation')}:
        <br />
        {t('deployer.vision.truckLoadPoseLegendTips5')}
        <br />
        {t('deployer.vision.truckLoadPoseLegendTips6')}
        <br />
        {t('deployer.vision.compensationRule')}:
        <br />
        {t('deployer.vision.truckPublicRotateTips1')}
      </Tips>

      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_loadpose_rotate_left' />
            <span className='absolute top-[30%] left-[55%]'>1°</span>
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
            <PureImage img='Q20_truckload_loadpose_rotate_right' />
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

export default memo(PoseIllustration);
