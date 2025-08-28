import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SecondaryPage, { SecondaryPaper } from '../../SecondaryPage';
import StorageStage from './storageStage';
import TextUpdateRow from './textUpdateRow';

interface IProps {
  title?: string | null;
  value: any[];
  onChange: (value: any[]) => void;
  className?: string;
}
const StorageRowSelect = (props: IProps) => {
  const { title, value, onChange } = props;
  const [open, setOpen] = useState(false);
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
          <div>
            {value?.length ? (
              value.join(',')
            ) : (
              <span className='text-sm'>{t('deployer.vision.clickSelectStorage')}</span>
            )}
          </div>
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

export default memo(StorageRowSelect);
