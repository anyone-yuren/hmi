import BorderColorIcon from '@mui/icons-material/BorderColor';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { IRectAnnotationProps } from '../index.d';
import './pallet.css';

const RectAnnotation = (props: IRectAnnotationProps) => {
  const { width, height, handleSizeArea } = props;
  const { t } = useTranslation();
  return (
    <>
      <div
        className='line text-center w-full absolute'
        style={{
          border: '1px solid black',
          height: '30px',
          top: '-30px',
          borderBottom: 'none',
        }}
      >
        <span
          className='relative top-[-50%] px-[12px] bg-[white] w-[120px] mx-auto flex items-center justify-center text-[red] text-[12px]'
          onClick={() => {
            handleSizeArea && handleSizeArea('width');
          }}
        >
          <BorderColorIcon style={{ fontSize: '12px' }} /> {t('deployer.vision.width')}: {width}
        </span>
      </div>
      <div
        className='right-line  text-center h-full absolute'
        style={{
          border: '1px solid black',
          right: '-30px',
          width: '30px',
          borderLeft: 'none',
        }}
      >
        <span
          className='relative right-[-120%] w-[30px] flex items-center justify-center bg-[white] write-vertical-right text-[red] text-[12px] whitespace-nowrap'
          onClick={() => {
            handleSizeArea && handleSizeArea('height');
          }}
        >
          <BorderColorIcon style={{ fontSize: '12px' }} /> &nbsp;
          {t('deployer.vision.height')}:{height}
        </span>
      </div>
    </>
  );
};

export default memo(RectAnnotation);
