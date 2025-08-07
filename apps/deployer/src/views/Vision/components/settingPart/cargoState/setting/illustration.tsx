import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useVehicleChassis from '../../../../hooks/vehicleChassis';
import { ImagesWidthTips } from '../../comp/tips';
const Illustration = (props: any) => {
  const { t } = useTranslation();
  const { vehicleChassis } = useVehicleChassis();
  const multiTipsProps = {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  };

  const vehicleImages = useMemo(() => {
    const hashMap: any = {
      X20S: 'X20S',
      PALLET: 'X20',
      STACKER: 'SL14',
      FORWARD: 'R20S',
      BALANCE: 'SE15',
      TRILATERAL: 'K1',
      OMNI_FORWARD: 'O20',
    };
    console.log('vehicleChassis', vehicleChassis);
    return hashMap[vehicleChassis] || 'X20';
  }, [vehicleChassis]);
  const isTrilateral = useMemo(() => {
    return vehicleChassis === 'TRILATERAL';
  }, [vehicleChassis]);
  return (
    <div className='flex-1 mt-[12px]'>
      <ImagesWidthTips containClass='my-[30px]' img={'space/goods_status'} imageHeight={180} tipsProps={multiTipsProps}>
        <div className='w-full h-full relative'>
          <span className='absolute top-[-20px] left-1/2 transform -translate-x-1/2'>
            {t('deployer.vision.goodsWidth')}
          </span>
          <span className='absolute top-1/2 right-[-60px] transform -translate-y-1/2'>
            {t('deployer.vision.goodsHeight')}
          </span>
        </div>
      </ImagesWidthTips>

      <ImagesWidthTips
        containClass='my-[10px]'
        img={'goodStatus/goods_side'}
        imageHeight={180}
        tipsProps={{ bottom: '-25px', right: 0, textAlign: 'right' }}
      >
        {t('deployer.vision.goodsSideOverPalletSize')}
      </ImagesWidthTips>

      {isTrilateral ? (
        <div className='flex flex-col'>
          <div className='flex-1'>
            <ImagesWidthTips
              containClass='mt-[50px]'
              img={'goodStatus/goods_front'}
              imageHeight={180}
              imageStyle={{ transform: 'rotate(270deg)' }}
              tipsProps={{ bottom: '-25px', left: '-80px' }}
            >
              {t('货物前方超托尺寸')}
            </ImagesWidthTips>
          </div>
          <div className='flex-1'>
            <ImagesWidthTips
              containClass='mt-[50px] translate-x-[-17%]'
              img={'vehicle/' + vehicleImages}
              imageHeight={220}
              tipsProps={multiTipsProps}
            ></ImagesWidthTips>
          </div>
          <div className='h-[50px]'></div>
        </div>
      ) : (
        <div className='flex'>
          <div className='flex-1'>
            <ImagesWidthTips
              containClass='my-[50px]'
              img={'vehicle/' + vehicleImages}
              imageHeight={120}
              tipsProps={multiTipsProps}
            ></ImagesWidthTips>
          </div>
          <div className='flex-1'>
            <ImagesWidthTips
              containClass='my-[50px]'
              img={'goodStatus/goods_front'}
              imageHeight={180}
              tipsProps={{ top: '-25px', left: 0 }}
            >
              {t('货物前方超托尺寸')}
            </ImagesWidthTips>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Illustration);
