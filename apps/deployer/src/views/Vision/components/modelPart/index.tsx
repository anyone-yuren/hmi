import { Button } from '@mui/material';
import { memo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SecondaryPage, { SecondaryPaper } from '../SecondaryPage';
import AddModel from './addModel';
import ModelList from './list';

const ModelPart = () => {
  const modelListRef = useRef<any>();
  const [open, setOpen] = useState(false);

  const [modelConfig, setModelConfig] = useState({
    visible: false,
    items: {},
    type: 'add',
    countHashMap: {},
  });

  const { t } = useTranslation();

  return (
    <>
      <div className='flex gap-4 flex-col h-full'>
        <div className='flex justify-between items-center'>
          <span>{t('deployer.vision.modelList')}</span>
          <Button
            variant='contained'
            sx={{ color: 'white' }}
            onClick={() => {
              setOpen(true);
              setModelConfig({
                visible: true,
                type: 'add',
                items: {},
                countHashMap: modelListRef?.current?.getCountHashMap(),
              });
            }}
          >
            {t('deployer.vision.addNewModel')}
          </Button>
        </div>
        <div className='flex-1 overflow-auto'>
          <ModelList
            ref={modelListRef}
            handleItems={(item: any) => {
              setOpen(true);
              setModelConfig({
                type: 'update',
                visible: true,
                items: item,
                countHashMap: {},
              });
            }}
          ></ModelList>
        </div>
      </div>

      <SecondaryPage open={open} setOpen={setOpen} fullScreen={true} background={'#445260'}>
        <SecondaryPaper>
          {modelConfig.visible && (
            <AddModel
              type={modelConfig.type}
              item={modelConfig.items}
              countHashMap={modelConfig.countHashMap}
              callback={() => {
                setOpen(false);
                modelListRef?.current?.reGetList();
              }}
            ></AddModel>
          )}
        </SecondaryPaper>
      </SecondaryPage>
    </>
  );
};

export default memo(ModelPart);
