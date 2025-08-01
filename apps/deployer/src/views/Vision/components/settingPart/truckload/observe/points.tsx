import StorageListSelect from '@/views/Vision/components/settingPart/comp/storageListSelect';
import {
  getTailTruckScenariosMapPointSettingRead as read,
  postTailTruckScenariosMapPointSettingSave as save,
} from '@/views/Vision/services/index';
import { useRequest, useSetState } from 'ahooks';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import LoadingButton from '../../comp/loadingButton';
const Points = () => {
  const { t } = useTranslation();
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    goods_points: [],
    vision_points: [],
  });
  const { data: pointConfig } = useRequest(read, {});

  useEffect(() => {
    console.log('pointConfig', pointConfig);
    setUpdateHashMap({
      goods_points: pointConfig?.data?.goods_points?.value,
      vision_points: pointConfig?.data?.vision_points?.value,
    });
  }, [pointConfig]);
  const changeUpdateHashMap = (key: string, value: any) => {
    setUpdateHashMap({
      [key]: value,
    });
  };

  const handleOk = async () => {
    const params = { ...pointConfig.data };
    Object.keys(params)?.map((key: string) => {
      params[key].value = updateHashMap[key];
    });
    await save(params);
    toast.success(t('操作成功'));
  };
  return (
    <>
      <div className='flex w-full text-black'>
        <div className='w-[350px]'>
          <StorageListSelect
            title={t('观测点库位')}
            value={updateHashMap['vision_points']}
            onChange={(value: any) => {
              changeUpdateHashMap('vision_points', value);
            }}
          ></StorageListSelect>
          <StorageListSelect
            title={t('装卸车库位')}
            value={updateHashMap['goods_points']}
            onChange={(value: any) => {
              changeUpdateHashMap('goods_points', value);
            }}
          ></StorageListSelect>
          <LoadingButton fullWidth variant='contained' sx={{ color: 'white', marginBottom: '40px' }} onPress={handleOk}>
            {t('保存')}
          </LoadingButton>
        </div>
        <div className='flex-1'></div>
      </div>
    </>
  );
};

export default memo(Points);
