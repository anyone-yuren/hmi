import {
  getTailTruckScenariosVehicleForwardRead as read,
  postTailTruckScenariosVehicleForwardSave as save,
} from '@/views/Vision/services/index';
import { useRequest, useSetState } from 'ahooks';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import LoadingButton from '../../comp/loadingButton';
import PointCloudFilter from '../../comp/pointCloudFilter';
import TextChangeRow from '../../comp/textChangeRow';
import Title from '../../comp/title';
import Illustration from './illustration';

const Leave = () => {
  const { t } = useTranslation();
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    offset_y_left: 0,
    offset_y_right: 0,
    offset_x: 0,
    normal_dist: 0,
  });
  const { data: leaveResponse } = useRequest(read, {});
  const renderList = [
    {
      title: t('deployer.vision.leftCompensation'),
      key: 'left',
      children: [
        {
          label: t('deployer.vision.backTruckSideCompensation'),
          key: 'offset_y_left',
        },
      ],
    },
    {
      title: t('deployer.vision.rightCompensation'),
      key: 'right',
      children: [
        {
          label: t('deployer.vision.backTruckSideCompensation'),
          key: 'offset_y_right',
        },
      ],
    },
    {
      title: t('deployer.vision.compensationParams'),
      key: 'font',
      children: [
        {
          label: t('deployer.vision.backTruckAroundCompensation'),
          key: 'offset_x',
        },
      ],
    },
  ];
  useEffect(() => {
    const params: any = { ...(leaveResponse?.data || {}) };
    const obj = { ...updateHashMap };
    const ary = Object.keys(params);
    if (!ary.length) return;
    ary?.map((key: string) => {
      obj[key] = params[key].value;
    });
    obj['offset_y_left'] = params['offset_y']?.value?.[0];
    obj['offset_y_right'] = params['offset_y']?.value?.[1];
    setUpdateHashMap(obj);
  }, [leaveResponse]);
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
    const params = { ...(leaveResponse?.data || {}) };
    const missKeys = validateInitParams(params);
    if (missKeys.length) {
      toast.error(t('deployer.vision.missParamsTips') + missKeys.join(','));
      return;
    }
    Object.keys(params)?.map((key: string) => {
      params[key].value = updateHashMap[key];
    });
    params.offset_y.value = [updateHashMap.offset_y_left, updateHashMap.offset_y_right];
    await save(params);
    toast.success(t('common.actionSuccess'));
  };
  return (
    <>
      <div className='flex w-full text-black gap-[30px]'>
        <div className='w-[350px]'>
          <PointCloudFilter type={'tail_vehicle_forward'}></PointCloudFilter>
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
          <Illustration />
        </div>
      </div>
    </>
  );
};

export default memo(Leave);
