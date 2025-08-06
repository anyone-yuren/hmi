import BorderColorIcon from '@mui/icons-material/BorderColor';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import './pallet.css';

const CylinderAnnotation = (props: any) => {
  const { t } = useTranslation();
  return (
    <>
      <div
        className='line absolute w-full'
        style={{
          border: '1px solid black',
          height: '50px',
          top: '-50px',
          borderBottom: 'none',
          textAlign: 'center',
        }}
        onClick={() => {
          props?.handleSizeArea && props?.handleSizeArea('diameter');
        }}
      >
        <span className='relative top-[-30%] px-[12px] w-[110px] flex items-center mx-auto justify-center bg-[white] text-[red] text-[12px]'>
          <BorderColorIcon style={{ fontSize: '12px' }} /> {t('deployer.vision.diameter')}:{props?.diameter}
        </span>
      </div>
      <div
        className='right-line absolute h-full text-center'
        style={{
          border: '1px solid black',
          right: '-30px',
          width: '30px',
          borderLeft: 'none',
        }}
        onClick={() => {
          props?.handleSizeArea && props?.handleSizeArea('height');
        }}
      >
        <span className='relative right-[-120%] w-[30px] flex items-center justify-center bg-[white] write-vertical-right text-[red] text-[12px]'>
          <BorderColorIcon style={{ fontSize: '12px' }} />
          &nbsp;
          {t('deployer.vision.height')}:{props?.height}
        </span>
      </div>
    </>
  );
};

export default memo(CylinderAnnotation);
