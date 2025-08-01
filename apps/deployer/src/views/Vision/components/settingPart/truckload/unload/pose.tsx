import {
  getTailTruckScenariosPickPalletPositionDetectRead as read,
  postTailTruckScenariosPickPalletPositionDetectSave as save,
} from '@/views/Vision/services/index';
import { useRequest, useSetState } from 'ahooks';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import LoadingButton from '../../comp/loadingButton';
import PointCloudFilter from '../../comp/pointCloudFilter';
import TextChangeRow from '../../comp/textChangeRow';
import Title from '../../comp/title';
import PoseIllustration from './poseIllustration';
const Pose = () => {
  const { t } = useTranslation();
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    offset_left: 0,
    offset_right: 0,
    offset_angle: 0,
    offset_x: 0,
  });
  const renderList = [
    {
      label: t('行驶状态下车左侧装车体外轮廓到车厢侧面间隙'),
      key: 'offset_left',
    },
    {
      label: t('行驶状态下车右侧装车体外轮廓到车厢侧面间隙'),
      key: 'offset_right',
    },
    {
      label: t('库位前停靠距离'),
      key: 'offset_x',
    },
    {
      label: t('角度补偿'),
      key: 'offset_angle',
    },
  ];
  const { data: pickResponse } = useRequest(read, {});

  useEffect(() => {
    const params: any = { ...(pickResponse?.data || {}) };
    const obj = { ...updateHashMap };
    const ary = Object.keys(params);
    if (!ary.length) return;
    ary?.map((key: string) => {
      obj[key] = params[key].value;
    });
    obj['offset_left'] = params['offset_y'].value[0];
    obj['offset_right'] = params['offset_y'].value[1];
    setUpdateHashMap(obj);
  }, [pickResponse]);
  const validateInitParams = (params: any) => {
    const paramsKeys = ['offset_angle', 'offset_x', 'offset_y'];
    const missKeys: any = [];
    paramsKeys.map((key: string) => {
      if (params?.[key]?.value === undefined) {
        missKeys.push(key);
      }
    });
    return missKeys;
  };

  const handleOk = async () => {
    const params = { ...(pickResponse?.data || {}) };
    const missKeys = validateInitParams(params);
    if (missKeys.length) {
      toast.error(t('缺少基础参数') + missKeys.join(','));
      return;
    }
    Object.keys(params)?.map((key: string) => {
      params[key].value = updateHashMap[key];
    });
    params.offset_y.value = [updateHashMap.offset_left, updateHashMap.offset_right];
    await save(params);
    toast.success(t('操作成功'));
  };
  return (
    <>
      <div className='flex w-full text-black gap-[20px]'>
        <div className='w-[350px]'>
          <PointCloudFilter type={'tail_pick_pallet_position_detect'}></PointCloudFilter>
          <Title>{t('补偿参数')}</Title>
          {renderList?.map((item) => {
            return (
              <TextChangeRow
                title={item.label}
                value={updateHashMap[item.key]}
                onChange={(value: string) => {
                  setUpdateHashMap({ [item.key]: Number(value) });
                }}
              >
                <div className='w-[100px] text-right'>{updateHashMap[item.key]}</div>
              </TextChangeRow>
            );
          })}
          <LoadingButton fullWidth variant='contained' sx={{ color: 'white', marginBottom: '40px' }} onPress={handleOk}>
            {t('保存')}
          </LoadingButton>
        </div>
        <div className='flex-1'>
          <PoseIllustration />
        </div>
      </div>
    </>
  );
};

export default memo(Pose);
