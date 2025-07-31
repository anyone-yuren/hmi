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
const PoseIllustration = (props: any) => {
  const { t } = useTranslation();

  return (
    <div className='flex-1'>
      <Tips>
        {t('参数说明')}:
        <br />
        {t(
          '以左侧间隙补偿为例，假设补偿前车体外轮廓距离左侧车厢壁200mm，给定左侧补偿系数为-100，可使车辆靠近左侧车厢壁至100mm。',
        )}
        <br />
        {t('右侧补偿系数同理，添加-100表示靠近右侧车厢壁。')}
        <br />
        {t('以上补偿规则请参考车体坐标系')}
      </Tips>
      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_unloadpose_outside_left' />
            <span className='absolute bottom-[25%] left-[-20%]'>200mm</span>
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
            <PureImage img='Q20_truckload_unloadpose_outside_right' />
            <span className='absolute  bottom-[25%] left-[-20%]'>100mm</span>
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
          '假设补偿前车体叉臂前端距离车厢100mm，给定补偿系数为100，可使车辆远离车厢至200mm停靠并进行下一步取货挪车识别。',
        )}
        <br />
        {t('给定负的补偿系数能让叉臂前端靠近车厢。')}
      </Tips>
      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_unloadpose_stop_left' />
            <span className='absolute bottom-[27%] left-[55%]'>100mm</span>
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
            <PureImage img='Q20_truckload_unloadpose_stop_right' />
            <span className='absolute bottom-[25%] left-[55%]'>200mm</span>
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
        {t('假设车身并未摆正，发生角度偏移，可修改角度补偿参数。')}
        <br />
        {t('如下图车辆逆时针偏移1°，可在角度补偿参数内填写-1，车辆将顺时针摆正。')}
        <br />
        {t('补偿规则')}:
        <br />
        {t('正的补偿，车辆逆时针旋转，负的补偿，车辆顺时针旋转。')}
      </Tips>

      <div className='flex gap-[10px] mt-[30px]'>
        <div className='flex-1 flex justify-center'>
          <div className='w-1/2 relative'>
            <PureImage img='Q20_truckload_unloadpose_rotate_left' />
            <span className='absolute bottom-[27%] left-[65%]'>1°</span>
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
            <PureImage img='Q20_truckload_unloadpose_rotate_right' />
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

export default memo(PoseIllustration);
