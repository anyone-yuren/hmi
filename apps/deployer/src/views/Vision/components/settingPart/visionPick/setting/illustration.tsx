import { memo, useEffect, useMemo, useState } from 'react';

import Arrow from '@/assets/arrow.png';
import { Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import '../../../modelPart/models/pallet.css';
const Illustration = (props: any) => {
  const { t } = useTranslation();
  const [vehicleConfig] = useState<any>({
    X20S: {
      rotate_image: 'X20s_rotate',
      rotate_tips_props: { left: '80px', top: '-20px' },
      full_image: 'X20s_full',
      full_image_height: '100px',
      back_prev: 'X20s_back_prev',
      back_next: 'X20s_full',
      front_prev: 'X20s_front_prev',
      front_prev_tips_props: { left: '60px', top: '-20px' },
      front_next: 'X20s_front_next',
      front_next_tips_props: { left: '65px', top: '-20px' },
      recenter: 'X20s_recenter',
      recenter_tips_props: { left: '30px', top: '-20px' },
      stop: 'X20s_stop',
      stop_tips_props: { left: '10px', top: '-20px' },
    },
    PALLET: {
      rotate_image: 'X20_rotate',
      rotate_tips_props: { left: '55px', top: '-20px' },
      full_image: 'X20_full',
      full_image_height: '100px',
      back_prev: 'X20_back_prev',
      back_next: 'X20_full',
      front_prev: 'X20_front_prev',
      front_next: 'X20_front_next',
      recenter: 'X20_recenter',
      recenter_tips_props: { left: '80px', top: '-20px' },
      stop: 'X20_stop',
      stop_tips_props: { left: '20px', top: '-20px' },
    },
    STACKER: {
      rotate_image: 'SL14_rotate',
      rotate_tips_props: { left: '60px', top: '-20px' },
      full_image: 'SL14_full',
      back_prev: 'SL14_back_prev',
      back_prev_tips_props: { top: '5px', bottom: '0px' },
      back_next: 'SL14_full',
      front_prev: 'SL14_front_prev',
      front_next: 'SL14_front_next',
      recenter: 'SL14_recenter',
      recenter_tips_props: { left: '80px', top: '-20px' },
      stop: 'SL14_stop',
      stop_tips_props: { left: '20px', top: '-20px' },
    },
    FORWARD: {
      rotate_image: 'R20s_rotate',
      rotate_tips_props: { left: '100px', top: '-20px' },
      full_image: 'R20s_full',
      back_prev: 'R20s_back_prev',
      back_prev_tips_props: { top: '20px', bottom: '15px' },
      back_next: 'R20s_full',
      front_prev: 'R20s_front_prev',
      front_prev_tips_props: { left: '100px', top: '-20px' },
      front_next: 'R20s_front_next',
      front_next_tips_props: { left: '90px', top: '-20px' },
      recenter: 'R20s_recenter',
      recenter_tips_props: { left: '30px', top: '-20px' },
      stop: 'R20s_stop',
      stop_tips_props: { left: '30px', top: '-20px' },
    },
    BALANCE: {
      rotate_image: 'SE15_rotate',
      rotate_tips_props: { left: '140px', top: '-20px' },
      full_image: 'SE15_full',
      full_image_height: '90px',
      back_prev: 'SE15_back_prev',
      back_prev_tips_props: { top: '10px', bottom: '5px' },
      back_next: 'SE15_full',
      front_prev: 'SE15_front_prev',
      front_prev_tips_props: { left: '140px', top: '-20px' },
      front_next: 'SE15_front_next',
      front_next_tips_props: { left: '140px', top: '-20px' },
      recenter: 'SE15_recenter',
      recenter_tips_props: { left: '70px', top: '-20px' },
      stop: 'SE15_stop',
      stop_tips_props: { left: '50px', top: '-20px' },
    },
    TRILATERAL: {},
    OMNI_FORWARD: {
      rotate_image: 'O20_rotate',
      rotate_tips_props: { left: '45px', top: '-20px' },
      full_image: 'O20_full',
      back_prev: 'O20_back_prev',
      back_prev_tips_props: { top: '23px', bottom: '20px' },
      back_next: 'O20_full',
      front_prev: 'O20_front_prev',
      front_prev_tips_props: { left: '40px', top: '-20px' },
      front_next: 'O20_front_next',
      front_next_tips_props: { left: '30px', top: '-20px' },
      recenter: 'O20_recenter',
      recenter_tips_props: { left: '20px', top: '-20px' },
      stop: 'O20_stop',
      stop_tips_props: { left: '0px', top: '-20px' },
    },
  });
  const [vehicleChassis, setVehicleChassis] = useState('');

  useEffect(() => {
    /*
      STACKER,      // 堆高 SL14
      PALLET ,       // 托盘车   X20
      FORWARD,      // R车前移 R20s
      BALANCE ,     // 平衡重 SE15
      TRILATERAL,  // K车三向叉 K1
      OMNI_FORWARD, // 全向车 O20
    */
    console.log(props.vehicleChassis);
    if (!props.vehicleChassis) return;
    setVehicleChassis(props.vehicleChassis || 'FORWARD');
  }, [props.vehicleChassis]);

  const isTrilateral = useMemo(() => {
    return vehicleChassis === 'TRILATERAL';
  }, [vehicleChassis]);

  if (isTrilateral) {
    return (
      <>
        <div className='flex-1 mt-[12px]'>
          <div>
            <Tips>
              {t('假设每次取货都往一个方向偏，则可以调整左右补偿参数。')}
              <br />
              {t(
                '如下图左右两侧间隙分别为50mm与10mm,则可以在左右补偿参数里面填写20，补偿之后的取货效果如右图，两侧居中取货。',
              )}
              {t('如果实际过程中往反方向偏，则减小参数。')}
              <br />
              {t('补偿规则：数值增大则车辆往车头方向挪动。如下图为左侧取货，如果是右侧取货补偿规则也相同。')}
            </Tips>

            <div className='flex justify-center items-center my-[30px]'>
              <div className='h-[200px] relative'>
                <PureImage img={'K1_back_right'}></PureImage>
                <span className='absolute text-[12px] top-[-20px] right-[55px]'>50mm</span>
                <span className='absolute text-[12px] top-[-20px] right-[0px]'>10mm</span>
              </div>
            </div>
            <Tips>
              {t('假设每次取货都没有取到位，则可以调整前后补偿参数。')}
              <br />
              {t(
                '图中托盘前表面到牙根的间隙为50mm,则可以在前后补偿参数内填写-40，补偿之后的取货效果如右图，叉臂则会多伸出40mm，如果实际过程中取太深怼托盘，则增大该参数。',
              )}
            </Tips>
            <div className='flex justify-center items-center my-[20px]'>
              <div className='h-[200px] relative'>
                <PureImage img={'K1_front_right'}></PureImage>
                <span className='absolute text-[12px] top-[80px] right-[-40px]'>50mm</span>
              </div>
            </div>
            <Tips>
              {t('补偿规则')}:
              <br />
              {t('数值增大则车辆往车头方向挪动。如下图为左侧取货。')}
            </Tips>
            <div className='flex justify-center items-center my-[30px]'>
              <div className='h-[200px] relative'>
                <PureImage img={'K1_back_left'}></PureImage>
                <span className='absolute text-[12px] bottom-[-20px] right-[55px]'>50mm</span>
                <span className='absolute text-[12px] bottom-[-20px] right-[-10px]'>10mm</span>
              </div>
            </div>
            <Tips>
              {t('补偿规则')}:
              <br />
              {t('数值增大则车辆往车头方向挪动。如下图为左侧取货。')}
            </Tips>
            <div className='flex justify-center items-center my-[20px]'>
              <div className='h-[200px] relative'>
                <PureImage img={'K1_front_left'}></PureImage>
                <span className='absolute text-[12px] top-[102px] right-[-40px]'>50mm</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className='flex-1 mt-[12px]'>
        <div>
          <Tips>
            {t('假设所示每次取货都托盘在叉车上都有一个角度，则可以修改角度补偿参数。')}
            <br />
            {t('如下图偏了约1°，则在角度补偿参数内填写-1。补偿规则: 数值增大，则车辆逆时针旋转。')}
          </Tips>
          <div className='flex h-[200px]'>
            <div className='flex-1'>
              <ImagesWidthTips
                imageHeight={'110px'}
                img={vehicleConfig[vehicleChassis]?.rotate_image}
                tipsProps={
                  vehicleConfig[vehicleChassis]?.rotate_tips_props || {
                    left: '60px',
                    top: '-20px',
                  }
                }
              >
                1°
              </ImagesWidthTips>
            </div>
            <div className='flex items-center'>
              <img className='w-[30px]' src={Arrow} />
            </div>
            <div className='flex-1 flex justify-center items-center'>
              <div
                style={{
                  height: vehicleConfig[vehicleChassis]?.full_image_height || '100px',
                }}
              >
                <PureImage img={vehicleConfig[vehicleChassis]?.full_image}></PureImage>
              </div>
            </div>
          </div>
          <CompensationTips></CompensationTips>

          <div className='h-[40px]'></div>
          <Tips>
            {t('假设每次取货都往一个方向偏，则可以调整左右补偿参数。')}
            <br />
            {t(
              '如下图左右两侧间隙分别为50mm与10mm,则可以在左右补偿参数里面填写20，补偿之后的取货效果如右图，两侧居中取货。',
            )}
            <br />
            {t('如果实际过程中往反方向偏，则减小参数。')}
          </Tips>
          <div className='flex h-[200px]'>
            <div className='flex-1 flex justify-center items-center'>
              <div className='h-[100px] relative'>
                <PureImage img={vehicleConfig[vehicleChassis]?.back_prev}></PureImage>
                <span
                  className='absolute text-[12px]'
                  style={{
                    right: '-40px',
                    top: vehicleConfig?.[vehicleChassis]?.back_prev_tips_props?.top || '0px',
                  }}
                >
                  10mm
                </span>
                <span
                  className='absolute text-[12px]'
                  style={{
                    right: '-40px',
                    bottom: vehicleConfig?.[vehicleChassis]?.back_prev_tips_props?.bottom || '0px',
                  }}
                >
                  50mm
                </span>
              </div>
            </div>
            <div className='flex items-center'>
              <img className='w-[30px]' src={Arrow} />
            </div>
            <div className='flex-1 flex justify-center items-center'>
              <div style={{ height: '100px' }}>
                <PureImage img={vehicleConfig[vehicleChassis]?.back_next}></PureImage>
              </div>
            </div>
          </div>
          <CompensationTips></CompensationTips>

          <div className='h-[40px]'></div>
          <Tips>
            {t('假设每次取货都没有取到位（约50mm之内)，则可以调整前后补偿参数。')}
            <br />
            {t(
              '图中托盘前表面到牙根的间隙为50mm,则可以在前后补偿参数内填写-40，补偿之后的取货效果如右图，车辆会多走40mm，如果实际过程中会怼托盘，则增大该参数。',
            )}
            <br />
            {t('注意如果前后取货偏差过大超过50mm，则建议修改停车后基准点到托盘前表面的距离参数。')}
          </Tips>
          <div className='flex h-[200px]'>
            <div className='flex-1'>
              <ImagesWidthTips
                imageHeight={'110px'}
                img={vehicleConfig[vehicleChassis]?.front_prev}
                tipsProps={
                  vehicleConfig[vehicleChassis]?.front_prev_tips_props || {
                    left: '50px',
                    top: '-20px',
                  }
                }
              >
                50mm
              </ImagesWidthTips>
            </div>
            <div className='flex items-center'>
              <img className='w-[30px]' src={Arrow} />
            </div>
            <div className='flex-1'>
              <ImagesWidthTips
                imageHeight={'110px'}
                img={vehicleConfig[vehicleChassis]?.front_next}
                tipsProps={
                  vehicleConfig[vehicleChassis]?.front_next_tips_props || {
                    left: '50px',
                    top: '-20px',
                  }
                }
              >
                10mm
              </ImagesWidthTips>
            </div>
          </div>
          <CompensationTips></CompensationTips>

          <ImagesWidthTips
            imageHeight={'100px'}
            title={t('车身回正时基准点到托盘前表面的距离')}
            img={vehicleConfig[vehicleChassis]?.recenter}
            tipsProps={
              vehicleConfig[vehicleChassis]?.recenter_tips_props || {
                left: '80px',
                top: '-20px',
              }
            }
          >
            {t('车身回正时基准点到托盘前表面的距离')}
          </ImagesWidthTips>
          <ImagesWidthTips
            img={vehicleConfig[vehicleChassis]?.stop}
            title={t('停车后基准点到托盘前表面的距离')}
            tipsProps={
              vehicleConfig[vehicleChassis]?.stop_tips_props || {
                left: '20px',
                top: '-20px',
              }
            }
          >
            {t('停车后基准点到托盘前表面的距离')}
          </ImagesWidthTips>
        </div>
      </div>
    </>
  );
};

const ImagesWidthTips = ({ imageHeight = '120px', img = null, children, tipsProps = {}, title = '' }: any) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!img) return;
    const loadImage = async (str: string) => {
      const image = await import(`../../../../../../assets/vision/${str}.png`);
      setImageSrc(image.default);
    };

    loadImage(img);
  }, [img]);
  return (
    <div className='w-full flex justify-center items-center h-[200px]'>
      <div className='relative ' style={{ height: imageHeight }}>
        {imageSrc && <img className='h-full' src={imageSrc} />}
        {title ? (
          <Tooltip placement={'top'} trigger={'click'} title={title} zIndex={9999}>
            <div className='whitespace-nowrap absolute text-[12px] w-full truncate' style={{ ...tipsProps }}>
              {children}
            </div>
          </Tooltip>
        ) : (
          <div className='whitespace-nowrap absolute text-[12px] w-full truncate' style={{ ...tipsProps }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

const PureImage = ({ img }: any) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!img) return;

    const loadImage = async (str: string) => {
      const image = await import(`../../../../../../assets/vision/${str}.png`);
      setImageSrc(image.default);
    };

    loadImage(img);
  }, [img]);
  return <>{imageSrc && <img className='h-full' src={imageSrc} />}</>;
};

const Tips = (props: any) => {
  return (
    <div>
      <div className='w-full bg-[#fffbe6] border-[#ffe58f] border-[1px] rounded-[8px] px-[12px] py-[8px]'>
        {props.children}
      </div>
    </div>
  );
};

const CompensationTips = () => {
  const { t } = useTranslation();
  return (
    <div className='flex relative top-[-25px]'>
      <div className='flex-1 text-center'>{t('补偿前')}</div>
      <div className='flex-1 text-center'>{t('补偿后')}</div>
    </div>
  );
};

export default memo(Illustration);
