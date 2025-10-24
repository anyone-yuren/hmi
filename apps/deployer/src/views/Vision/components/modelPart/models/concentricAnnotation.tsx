import BorderColorIcon from '@mui/icons-material/BorderColor';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import './pallet.css';

export const OutSideAnnotation = memo((props: any) => {
  const { t } = useTranslation();
  return (
    <div
      className='left-line'
      style={{
        width: '30px',
        height: '100%',
        border: '1px solid black',
        borderRight: 'none',
        position: 'absolute',
        left: '-30px',
      }}
      onClick={() => {
        props.handleSizeArea && props.handleSizeArea('maxDiameter');
      }}
    >
      <span className='text-[12px] flex items-center justify-center mx-auto write-vertical-right text-[red] relative right-[100%]'>
        <BorderColorIcon style={{ fontSize: '12px' }} /> &nbsp;
        {t('deployer.vision.outDiameter')}:{props?.maxDiameter}
      </span>
    </div>
  );
});
export const InSideAnnotation = memo((props: any) => {
  const { t } = useTranslation();
  return (
    <div
      className='line'
      style={{
        height: '30px',
        width: '100%',
        border: '1px solid black',
        borderBottom: 'none',
        position: 'absolute',
        top: '50%',
        transform: 'translate(0%, -50%)',
        textAlign: 'center',
      }}
      onClick={() => {
        props.handleSizeArea && props.handleSizeArea('minDiameter');
      }}
    >
      <span className='text-[12px] flex items-center w-[120px] mx-auto justify-center text-[red] relative top-[-100%]  px-[12px]'>
        <BorderColorIcon style={{ fontSize: '12px' }} />
        {t('deployer.vision.inDiameter')}:{props?.minDiameter}
      </span>
    </div>
  );
});
