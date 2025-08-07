import Arrow from '@/assets/arrow.png';
import { memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useVehicleChassis from '../../../../hooks/vehicleChassis';
import Tips, { ImagesWidthTips } from '../../comp/tips';

interface IProps {
  type: 'detect' | 'move';
}
const Illustration = (props: IProps) => {
  const { type: pageType } = props;
  const { t } = useTranslation();
  const { vehicleChassis, isTrilateral } = useVehicleChassis();
  const [type, setType] = useState(['BALANCE', 'STACKER', 'FORWARD', 'OMNI_FORWARD']);
  const multiTipsProps = {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  };

  useEffect(() => {
    if (pageType === 'move') {
      const origin = [...type];
      origin.push('TRILATERAL');
      setType(origin);
    }
  }, [pageType]);

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

  const cssHashMap = useMemo(() => {
    const obj: any = {
      SE15: {
        shelf_round_front_left: 'top-[75px] left-[-30px]',
        shelf_round_front_right: 'top-[90px] left-[110px]',
        shelf_rotate_front: { left: '110px', top: '80px' },
        shelf_stop_front: { top: '30px' },
        shelf_stop_back: { top: '30px', whiteSpace: 'nowrap' },
        shelf_move_front: { left: '80px', top: '80px' },
      },
      SL14: {
        shelf_round_front_left: 'top-[75px] left-[-30px]',
        shelf_round_front_right: 'top-[80px] left-[110px]',
        shelf_rotate_front: { left: '110px', top: '30px' },
        shelf_stop_front: { top: '30px' },
        shelf_stop_back: { top: '30px', whiteSpace: 'nowrap' },
        shelf_move_front: { left: '110px', top: '55px' },
      },
      R20S: {
        shelf_round_front_left: 'top-[140px] left-[-30px]',
        shelf_round_front_right: 'top-[90px] left-[90px]',
        shelf_rotate_front: { left: '110px', top: '80px' },
        shelf_stop_front: { top: '0px', left: '90px' },
        shelf_stop_back: { top: '-10px', left: '60px', whiteSpace: 'nowrap' },
        shelf_move_front: { left: '90px', top: '90px' },
      },
      O20: {
        shelf_round_front_left: 'top-[160px] left-[-30px]',
        shelf_round_front_right: 'top-[90px] left-[100px]',
        shelf_rotate_front: { left: '140px', top: '80px' },
        shelf_stop_front: { top: '-20px', left: '90px' },
        shelf_stop_back: { top: '-20px', left: '60px', whiteSpace: 'nowrap' },
        shelf_move_front: { left: '100px', top: '90px' },
      },
    };
    return obj[vehicleImages];
  }, [vehicleImages]);

  if (!isExist) {
    return <div className='w-full text-center'>{t('deployer.vision.notSupportChassis')}</div>;
  }
  if (pageType === 'move') {
    return (
      <div className='flex-1 m-[12px]'>
        <Tips>
          {t('deployer.vision.placeShelfLegendTips1')}
          <br />
          {t('deployer.vision.placeShelfLegendTips2')}
          <br />
          {t('deployer.vision.placeShelfLegendTips3')}
        </Tips>

        {/* K1是单独的一种类型 */}
        {!isTrilateral ? (
          <div className='flex'>
            <ImagesWidthTips
              containClass='my-[30px]'
              img={`shelf/shelf_move_front_${vehicleImages.toLowerCase()}`}
              imageHeight={180}
              tipsProps={cssHashMap?.['shelf_move_front']}
            >
              {t('deployer.vision.aroundCompensation')}
            </ImagesWidthTips>
            <div className='flex items-center px-2'>
              <img className='w-[60px]' src={Arrow} />
            </div>
            <ImagesWidthTips
              containClass='mt-[30px] '
              img={`shelf/shelf_back_${vehicleImages.toLowerCase()}`}
              imageHeight={175}
              tipsProps={multiTipsProps}
            ></ImagesWidthTips>
          </div>
        ) : (
          <>
            <div className='flex'>
              <ImagesWidthTips
                containClass='my-[30px]'
                img={`shelf/shelf_move_left_front_${vehicleImages.toLowerCase()}`}
                imageHeight={180}
                tipsProps={multiTipsProps}
              >
                <div className='w-full h-full relative'>
                  <span className='absolute top-[100px] right-[-30px]'>{t('deployer.vision.swayCompensation')}</span>
                  <span className='absolute top-[170px] right-[-30px]'>{t('deployer.vision.aroundCompensation')}</span>
                </div>
              </ImagesWidthTips>
              <div className='flex items-center px-2'>
                <img className='w-[60px]' src={Arrow} />
              </div>
              <ImagesWidthTips
                containClass='mt-[40px] '
                img={`shelf/shelf_move_left_back_${vehicleImages.toLowerCase()}`}
                imageHeight={160}
                tipsProps={multiTipsProps}
              ></ImagesWidthTips>
            </div>
            <div className='flex'>
              <ImagesWidthTips
                containClass='my-[30px]'
                img={`shelf/shelf_move_right_front_${vehicleImages.toLowerCase()}`}
                imageHeight={180}
                tipsProps={multiTipsProps}
              >
                <div className='w-full h-full relative'>
                  <span className='absolute top-[0px] right-[-30px]'>{t('deployer.vision.swayCompensation')}</span>
                  <span className='absolute bottom-[50px] right-[0px]'>{t('deployer.vision.aroundCompensation')}</span>
                </div>
              </ImagesWidthTips>
              <div className='flex items-center px-2'>
                <img className='w-[60px]' src={Arrow} />
              </div>
              <ImagesWidthTips
                containClass='mt-[40px] '
                img={`shelf/shelf_move_right_back_${vehicleImages.toLowerCase()}`}
                imageHeight={160}
                tipsProps={multiTipsProps}
              ></ImagesWidthTips>
            </div>
          </>
        )}
      </div>
    );
  }
  return (
    <div className='flex-1 m-[12px]'>
      <Tips>
        {t('deployer.vision.placeShelfLegendTips1')}
        <br />
        {t('deployer.vision.placeShelfLegendTips4')}
        <br />
        {t('deployer.vision.placeShelfLegendTips3')}
      </Tips>
      <div className='flex'>
        <ImagesWidthTips
          containClass='my-[30px]'
          img={`shelf/shelf_round_front_${vehicleImages.toLowerCase()}`}
          imageHeight={180}
          tipsProps={multiTipsProps}
        >
          <div className='w-full h-full relative'>
            <span className={`absolute ${cssHashMap?.['shelf_round_front_left']}`}>
              {t('deployer.vision.swayCompensation')}
            </span>
            <span className={`absolute ${cssHashMap?.['shelf_round_front_right']}`}>
              {t('deployer.vision.aroundCompensation')}
            </span>
          </div>
        </ImagesWidthTips>
        <div className='flex items-center px-2'>
          <img className='w-[60px]' src={Arrow} />
        </div>
        <ImagesWidthTips
          containClass='mt-[40px] '
          img={`shelf/shelf_back_${vehicleImages.toLowerCase()}`}
          imageHeight={160}
          tipsProps={multiTipsProps}
        ></ImagesWidthTips>
      </div>

      <Tips>
        {t('deployer.vision.placeShelfLegendTips5')}
        <br />
        {t('deployer.vision.placeShelfLegendTips6')}
        <br />
        {t('deployer.vision.placeShelfLegendTips7')}
      </Tips>

      <div className='flex'>
        <ImagesWidthTips
          containClass='my-[30px]'
          img={`shelf/shelf_rotate_front_${vehicleImages.toLowerCase()}`}
          imageHeight={180}
          tipsProps={cssHashMap?.['shelf_rotate_front']}
        >
          1°
        </ImagesWidthTips>
        <div className='flex items-center px-2'>
          <img className='w-[60px]' src={Arrow} />
        </div>
        <ImagesWidthTips
          containClass='mt-[30px] '
          img={`shelf/shelf_back_${vehicleImages.toLowerCase()}`}
          imageHeight={175}
          tipsProps={multiTipsProps}
        ></ImagesWidthTips>
      </div>

      <ImagesWidthTips
        img={`shelf/shelf_stop_front_${vehicleImages.toLowerCase()}`}
        imageHeight={200}
        tipsProps={cssHashMap?.['shelf_stop_front']}
        title={t('deployer.vision.vehicleStartShelfDist')}
      >
        {t('deployer.vision.vehicleStartShelfDist')}
      </ImagesWidthTips>

      <ImagesWidthTips
        containClass='mt-[30px]'
        img={`shelf/shelf_stop_back_${vehicleImages.toLowerCase()}`}
        imageHeight={200}
        tipsProps={cssHashMap?.['shelf_stop_back']}
        title={t('deployer.vision.vehicleStopShelfDist')}
      >
        {t('deployer.vision.vehicleStopShelfDist')}
      </ImagesWidthTips>
    </div>
  );
};

export default memo(Illustration);
