import { memo, useEffect } from 'react';

import LoadingButton from '@/views/Vision/components/settingPart/comp/loadingButton';
import StorageListSelect from '@/views/Vision/components/settingPart/comp/storageListSelect';
import TextChangeRow from '@/views/Vision/components/settingPart/comp/textChangeRow';
import Title from '@/views/Vision/components/settingPart/comp/title';
import { updateModel } from '@/views/Vision/services/index';
import { ThemeProvider, createTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useSetState } from 'ahooks';
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
  const { propsState } = props;
  const { t } = useTranslation();
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    extra_deep_compensation: 0, // 额外深度补偿
    storage_list: [], // 目标库位号
  });

  useEffect(() => {
    const obj = {
      extra_deep_compensation: propsState?.['extra_deep_compensation'] || 0,
      storage_list: propsState?.['storage_list'] || [],
    };
    setUpdateHashMap(obj);
  }, [propsState]);

  const changeUpdateHashMap = (key: string, value: any) => {
    setUpdateHashMap({
      [key]: value,
    });
  };

  return (
    <LightTheme>
      <div className='text-black h-full flex gap-[10px]'>
        <div className='w-[350px]'>
          <Title>{propsState.name}</Title>
          <TextChangeRow
            title={t('额外深度补偿')}
            value={updateHashMap?.['extra_deep_compensation']}
            onChange={(value: string) => {
              changeUpdateHashMap('extra_deep_compensation', value);
            }}
          >
            <div>{updateHashMap?.['extra_deep_compensation'] || 0}</div>
          </TextChangeRow>

          <StorageListSelect
            title={t('目标库位号')}
            value={updateHashMap?.['storage_list']}
            onChange={(value: any) => {
              changeUpdateHashMap('storage_list', value);
            }}
          ></StorageListSelect>

          <LoadingButton
            fullWidth
            variant='contained'
            sx={{ color: 'white', marginBottom: '40px' }}
            onPress={async () => {
              const params = {
                ...propsState,
                ...updateHashMap,
              };
              await updateModel(params);
              toast.success(t('操作成功'));
            }}
          >
            {t('保存')}
          </LoadingButton>
        </div>
      </div>
    </LightTheme>
  );
};

export default memo(ParamsSetting);
