import { memo, useMemo } from 'react';

import StorageListSelect from '@/views/Vision/components/settingPart/comp/storageListSelect';
import TextChangeRow from '@/views/Vision/components/settingPart/comp/textChangeRow';
import { ListItemText, MenuItem, ThemeProvider, createTheme } from '@mui/material';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { getCompareRobotToolkitModelWithWebModelRead } from '../../../services/index';
import CustomSelect from '../../settingPart/comp/customSelect';
import TextUpdateRow from '../../settingPart/comp/textUpdateRow';

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
  const { data: palletResponse } = useRequest(getCompareRobotToolkitModelWithWebModelRead);

  const changeUpdateHashMap = (key: string, value: any) => {
    console.log(key, value);
    let _value = typeof value === 'string' ? Number(value) : value;
    if (key === 'display_name') {
      _value = value;
    }
    setPropsState({
      ...propsState,
      [key]: _value,
    });
  };

  const goodsValidateRange = useMemo(() => {
    console.log('propsState', propsState);
    if (propsState?.type !== 'warehouse_shelves') return [0, 0];
    const { storage_width, legs_width, goods_width } = propsState;
    const maxGoodsNums = Math.floor((storage_width - legs_width * 2) / goods_width);
    return [0, maxGoodsNums];
  }, [propsState]);

  const palletList = useMemo(() => {
    return palletResponse?.data?.pallet_info_list || [];
  }, [palletResponse]);

  // useEffect(() => {
  //   if (propsState.type === 'multi_cage') {
  //     getMultiCageModels();
  //   }
  // }, [propsState]);

  return (
    <LightTheme>
      <div className='text-black gap-[10px] justify-center'>
        <TextChangeRow
          className={'w-[260px]'}
          title={t('deployer.vision.palletName')}
          value={propsState?.['display_name']}
          type='text'
          onChange={(value: string) => {
            changeUpdateHashMap('display_name', value);
          }}
        >
          <div>{propsState?.['display_name'] || ''}</div>
        </TextChangeRow>
        <TextChangeRow
          className={'w-[260px]'}
          title={t('deployer.vision.extraDepthCompensation')}
          value={propsState?.['extra_deep_compensation']}
          onChange={(value: string) => {
            changeUpdateHashMap('extra_deep_compensation', value);
          }}
        >
          <div>{propsState?.['extra_deep_compensation'] || 0}</div>
        </TextChangeRow>

        {propsState.type != 'tail_truck' && propsState.type != 'warehouse_shelves' && (
          <TextChangeRow
            className={'w-[260px]'}
            title={t('deployer.vision.forkExtendParams')}
            value={propsState?.['forkarm_final_width']}
            onChange={(value: string) => {
              changeUpdateHashMap('forkarm_final_width', value);
            }}
          >
            <div>{propsState?.['forkarm_final_width'] || 0}</div>
          </TextChangeRow>
        )}

        {propsState.type === 'warehouse_shelves' && (
          <TextChangeRow
            className={'w-[260px]'}
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

        {
          <TextUpdateRow className={'w-[260px]'}>
            <div>{t('deployer.vision.palletName')}</div>
            <div>
              <CustomSelect
                variant='standard'
                value={propsState?.['robot_toolkit_model_id']}
                onChange={(event) => {
                  const selectedValue = event.target.value;
                  const selectedItem = palletList.find((item: any) => item.pallet_id === Number(selectedValue));
                  setPropsState({
                    ...propsState,
                    ['robot_toolkit_model_id']: Number(selectedValue),
                    ['robot_toolkit_model_name']: selectedItem?.pallet_name,
                  });
                }}
              >
                {palletList?.map((item: any) => {
                  return (
                    <MenuItem value={item?.pallet_id} key={item?.pallet_id}>
                      <ListItemText primary={item?.pallet_name || '-'} />
                    </MenuItem>
                  );
                })}
              </CustomSelect>
            </div>
          </TextUpdateRow>
        }
        <StorageListSelect
          className='w-[260px]'
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
