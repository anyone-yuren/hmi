/**
 * 行走参数
 */

import { EditOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Empty, Input, Skeleton, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getBasicControlParam, postBasicControlParam } from '../service';

const TravelParameters = () => {
  const {
    run,
    loading,
    data: serviceControlParam,
  } = useRequest(getBasicControlParam, {
    manual: true,
  });

  const { run: postRun } = useRequest(postBasicControlParam, {
    manual: true,
  });
  const { t } = useTranslation();

  // 不同舵轮的参数
  const basicControlParam = {
    single: {
      speed_rotation_max: t('deployer.setting.speed_rotation_max'),
      speed_turning_min: t('deployer.setting.speed_turning_min'),
      diffx_correction_forward: t('deployer.setting.diffx_correction_forward'),
      diffx_correction_backward: t('deployer.setting.diffx_correction_backward'),
      speed_forward_straight_max: t('deployer.setting.speed_forward_straight_max'),
      speed_backward_straight_max: t('deployer.setting.speed_backward_straight_max'),
      speed_forward_turning_max: t('deployer.setting.speed_forward_turning_max'),
      speed_backward_turning_max: t('deployer.setting.speed_backward_turning_max'),
    },
    double: {
      speed_omega_rotation: t('deployer.setting.speed_omega_rotation'),
      speed_forward_straight_max: t('deployer.setting.speed_forward_straight_max'),
      speed_backward_straight_max: t('deployer.setting.speed_backward_straight_max'),
      speed_forward_turning_max: t('deployer.setting.speed_forward_turning_max'),
      speed_backward_turning_max: t('deployer.setting.speed_backward_turning_max'),
    },
  };

  const renderTitle = useMemo(() => {
    if (!serviceControlParam) {
      return '';
    }
    const { type } = serviceControlParam;
    switch (type) {
      case 1:
        return '行走参数（单舵）';
      case 2:
        return '行走参数（双舵）';
      case 3:
        return '行走参数（差分）';
      default:
        return '--';
    }
  }, [serviceControlParam?.type]);
  const renderParams = useMemo(() => {
    if (!serviceControlParam) {
      return <Empty />;
    }
    const { type } = serviceControlParam;
    const renderControlParam = type === 1 ? basicControlParam['single'] : basicControlParam['double'];
    return Object.keys(renderControlParam).map((item) => {
      return (
        <div className='flex flex-col p-2 bg-[#d8d8d833] rounded-md'>
          <div className='text-lg opacity-50'>{renderControlParam[item]}</div>
          <div className='flex flex-row'>
            <Input
              defaultValue={serviceControlParam[item]}
              variant='borderless'
              className='text-lg font-bold !px-0'
              suffix={<EditOutlined style={{ fontSize: 20 }} />}
              onBlur={(e) => {
                if (!/^-?\d+$/.test(e.target.value)) {
                  toast.error('请输入正确的数字');
                  return;
                }
                const sendValue = Number(e.target.value);
                if (sendValue === serviceControlParam[item]) {
                  return;
                }
                postRun({
                  [item]: sendValue,
                });
              }}
            />
          </div>
        </div>
      );
    });
  }, [basicControlParam, serviceControlParam]);
  useEffect(() => {
    run();
  }, []);
  return (
    <div className='flex-1 overflow-auto'>
      <Typography.Title className='text-center' level={3}>
        {renderTitle}
      </Typography.Title>
      {loading && <Skeleton active></Skeleton>}
      {serviceControlParam ? <div className='flex gap-2 flex-col'>{renderParams}</div> : !loading && <Empty />}
    </div>
  );
};

export default TravelParameters;
