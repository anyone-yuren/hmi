import { Button, Tab, Tabs, ThemeProvider, createTheme, styled } from '@mui/material';
import { useRequest } from 'ahooks';
import { SyntheticEvent, memo, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { getModalTypes, saveModel, updateModel } from '../../services/index';
import { translateFnHashMap, translateSendParams } from '../../utils/index';
import Concentric from './models/concentric';
import Cylinder from './models/cylinder';
import MultiCage from './models/multiCage';
import NinePallet from './models/ninePallet';
import Pallet from './models/pallet';
import Rect from './models/rect';
import Shelf from './models/shelf';
import Truck from './models/truck';

import { useTranslation } from 'react-i18next';

const ModelsTabs = styled((props: any) => <Tab {...props} />)(() => ({
  minWidth: '160px',
  height: '80px',
  '&::before': {
    content: '" "',
    position: 'absolute',
    height: '90%',
    width: '2px',
    background: 'white',
    right: '0px',
  },
}));

const AddModel = (props: any) => {
  const { type, countHashMap, callback } = props;
  const [containerTypeList, setContainerTypeList] = useState<any[]>([]);
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const containerRefHashMap = useRef<any>({
    pallet: null,
    rect: null,
  });
  const { data: originContainerTypeList } = useRequest(getModalTypes, {});

  const isAdd = useMemo(() => type === 'add', [type]);
  const isUpdate = useMemo(() => type === 'update', [type]);

  const { t } = useTranslation();

  useEffect(() => {
    if (!originContainerTypeList?.data) {
      return;
    }
    const ary: any[] = [...originContainerTypeList?.data];
    for (let index = 0; index < ary.length; index++) {
      const type = ary[index].type;
      if (translateFnHashMap?.[type]) {
        ary[index] = translateFnHashMap?.[type](ary[index]);
      }
    }
    setContainerTypeList(ary);
  }, [originContainerTypeList]);

  const containerHashMap: any = {
    pallet: (container: any) => {
      return (
        <Pallet
          ref={(refs: any) => {
            containerRefHashMap.current.pallet = refs;
          }}
          {...container}
        />
      );
    },
    cage: (container: any) => {
      return (
        <Pallet
          ref={(refs: any) => {
            containerRefHashMap.current.cage = refs;
          }}
          {...container}
        />
      );
    },
    rect: (container: any) => {
      return (
        <Rect
          ref={(refs: any) => {
            containerRefHashMap.current.rect = refs;
          }}
          {...container}
        />
      );
    },
    concentric: (container: any) => {
      return (
        <Concentric
          ref={(refs: any) => {
            containerRefHashMap.current.concentric = refs;
          }}
          {...container}
        />
      );
    },
    cylinder: (container: any) => {
      return (
        <Cylinder
          ref={(refs: any) => {
            containerRefHashMap.current.cylinder = refs;
          }}
          {...container}
        />
      );
    },
    'nine-corner-pallet': (container: any) => {
      return (
        <NinePallet
          ref={(refs: any) => {
            containerRefHashMap.current['nine-corner-pallet'] = refs;
          }}
          {...container}
        />
      );
    },
    warehouse_shelves: (container: any) => {
      return (
        <Shelf
          ref={(refs: any) => {
            containerRefHashMap.current['warehouse_shelves'] = refs;
          }}
          {...container}
        />
      );
    },
    tail_truck: (container: any) => {
      return (
        <Truck
          ref={(refs: any) => {
            containerRefHashMap.current['tail_truck'] = refs;
          }}
          {...container}
        />
      );
    },
    multi_cage: (container: any) => {
      return (
        <MultiCage
          ref={(refs: any) => {
            containerRefHashMap.current.multi_cage = refs;
          }}
          {...container}
        />
      );
    },
  };

  const handleSave = async () => {
    const { type } = isAdd ? containerTypeList?.[value] : props?.item;
    const params = containerRefHashMap?.current?.[type]?.getParams();

    const newParams = translateSendParams[type](params);

    if (isAdd) {
      delete newParams.id;
      newParams.name = params.name + '_' + ((countHashMap?.[type] || 0) + 1);
      await saveModel(newParams);
    }
    if (isUpdate) {
      await updateModel(newParams);
    }
    toast.success(t('common.actionSuccess'));
    callback();
  };

  return (
    <div className='text-black h-full flex flex-col'>
      <ThemeProvider
        theme={createTheme({
          palette: {
            mode: 'light',
            primary: {
              main: '#00D1D1',
            },
          },
          typography: {
            fontSize: 20,
          },
        })}
      >
        {isAdd && (
          <div className='flex-none'>
            {!containerTypeList.length ? (
              <div className='text-center'>{t('common.noData')}</div>
            ) : (
              <Tabs scrollButtons variant='scrollable' value={value} onChange={handleChange} className='bg-[#eae9e9]'>
                {containerTypeList?.map((container: any) => {
                  return <ModelsTabs key={container.id} icon={containerHashMap?.[container?.type]?.(container)} />;
                })}
              </Tabs>
            )}
          </div>
        )}

        <div className='grow pt-[30px]'>
          {(() => {
            const container: any = isAdd ? containerTypeList[value] : props?.item;

            if (!container || !container?.type || !containerHashMap[container?.type]) {
              return null;
            }
            return containerHashMap[container?.type]({
              ...container,
              showMarks: true,
            });
          })()}
        </div>

        <div className='text-center flex gap-10 self-center'>
          <Button variant='contained' size='small' sx={{ color: 'white' }} onClick={handleSave}>
            {t('common.save')}
          </Button>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default memo(AddModel);
