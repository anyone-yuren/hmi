import {
  getTailTruckScenariosPlaceMoveVehicleRead as read,
  postTailTruckScenariosPlaceMoveVehicleSave as save,
} from '@/views/Vision/services/index';
import { useRequest, useSetState } from 'ahooks';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import LoadingButton from '../../comp/loadingButton';
import PointCloudFilter from '../../comp/pointCloudFilter';
import TextChangeRow from '../../comp/textChangeRow';
import Title from '../../comp/title';
import SidewayIllustration from './sidewayIllustration';
const Sideway = () => {
  const { t } = useTranslation();
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    offset_y_left: 0,
    offset_y_right: 0,
    offset_x_left: 0,
    offset_x_right: 0,
  });
  const renderList = [
    {
      title: t('deployer.vision.leftCompensation'),
      key: 'left',
      children: [
        {
          label: t('deployer.vision.placeForkMovePoseDetect'),
          key: 'offset_y_left',
        },
        {
          label: t('deployer.vision.placeAroundCompensation'),
          key: 'offset_x_left',
        },
      ],
    },
    {
      title: t('deployer.vision.rightCompensation'),
      key: 'right',
      children: [
        {
          label: t('deployer.vision.placeForkMovePoseDetect'),
          key: 'offset_y_right',
        },
        {
          label: t('deployer.vision.placeAroundCompensation'),
          key: 'offset_x_right',
        },
      ],
    },
  ];

  const { data: pickResponse } = useRequest(read, {});

  useEffect(() => {
    const params: any = { ...(pickResponse?.data || {}) };
    const obj = { ...updateHashMap };
    if (!params['offset_y'] || !params['offset_x']) return;
    obj['offset_y_left'] = params['offset_y']?.value?.[0];
    obj['offset_y_right'] = params['offset_y']?.value?.[1];
    obj['offset_x_left'] = params['offset_x']?.value?.[0];
    obj['offset_x_right'] = params['offset_x']?.value?.[1];
    setUpdateHashMap(obj);
  }, [pickResponse]);

  const validateInitParams = (params: any) => {
    const paramsKeys = ['offset_x', 'offset_y'];
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
      toast.error(t('deployer.vision.missParamsTips') + missKeys.join(','));
      return;
    }
    params.offset_y.value = [updateHashMap.offset_y_left, updateHashMap.offset_y_right];
    params.offset_x.value = [updateHashMap.offset_x_left, updateHashMap.offset_x_right];
    await save(params);
    toast.success(t('common.actionSuccess'));
  };
  return (
    <>
      <div className='flex w-full text-black gap-[20px]'>
        <div className='w-[350px]'>
          <PointCloudFilter type={'tail_place_move_vehicle'}></PointCloudFilter>
          {renderList?.map((item: any) => {
            return (
              <div key={item.key}>
                <Title>{item.title}</Title>
                {item.children?.map((child: any) => {
                  return (
                    <TextChangeRow
                      key={child.key}
                      title={child.label}
                      value={updateHashMap?.[child.key]}
                      onChange={(value) => {
                        setUpdateHashMap({ [child.key]: Number(value) });
                      }}
                    >
                      <div className='w-[100px] text-right'>{updateHashMap?.[child.key]}</div>
                    </TextChangeRow>
                  );
                })}
              </div>
            );
          })}
          <LoadingButton fullWidth variant='contained' sx={{ color: 'white', marginBottom: '40px' }} onPress={handleOk}>
            {t('common.save')}
          </LoadingButton>
        </div>
        <div className='flex-1'>
          <SidewayIllustration />
        </div>
      </div>
    </>
  );
};

export default memo(Sideway);
