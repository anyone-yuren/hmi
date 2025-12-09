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
  const [type] = useState(['BALANCE', 'FORWARD']);
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
        <ImagesWidthTips
          containClass='my-[30px]'
          img={'truck/truck_move_front'}
          imageHeight={180}
          tipsProps={multiTipsProps}
        >
          <div className='w-full h-full relative'>
            <span className='absolute bottom-[0px] left-[35%] transform -translate-x-1/2'>
              {t('deployer.vision.aroundCompensation')}
            </span>
            <span className='absolute bottom-[-20px] right-[26%]'>{t('deployer.vision.swayCompensation')}</span>
          </div>
        </ImagesWidthTips>
        <div className='w-full text-center'>{t('deployer.vision.beforeMove')}</div>
        <ImagesWidthTips
          containClass='my-[30px]'
          img={'truck/truck_move_back'}
          imageHeight={180}
          tipsProps={multiTipsProps}
        ></ImagesWidthTips>
        <div className='w-full text-center'>{t('deployer.vision.afterMove')}</div>
      </div>
    );
  }
  return (
    <div className='flex-1 m-[12px]'>
      <Tips>
        {t('deployer.vision.loadInstructions')}:
        <br />
        1、
        {t('deployer.vision.pickFlatWingLegendTips1')}
        <br />
        2、
        {t('deployer.vision.pickFlatWingLegendTips2')}
        <br />
        3、
        {t('deployer.vision.pickFlatWingLegendTips3')}
        <br />
        4、
        {t('deployer.vision.pickFlatWingLegendTips4')}
      </Tips>
      <ImagesWidthTips containClass='my-[30px]' img={'truck/truck'} imageHeight={180} tipsProps={multiTipsProps}>
        <div className='w-full h-full relative'>
          <span className='absolute top-[40px] left-1/2 transform -translate-x-1/2'>
            {t('deployer.vision.goodsWidth')}
          </span>
          <span className='absolute top-[27px] right-[26%]'>{t('deployer.vision.goodsSideGap')}</span>
        </div>
      </ImagesWidthTips>

      <Tips>
        {t('deployer.vision.compensationRule')}:
        <br />
        1、
        {t('deployer.vision.pickFlatWingLegendTips5')}
        <br />
        2、
        {t('deployer.vision.pickFlatWingLegendTips6')}
        <br />
        3、
        {t('deployer.vision.pickFlatWingLegendTips7')}
      </Tips>

      <ImagesWidthTips
        containClass='my-[10px]'
        img={`truck/truck_first_vision_${vehicleImages.toLowerCase()}`}
        imageHeight={180}
        imageStyle={{ width: '450px', height: 'auto', margin: '0px auto' }}
        tipsProps={multiTipsProps}
      >
        <div className='w-full h-full relative'>
          <span className='absolute top-[100%] left-[20%]'>{t('deployer.vision.photoDistance')}: 800 ~ 1500cm</span>
          <span className='absolute top-[120%] right-[20%]'>{t('deployer.vision.pathPlanning')}</span>
        </div>
      </ImagesWidthTips>
      <div className='w-full text-center mt-[270px] pl-[80px]'>{t('deployer.vision.firstVisualPoint')}</div>
      <ImagesWidthTips
        containClass='my-[10px]'
        img={`truck/truck_second_vision_${vehicleImages.toLowerCase()}`}
        imageHeight={180}
        imageStyle={{ width: '450px', height: 'auto', margin: '0px auto' }}
        tipsProps={multiTipsProps}
      ></ImagesWidthTips>
      <div className='w-full text-center mt-[80px] pl-[140px]'>{t('deployer.vision.secondVisualPoint')}</div>
    </div>
  );
};

export default memo(Illustration);
