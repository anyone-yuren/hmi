import {
  getTailTruckRead,
  postTailTruckSave,
  getTailTruckScenariosPlaceSpaceDetectRead as read,
  postTailTruckScenariosPlaceSpaceDetectSave as save,
} from '@/views/Vision/services/index';
import { ListItemText, MenuItem } from '@mui/material';
import { useAsyncEffect, useRequest, useSetState } from 'ahooks';
import { memo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import CustomSelect from '../../comp/customSelect';
import LoadingButton from '../../comp/loadingButton';
import PointCloudFilter from '../../comp/pointCloudFilter';
import TextChangeRow from '../../comp/textChangeRow';
import TextUpdateRow from '../../comp/textUpdateRow';
import Title from '../../comp/title';
import SpaceIllustration from './spaceIllustration';
// 传感器的接口要重新调用
const Space = () => {
  const { t } = useTranslation();
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    offset_y_left: 0,
    offset_y_right: 0,
  });
  const [sensorHashMap, setSensorHashMap] = useSetState<any>({
    __isSubmit: false,
    left_place_gap_detect: '',
    right_place_gap_detect: '',
    sensor_model_list: [],
  });
  const renderList = [
    {
      title: t('deployer.vision.leftCompensation'),
      key: 'left',
      children: [
        {
          label: t('deployer.vision.truckForkSidewayCompensation'),
          key: 'offset_y_left',
          type: 'number',
        },
        {
          label: t('deployer.vision.sensorBind'),
          key: 'left_place_gap_detect',
          type: 'sensor',
        },
        {
          label: t('deployer.vision.pointsCloud'),
          key: 'tail_left_place_gap_detect',
          type: 'pointsCloud',
        },
      ],
    },
    {
      title: t('deployer.vision.rightCompensation'),
      key: 'right',
      children: [
        {
          label: t('deployer.vision.truckForkSidewayCompensation'),
          key: 'offset_y_right',
          type: 'number',
        },
        {
          label: t('deployer.vision.sensorBind'),
          key: 'right_place_gap_detect',
          type: 'sensor',
        },
        {
          label: t('deployer.vision.pointsCloud'),
          key: 'tail_right_place_gap_detect',
          type: 'pointsCloud',
        },
      ],
    },
  ];

  const { data: spaceResponse } = useRequest(read, {});
  const { data: truckLoad } = useRequest(() => getTailTruckRead({}), {});

  useEffect(() => {
    const params: any = { ...(spaceResponse?.data || {}) };
    const obj = { ...updateHashMap };
    if (!params['offset_y']) return;
    obj['offset_y_left'] = params['offset_y']?.value?.[0];
    obj['offset_y_right'] = params['offset_y']?.value?.[1];
    setUpdateHashMap(obj);
  }, [spaceResponse]);

  useAsyncEffect(async () => {
    if (!sensorHashMap.__isSubmit) {
      return;
    }
    const params: any = JSON.parse(JSON.stringify(truckLoad?.data));
    for (let key in sensorHashMap) {
      if (params.select_model[key]) {
        params.select_model[key].value = sensorHashMap[key];
      }
    }
    await postTailTruckSave(params);
    toast.success(t('common.actionSuccess'));
  }, [sensorHashMap, postTailTruckSave]);

  useEffect(() => {
    const data = truckLoad?.data;
    setSensorHashMap({
      left_place_gap_detect: data?.select_model?.left_place_gap_detect?.value,
      right_place_gap_detect: data?.select_model?.right_place_gap_detect?.value,
      sensor_model_list: data?.sensor_model_list?.value,
    });
  }, [truckLoad]);

  const validateInitParams = (params: any) => {
    const paramsKeys = ['offset_y'];
    const missKeys: any = [];
    paramsKeys.map((key: string) => {
      if (params?.[key]?.value === undefined) {
        missKeys.push(key);
      }
    });
    return missKeys;
  };

  const handleOk = async () => {
    const params = { ...(spaceResponse?.data || {}) };
    const missKeys = validateInitParams(params);
    if (missKeys.length) {
      toast.error(t('deployer.vision.missParamsTips') + missKeys.join(','));
      return;
    }
    params.offset_y.value = [updateHashMap.offset_y_left, updateHashMap.offset_y_right];
    await save(params);
    toast.success(t('common.actionSuccess'));
  };

  const componentsHashMap: any = {
    number: (child: any) => {
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
    },
    pointsCloud: (child: any) => {
      return <PointCloudFilter type={child.key}></PointCloudFilter>;
    },
    sensor: (child: any) => {
      return (
        <TextUpdateRow>
          <div>{child.label}</div>
          <div className='relative'>
            <CustomSelect
              variant='standard'
              value={sensorHashMap[child.key]}
              onChange={(value) => {
                setSensorHashMap({
                  __isSubmit: true,
                  [child.key]: value.target.value,
                });
              }}
            >
              {sensorHashMap?.sensor_model_list?.map((name: string) => (
                <MenuItem key={name} value={name}>
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </CustomSelect>
          </div>
        </TextUpdateRow>
      );
    },
  };

  return (
    <>
      <div className='flex w-full text-black gap-[20px]'>
        <div className='w-[350px]'>
          {renderList?.map((item: any) => {
            return (
              <div key={item.key}>
                <Title>{item.title}</Title>
                {item.children?.map((child: any) => {
                  return componentsHashMap[child.type] && componentsHashMap[child.type](child);
                })}
              </div>
            );
          })}
          <LoadingButton fullWidth variant='contained' sx={{ color: 'white', marginBlock: '40px' }} onPress={handleOk}>
            {t('common.save')}
          </LoadingButton>
        </div>
        <div className='flex-1'>
          <SpaceIllustration />
        </div>
      </div>
    </>
  );
};

export default memo(Space);
