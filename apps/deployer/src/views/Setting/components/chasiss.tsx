/**
 * 行走参数
 */

import { EditOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Empty, Input, Skeleton, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { getActionControlParam, postActionControlParam } from '../service';

const ChassisParameters = () => {
  const {
    run,
    loading,
    data: serviceControlParam,
  } = useRequest(getActionControlParam, {
    manual: true,
  });

  const { run: postRun } = useRequest(postActionControlParam, {
    manual: true,
    // onSuccess: () => {
    //   run();
    // },
  });
  const { t } = useTranslation();

  // 不同舵轮的参数
  const basicControlParam = {
    lift_fork_vel_max: t('deployer.setting.lift_fork_vel_max'),
    lift_fork_vel_max_rev: t('deployer.setting.lift_fork_vel_max_rev'),
    lift_fork_vel_min: t('deployer.setting.lift_fork_vel_min'),
    lift_fork_vel_min_rev: t('deployer.setting.lift_fork_vel_min_rev'),
  };

  const renderTitle = useMemo(() => {
    if (!serviceControlParam) {
      return '';
    }
    const { type } = serviceControlParam;
    const splitName = '底盘参数 - ';
    switch (type) {
      case 1:
        return splitName + '堆高车';
      case 2:
        return splitName + '托盘车';
      case 3:
        return splitName + '前移式';
      case 4:
        return splitName + '顶升';
      case 5:
        return splitName + '滚筒';
      case 6:
        return splitName + '侧插';
      case 7:
        return splitName + '夹抱';
      case 8:
        return splitName + '复合式机器人';
      case 9:
        return splitName + '平衡重';
      case 10:
        return splitName + '劢微新形态';
      case 11:
        return splitName + '伸缩叉';
      case 12:
        return splitName + '旋转顶升';
      case 13:
        return splitName + '三向叉';
      case 14:
        return splitName + '全向车前移';
      default:
        return '--';
    }
  }, [serviceControlParam?.type]);
  const renderParams = useMemo(() => {
    if (!serviceControlParam) {
      return <Empty />;
    }
    const { type } = serviceControlParam;
    const renderControlParam = basicControlParam;
    return Object.keys(renderControlParam).map((item) => {
      return (
        <div className='flex flex-col p-2 bg-[#d8d8d833] rounded-md'>
          <div className='text-lg opacity-50'>{renderControlParam[item]}</div>
          <div className='flex flex-row'>
            <Input
              variant='borderless'
              defaultValue={serviceControlParam[item]}
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

export default ChassisParameters;
