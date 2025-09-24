import Arrow from '@/assets/arrow.png';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useVehicleChassis from '../../../../hooks/vehicleChassis';
import Tips, { ImagesWidthTips } from '../../comp/tips';

interface IProps {
  type: 'detect' | 'move';
}
const Illustration = (props: IProps) => {
  const { type: pageType } = props;
  const { t } = useTranslation();
  const { vehicleChassis } = useVehicleChassis();
  const [type] = useState(['STACKER', 'BALANCE', 'FORWARD', 'OMNI_FORWARD']);
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
    return hashMap[vehicleChassis] || 'X20';
  }, [vehicleChassis]);

  const isExist = useMemo(() => {
    return type.includes(vehicleChassis);
  }, [vehicleChassis, type]);

  if (!isExist) {
    return <div className='w-full text-center'>{t('deployer.vision.notSupportChassis')}</div>;
  }
  if (pageType === 'move') {
    return (
      <div className='flex-1 m-[12px]'>
        <Tips>
          {t('deployer.vision.stockStackLegendTips1')}
          <br />
          {t('deployer.vision.stockStackLegendTips2')}
          <br />
          {t('deployer.vision.stockStackLegendTips3')}
        </Tips>
        <div className='flex'>
          <div className='flex-1 justify-center items-center'>
            <ImagesWidthTips
              containClass='my-[20px]'
              img={'vehicle/' + vehicleImages}
              imageHeight={100}
              tipsProps={multiTipsProps}
            ></ImagesWidthTips>
          </div>
          <div>
            <ImagesWidthTips
              containClass='mt-[30px]'
              img={'common/shelf_front_front'}
              imageHeight={120}
              tipsProps={{ bottom: '-20px' }}
              title={t('deployer.vision.aroundCompensation')}
            >
              {t('deployer.vision.aroundCompensation')}
            </ImagesWidthTips>
          </div>
          <div className='flex items-center px-2'>
            <img className='w-[30px]' src={Arrow} />
          </div>
          <div>
            <ImagesWidthTips
              containClass='my-[20px]'
              img={'common/shelf'}
              imageHeight={100}
              tipsProps={{ top: '-20px' }}
            >
              {t('deployer.vision.multiLayerStack')}
            </ImagesWidthTips>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className='flex-1 m-[12px]'>
      <Tips>
        {t('deployer.vision.stockStackLegendTips4')}
        <br />
        {t('deployer.vision.stockStackLegendTips5')}
        <br />
        {t('deployer.vision.compensationRule')}:
        <br />
        {t('deployer.vision.stockStackLegendTips6')}
      </Tips>
      <div className='flex'>
        <div className='flex-1 justify-center items-center'>
          <ImagesWidthTips
            containClass='my-[20px]'
            img={'vehicle/' + vehicleImages}
            imageHeight={100}
            tipsProps={multiTipsProps}
          ></ImagesWidthTips>
        </div>
        <div>
          <ImagesWidthTips
            containClass=''
            img={'common/shelf_rotate_front'}
            imageHeight={150}
            tipsProps={{ top: '-20px' }}
          >
            {t('1°')}
          </ImagesWidthTips>
        </div>
        <div className='flex items-center px-2'>
          <img className='w-[30px]' src={Arrow} />
        </div>
        <div>
          <ImagesWidthTips containClass='my-[20px]' img={'common/shelf'} imageHeight={100} tipsProps={{ top: '-20px' }}>
            {t('deployer.vision.multiLayerStack')}
          </ImagesWidthTips>
        </div>
      </div>

      <Tips>
        {t('deployer.vision.stockStackLegendTips1')}
        <br />
        {t('deployer.vision.stockStackLegendTips2')}
        <br />
        {t('deployer.vision.stockStackLegendTips3')}
      </Tips>

      <div className='flex'>
        <div className='flex-1 justify-center items-center'>
          <ImagesWidthTips
            containClass='my-[20px]'
            img={'vehicle/' + vehicleImages}
            imageHeight={100}
          ></ImagesWidthTips>
        </div>
        <div>
          <ImagesWidthTips
            containClass='mt-[30px]'
            img={'common/shelf_round_front'}
            imageHeight={120}
            tipsProps={multiTipsProps}
          >
            <div className='w-full h-full relative'>
              <span className='absolute top-[-20px] left-[10%] transform -translate-x-1/2'>
                {t('deployer.vision.aroundCompensation')}
              </span>
              <span className='absolute bottom-[-20px] left-[6%]'>{t('deployer.vision.swayCompensation')}</span>
            </div>
          </ImagesWidthTips>
        </div>
        <div className='flex items-center px-2'>
          <img className='w-[30px]' src={Arrow} />
        </div>
        <div>
          <ImagesWidthTips containClass='my-[20px]' img={'common/shelf'} imageHeight={100} tipsProps={{ top: '-20px' }}>
            {t('deployer.vision.multiLayerStack')}
          </ImagesWidthTips>
        </div>
      </div>

      {/* <ImagesWidthTips
        img={`${vehicleImages}_recenter`}
        imageHeight={100}
        tipsProps={{ top: '-20px' }}
        title={t('deployer.vision.stackBackFromShelf')}
      >
        {t('deployer.vision.stackBackFromShelf')}
      </ImagesWidthTips>

      <ImagesWidthTips
        containClass='mt-[30px]'
        img={`${vehicleImages}_stop`}
        imageHeight={100}
        tipsProps={{ top: '-20px' }}
        title={t('deployer.vision.stackStopFromShelf')}
      >
        {t('deployer.vision.stackStopFromShelf')}
      </ImagesWidthTips> */}
    </div>
  );
};

export default memo(Illustration);
