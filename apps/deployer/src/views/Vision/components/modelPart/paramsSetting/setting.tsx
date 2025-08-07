import { memo, useMemo } from 'react';

import StorageListSelect from '@/views/Vision/components/settingPart/comp/storageListSelect';
import TextChangeRow from '@/views/Vision/components/settingPart/comp/textChangeRow';
import { ThemeProvider, createTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LightTheme = (props: any) => {
  return (
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
      {props.children}
    </ThemeProvider>
  );
};

const ParamsSetting = (props: any) => {
  const { propsState, setPropsState } = props;
  const { t } = useTranslation();

  const changeUpdateHashMap = (key: string, value: any) => {
    setPropsState({
      ...propsState,
      [key]: typeof value === 'string' ? Number(value) : value,
    });
  };

  const goodsValidateRange = useMemo(() => {
    if (propsState?.type !== 'warehouse_shelves') return [0, 0];
    console.log();
    const { storage_width, legs_width, goods_width } = propsState;
    const maxGoodsNums = Math.floor((storage_width - legs_width * 2) / goods_width);
    return [0, maxGoodsNums];
  }, [propsState]);

  return (
    <LightTheme>
      <div className='text-black flex gap-[10px] justify-center'>
        <TextChangeRow
          className={'w-[280px]'}
          title={t('deployer.vision.extraDepthCompensation')}
          value={propsState?.['extra_deep_compensation']}
          onChange={(value: string) => {
            changeUpdateHashMap('extra_deep_compensation', value);
          }}
        >
          <div>{propsState?.['extra_deep_compensation'] || 0}</div>
        </TextChangeRow>

        {propsState.type === 'warehouse_shelves' && (
          <TextChangeRow
            className={'w-[280px]'}
            title={t('deployer.vision.goodsCount')}
            value={propsState?.['goods_nums']}
            validateRange={goodsValidateRange}
            onChange={(value: string) => {
              changeUpdateHashMap('goods_nums', value);
            }}
          >
            <div>{propsState?.['goods_nums'] || 0}</div>
          </TextChangeRow>
        )}

        <StorageListSelect
          className='w-[280px]'
          title={t('deployer.vision.targetStorage')}
          value={propsState?.['storage_list']}
          onChange={(value: any) => {
            changeUpdateHashMap('storage_list', value);
          }}
        ></StorageListSelect>
      </div>
    </LightTheme>
  );
};

export default memo(ParamsSetting);
