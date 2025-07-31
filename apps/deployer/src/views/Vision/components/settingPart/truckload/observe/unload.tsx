import {
  getTailTruckScenariosPickStorageDetectRead as read,
  postTailTruckScenariosPickStorageDetectSave as save,
} from '@/views/Vision/services/index';
import { useRequest, useSetState } from 'ahooks';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import LoadingButton from '../../comp/loadingButton';
import PointCloudFilter from '../../comp/pointCloudFilter';
import TextChangeRow from '../../comp/textChangeRow';
import Title from '../../comp/title';
import UnloadIllustration from './unloadIllustration';
const UnLoad = () => {
  const { t } = useTranslation();
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    offset_left: 0,
    offset_right: 0,
    offset_angle: 0,
  });
  const { data: unloadResponse } = useRequest(read, {});
  const renderList = [
    {
      label: t('左侧补偿参数'),
      key: 'offset_left',
    },
    {
      label: t('右侧补偿参数'),
      key: 'offset_right',
    },
    {
      label: t('角度补偿参数'),
      key: 'offset_angle',
    },
  ];
  useEffect(() => {
    setUpdateHashMap({
      offset_left: unloadResponse?.data?.offset_y?.value[0],
      offset_right: unloadResponse?.data?.offset_y?.value[1],
      offset_angle: unloadResponse?.data?.offset_angle?.value,
    });
  }, [unloadResponse]);

  const handleOk = async () => {
    try {
      const params = { ...unloadResponse?.data };
      !params.offset_y && (params.offset_y = {});
      !params.offset_angle && (params.offset_angle = {});
      params.offset_y.value = [updateHashMap.offset_left, updateHashMap.offset_right];
      params.offset_angle.value = updateHashMap.offset_angle;

      console.log('params', params);
      await save(params);
      toast.success(t('操作成功'));
    } catch (e) {
      console.log('e', e);
    }
  };
  return (
    <>
      <div className='flex w-full text-black gap-[30px]'>
        <div className='w-[350px]'>
          <PointCloudFilter type={'tail_pick_storage_detect'}></PointCloudFilter>
          <Title>{t('补偿参数')}</Title>
          {renderList?.map((item) => {
            return (
              <TextChangeRow
                key={item.key}
                title={item.label}
                value={updateHashMap?.[item.key]}
                onChange={(value: string) => {
                  setUpdateHashMap({ [item.key]: Number(value) });
                }}
              >
                <div>{updateHashMap?.[item.key]}</div>
              </TextChangeRow>
            );
          })}
          <LoadingButton fullWidth variant='contained' sx={{ color: 'white', marginBottom: '40px' }} onPress={handleOk}>
            {t('保存')}
          </LoadingButton>
        </div>
        <div className='flex-1'>
          <UnloadIllustration />
        </div>
      </div>
    </>
  );
};

export default memo(UnLoad);
