import { Chip } from '@mui/material';
import { useRequest } from 'ahooks';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getPointList } from '../../../services/index';
import SecondaryPage, { SecondaryPaper } from '../../SecondaryPage';
import CustomSelect from './customSelect';
import StorageStage from './storageStage';
import TextUpdateRow from './textUpdateRow';

interface IProps {
  title?: string | null;
  value: any[];
  onChange: (value: any[]) => void;
  className?: string;
}
const StorageListSelect = (props: IProps) => {
  const { title, value, onChange } = props;
  const [open, setOpen] = useState(false);
  // 0:普通点位 1：库位点 2：待命点 6：充电点
  const { data: pointList } = useRequest(() => getPointList(), {});
  const { t } = useTranslation();

  return (
    <>
      <TextUpdateRow className={props.className}>
        <div>{title || t('deployer.vision.storage')}</div>
        <div className='relative'>
          <div
            className='absolute w-full h-full top-0 left-0 z-10'
            onClick={() => {
              setOpen(true);
            }}
          ></div>
          <CustomSelect
            multiple
            key={JSON.stringify(value)}
            variant='standard'
            value={value}
            renderValue={(value: any) => {
              return (
                <div className='flex flex-wrap pr-[10px] items-center justify-start'>
                  {value?.map((item: any, index: number) => {
                    return <Chip key={item + (index + '')} className='mt-1 mr-1' label={item} size='small' />;
                  })}
                </div>
              );
            }}
          ></CustomSelect>
        </div>
      </TextUpdateRow>
      <SecondaryPage open={open} setOpen={setOpen} fullScreen={true} background={'#445260'} titleColor={'white'}>
        <SecondaryPaper>
          {open && (
            <StorageStage
              value={value}
              onChange={(value: any[]) => {
                onChange && onChange(value);
                setOpen(false);
              }}
            ></StorageStage>
          )}
        </SecondaryPaper>
      </SecondaryPage>
    </>
  );
};

export default memo(StorageListSelect);
