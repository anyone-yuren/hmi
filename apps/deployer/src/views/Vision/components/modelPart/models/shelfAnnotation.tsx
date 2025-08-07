import BorderColorIcon from '@mui/icons-material/BorderColor';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './pallet.css';

const shelfAnnotation = (props: any) => {
  const { goods_nums, goods_width, storage_width, legs_height, legs_width, crossbeam_height, handleSizeArea, scale } =
    props;
  const { t } = useTranslation();

  const gap = useMemo(() => {
    return (storage_width - goods_nums * goods_width) / (goods_nums + 1);
  }, [storage_width, goods_width, goods_nums, legs_width]);

  return (
    <>
      <div
        className='line text-center w-full absolute'
        style={{
          border: '1px solid black',
          height: '30px',
          top: '-30px',
          left: legs_width * scale,
          width: props?.storage_width * scale,
          borderBottom: 'none',
        }}
      >
        <span
          className='relative top-[-50%] px-[12px] bg-[white] w-[120px] mx-auto flex items-center justify-center text-[red] text-[12px]'
          onClick={() => {
            handleSizeArea && handleSizeArea('storage_width');
          }}
        >
          <BorderColorIcon style={{ fontSize: '12px' }} /> {t('deployer.vision.width')}: {storage_width}
        </span>
      </div>

      <div
        className='right-line  text-center bottom-0 absolute'
        style={{
          border: '1px solid black',
          right: '-30px',
          width: '30px',
          borderLeft: 'none',
          height: legs_height * scale,
        }}
      >
        <span className='relative right-[-120%] w-[30px] flex items-center justify-center bg-[white] write-vertical-right  text-[12px] whitespace-nowrap'>
          {t('deployer.vision.legHeight')}:{legs_height}
        </span>
      </div>

      <div
        className='left-line top-0 absolute'
        style={{
          border: '1px solid black',
          borderRight: 'none',
          width: '30px',
          left: '-30px',
          height: crossbeam_height * scale,
        }}
      >
        <span className='relative w-full flex items-center justify-center left-[-100%] text-center whitespace-nowrap  text-[12px] write-vertical-right '>
          {t('deployer.vision.shelfThickness')}: {crossbeam_height}
        </span>
      </div>

      <div
        className='bottom-line right-0 absolute'
        style={{
          border: '1px solid black',
          borderTop: 'none',
          height: '30px',
          width: legs_width * scale,
          bottom: '-30px',
        }}
      >
        <span className='relative top-[120%] h-[30px] whitespace-nowrap text-center flex items-center text-[12px] justify-center'>
          {t('deployer.vision.legWidth')}:{legs_width}
        </span>
      </div>

      <div
        className='bottom-line absolute'
        style={{
          border: '1px solid black',
          borderTop: 'none',
          height: '30px',
          width: gap * scale,
          bottom: '-30px',
          left: legs_width * scale + 'px',
        }}
      >
        <span className='relative top-[120%] h-[30px] whitespace-nowrap text-center flex items-center text-[12px] justify-center'>
          {t('deployer.vision.goodsGap')}:{gap.toFixed(2)}
        </span>
      </div>

      <div
        className='bottom-line absolute'
        style={{
          border: '1px solid black',
          borderTop: 'none',
          height: '30px',
          width: goods_width * scale,
          bottom: '-30px',
          left: (legs_width + gap) * scale + 'px',
        }}
      >
        <span
          className='relative top-[120%] h-[30px] whitespace-nowrap text-center flex items-center text-[red] text-[12px] justify-center'
          onClick={() => {
            handleSizeArea && handleSizeArea('goods_width');
          }}
        >
          <BorderColorIcon style={{ fontSize: '12px' }} />
          {t('deployer.vision.goodsWidth')}:{goods_width}
        </span>
      </div>
    </>
  );
};

export default memo(shelfAnnotation);
