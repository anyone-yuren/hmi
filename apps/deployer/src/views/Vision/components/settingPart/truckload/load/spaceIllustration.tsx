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
        {t('参数说明')}:
        <br />
        {t(
          '以左侧间隙补偿为例，在到达库位点时，假设补偿前卡车车体左侧外轮廓距离货物侧10mm，给定左侧补偿系数为-10，可使货物到卡车的间隙为0，此时货物贴紧左侧车厢壁。',
        )}
        <br />
        {t('右侧补偿系数同理，给定负的右侧补偿值能使叉车在右侧放货时靠近右侧车厢壁。')}
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
            <div className='text-[10px] w-[60px] whitespace-nowrap'>{t('X为左右，Y为前后')}</div>
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
        <div className='flex-1 flex justify-center'>{t('补偿前')}</div>
        <div className='flex items-center px-2 w-[60px]'></div>
        <div className='flex-1 flex justify-center'>{t('补偿后')}</div>
      </div>
    </div>
  );
};

export default memo(SpaceIllustration);
