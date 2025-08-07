import Arrow from '@/assets/arrow.png';
import Tips from '@/views/Vision/components/settingPart/comp/tips';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NormalAxis } from './../comp/axis';
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
const LoadIllustration = (props: any) => {
  const { t } = useTranslation();
  const multiTipsProps = {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  };

  return (
    <div className='flex-1 '>
      <Tips>
        {t('deployer.vision.paramExplanation')}:
        <br />
        {t('deployer.vision.truckloadObserveLoadLegendTips1')}
        <br />
        {t('deployer.vision.truckloadObserveLoadLegendTips2')}
        <br />
        {t('deployer.vision.truckloadObserveLoadLegendTips3')}
        <br />
        {t('deployer.vision.truckloadObserveLoadLegendTips4')}
        <br />
        {t('deployer.vision.truckloadObserveLoadLegendTips5')}
      </Tips>
      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_load_move_left' />
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
            <PureImage img='Q20_truckload_load_move_right' />
            <span className='absolute bottom-[100px] left-[-70px]'>200mm</span>
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
        {t('deployer.vision.truckloadObserveLoadLegendTips6')}
        <br />
        {t('deployer.vision.compensationRuleSuchAs')}:
        <br />
        {t('deployer.vision.truckloadObserveLoadLegendTips7')}
        <br />
        {t('deployer.vision.compensationRule')}:
        <br />
        {t('deployer.vision.truckPublicRotateTips1')}
      </Tips>
      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_load_rotate_left' />
            <span className='absolute bottom-[24%] left-[75%]'>1°</span>
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
            <PureImage img='Q20_truckload_load_rotate_right' />
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

export default memo(LoadIllustration);
