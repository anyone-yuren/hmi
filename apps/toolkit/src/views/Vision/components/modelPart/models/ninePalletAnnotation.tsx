import { memo } from 'react';
import { toast } from 'sonner';

import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useTranslation } from 'react-i18next';
import './pallet.css';

const NinePalletAnnotation = (props: any) => {
  const { t } = useTranslation();
  return (
    <>
      <div className='text-[red]'>
        <div
          className='line absolute left-[0] text-center text-[13px] z-10'
          style={{
            top: -20,
            width: props?.width * props.scale,
            height: 20,
            border: '1px solid black',
            borderBottom: 'none',
          }}
        >
          <span
            className='relative bg-[white] text-[black]'
            style={{
              top: '-35%',
              paddingInline: 20,
            }}
            onClick={() => {
              toast.error('托盘宽度不可手动改变,是支腿宽度和进叉宽度的累加');
            }}
          >
            {t('deployer.vision.palletWidth')}: {props?.width}
          </span>
        </div>
        {props?.legs?.map((leg: any, index: number) => {
          return (
            <div
              key={'topLeg' + index}
              className='line absolute text-[13px] text-center'
              style={{
                width: leg?.topWidth * props.scale,
                height: '20px',
                top: '-20px',
                left: leg?.leftPosition * props.scale,
                border: '1px solid black',
                borderBottom: 'none',
                zIndex: 11,
              }}
              onClick={() => {
                props.handleSizeArea && props.handleSizeArea('legs', index, 'topWidth');
              }}
            >
              <span className='relative top-[-30px] whitespace-nowrap text-center flex items-center justify-center'>
                <BorderColorIcon style={{ fontSize: '12px' }} />
                {t('deployer.vision.legTopWidth')}:{leg?.topWidth}
              </span>
            </div>
          );
        })}

        {props?.legs?.map((leg: any, index: number) => {
          return (
            <div
              key={'topLeg' + index}
              className='bottom-line absolute text-[13px] text-center'
              style={{
                width: leg?.topWidth * props.scale * 0.6,
                height: '30px',
                top: props.handlesMaxHeight * props.scale + leg?.height * props.scale + props.height * props.scale,
                left: leg?.leftPosition * props.scale + leg?.topWidth * props.scale * 0.2,
                border: '1px solid black',
                borderTop: 'none',
              }}
              onClick={() => {
                props.handleSizeArea && props.handleSizeArea('legs', index, 'bottomWidth');
              }}
            >
              <span className='relative top-[40px] whitespace-nowrap text-center flex items-center justify-center'>
                <BorderColorIcon style={{ fontSize: '12px' }} />
                {t('deployer.vision.legBottomWidth')}:{leg?.bottomWidth}
              </span>
            </div>
          );
        })}

        {props?.legForkInWidth?.map((leg: any, index: number) => {
          return (
            <div
              key={'legForkInWidth' + index}
              className='line absolute text-[13px] text-center'
              style={{
                width: leg?.width * props.scale,
                height: '30px',
                top: props.handlesMaxHeight * props.scale + props?.height * props.scale,
                left: leg?.leftPosition * props.scale,
                border: '1px solid black',
                borderBottom: 'none',
              }}
              onClick={() => {
                props.handleSizeArea && props.handleSizeArea('legForkInWidth', index, 'width');
              }}
            >
              <span className='relative whitespace-nowrap text-center flex items-center justify-center'>
                <BorderColorIcon style={{ fontSize: '12px' }} />
                {t('deployer.vision.forkWidth')}:{leg?.width}
              </span>
            </div>
          );
        })}

        <div
          className='left-line absolute text-[13px]'
          style={{
            width: '30px',
            height: props?.legsMaxHeight * props.scale,
            top: props?.handlesMaxHeight * props.scale + props?.height * props.scale,
            left: '-30px',
            border: '1px solid black',
            borderRight: 'none',
          }}
          onClick={() => {
            props.handleSizeArea && props.handleSizeArea('legsMaxHeight');
          }}
        >
          <span className='relative left-[-100%] whitespace-nowrap write-vertical-right flex items-center justify-center'>
            <BorderColorIcon style={{ fontSize: '12px' }} />
            &nbsp;
            {t('deployer.vision.legHeight')}: {props?.legsMaxHeight}
          </span>
        </div>

        {props?.handlesMaxHeight > 0 && (
          <div
            className='left-line absolute text-[13px]'
            style={{
              width: '30px',
              height: props?.handlesMaxHeight * props.scale,
              top: '0px',
              border: '1px solid black',
              borderRight: 'none',
              left: '-30px',
            }}
            onClick={() => {
              props.handleSizeArea && props.handleSizeArea('handlesMaxHeight');
            }}
          >
            <span className='relative left-[-100%] whitespace-nowrap write-vertical-right'>
              {t('deployer.vision.handleHeight')}: {props?.handlesMaxHeight}
            </span>
          </div>
        )}

        <div
          className='right-line absolute top-[0] text-[13px]'
          style={{
            width: '30px',
            height: props?.totalHeight * props?.scale,
            right: '-30px',
            border: '1px solid black',
            borderLeft: 'none',
          }}
          onClick={() => {
            props.handleSizeArea && props.handleSizeArea('totalHeight');
          }}
        >
          <span className='relative right-[-120%] whitespace-nowrap write-vertical-right flex items-center justify-center'>
            <BorderColorIcon style={{ fontSize: '12px' }} />
            &nbsp;
            {t('deployer.vision.palletHeight')}: {props?.totalHeight}
          </span>
        </div>
      </div>
    </>
  );
};

export default memo(NinePalletAnnotation);
