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
        <div className='w-full text-center'>{t('挪车前')}</div>
        <ImagesWidthTips
          containClass='my-[30px]'
          img={'truck/truck_move_back'}
          imageHeight={180}
          tipsProps={multiTipsProps}
        ></ImagesWidthTips>
        <div className='w-full text-center'>{t('挪车后')}</div>
      </div>
    );
  }
  return (
    <div className='flex-1 m-[12px]'>
      <Tips>
        {t('装车说明')}:
        <br />
        1、
        {t(
          '首先会进行放货姿态识别,进行姿态调整,车辆到达库位点之后进行挪车识别,此时会微调叉臂横移,以及车身前后位置,进行精准放货。',
        )}
        <br />
        2、
        {t(
          '在卡车左右侧装车的补偿参数是不一样的,需要单独调整,一般的,在左右侧装车,它的左右的补偿参数理论上应该刚好取反。',
        )}
        <br />
        3、
        {t('装车必须从车头开始装货,依次装车直到车尾。')}
        <br />
        4、
        {t('装车之前需要如实填写货物宽度以及它装车的间隙,假设有多种托盘,则按照最大货物尺寸来填写。')}
      </Tips>
      <ImagesWidthTips containClass='my-[30px]' img={'truck/truck'} imageHeight={180} tipsProps={multiTipsProps}>
        <div className='w-full h-full relative'>
          <span className='absolute top-[40px] left-1/2 transform -translate-x-1/2'>
            {t('deployer.vision.goodsWidth')}
          </span>
          <span className='absolute top-[27px] right-[26%]'>{t('货物左右间隙')}</span>
        </div>
      </ImagesWidthTips>

      <Tips>
        {t('deployer.vision.compensationRule')}:
        <br />
        1、
        {t('人朝着卡车车头方向看,依靠左右手来区分左侧、右侧装车。')}
        <br />
        2、
        {t(
          '左侧放货补偿: 左右方向: 要想让叉车靠近卡车车头方向偏移,则需减小左右补偿,反之要远离卡车头方向,则增大补偿。前后方向:要想让货物靠近车厢表面,则减少前后补偿,反之要想让货物远离车厢表面,则增大前后补偿。要想让货物逆时针旋转,则加大角度补偿,反之减少。',
        )}
        <br />
        3、
        {t(
          '右侧放货补偿: 左右方向: 要想让叉车靠近卡车车头方向偏移,则需增大左右补偿,反之要远离卡车头方向,则减小补偿。前后方向:要想让货物靠近车厢表面,则减少前后补偿,反之要想让货物远离车厢表面,则增大前后补偿。要想让货物逆时针旋转,则加大角度补偿,反之减少。',
        )}
      </Tips>

      <ImagesWidthTips
        containClass='my-[10px]'
        img={`truck/truck_first_vision_${vehicleImages.toLowerCase()}`}
        imageHeight={180}
        imageStyle={{ width: '450px', height: 'auto', margin: '0px auto' }}
        tipsProps={multiTipsProps}
      >
        <div className='w-full h-full relative'>
          <span className='absolute top-[100%] left-[20%]'>{t('拍照距离')}: 800 ~ 1500cm</span>
          <span className='absolute top-[120%] right-[20%]'>{t('deployer.vision.pathPlanning')}</span>
        </div>
      </ImagesWidthTips>
      <div className='w-full text-center mt-[270px] pl-[80px]'>{t('第一次视觉点')}</div>
      <ImagesWidthTips
        containClass='my-[10px]'
        img={`truck/truck_second_vision_${vehicleImages.toLowerCase()}`}
        imageHeight={180}
        imageStyle={{ width: '450px', height: 'auto', margin: '0px auto' }}
        tipsProps={multiTipsProps}
      ></ImagesWidthTips>
      <div className='w-full text-center mt-[80px] pl-[140px]'>{t('第二次视觉点')}</div>
    </div>
  );
};

export default memo(Illustration);
