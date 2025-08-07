import {
  getTailTruckScenariosPickMoveVehicleRead as read,
  postTailTruckScenariosPickMoveVehicleSave as save,
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
    offset_left: 0,
    offset_right: 0,
    offset_x: 0,
  });
  const { data: sidewayResponse } = useRequest(read, {});
  const renderList = [
    {
      title: t('deployer.vision.leftCompensation'),
      key: 'left',
      children: [
        {
          label: t('deployer.vision.truckPickForkMovePoseDetect'),
          key: 'offset_left',
        },
      ],
    },
    {
      title: t('deployer.vision.rightCompensation'),
      key: 'right',
      children: [
        {
          label: t('deployer.vision.truckPickForkMovePoseDetect'),
          key: 'offset_right',
        },
      ],
    },
    {
      title: t('deployer.vision.compensationParams'),
      key: 'font',
      children: [
        {
          label: t('deployer.vision.pickAroundCompensation'),
          key: 'offset_x',
        },
      ],
    },
  ];

  useEffect(() => {
    const params: any = { ...(sidewayResponse?.data || {}) };
    const obj = { ...updateHashMap };
    const ary = Object.keys(params);
    if (!ary.length) return;
    ary?.map((key: string) => {
      obj[key] = params[key].value;
    });
    obj['offset_left'] = params['offset_y'].value[0];
    obj['offset_right'] = params['offset_y'].value[1];
    setUpdateHashMap(obj);
  }, [sidewayResponse]);
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
    const params = { ...(sidewayResponse?.data || {}) };
    const missKeys = validateInitParams(params);
    if (missKeys.length) {
      toast.error(t('deployer.vision.missParamsTips') + missKeys.join(','));
      return;
    }
    Object.keys(params)?.map((key: string) => {
      params[key].value = updateHashMap[key];
    });
    params.offset_y.value = [updateHashMap.offset_left, updateHashMap.offset_right];
    await save(params);
    toast.success(t('common.actionSuccess'));
  };
  return (
    <>
      <div className='flex w-full text-black gap-[30px]'>
        <div className='w-[350px]'>
          <PointCloudFilter type={'tail_pick_move_vehicle'}></PointCloudFilter>
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
