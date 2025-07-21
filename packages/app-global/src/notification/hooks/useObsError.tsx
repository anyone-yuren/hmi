import { useTranslation } from 'react-i18next';

const useObsError = () => {
  const { t } = useTranslation();
  const MotionStates = {
    0: t('安全控制器未启动'),
    1: t('避障未触发'),
    2: t('前方有障碍物'),
    3: t('左前方有障碍物'),
    4: t('右前方有障碍物'),
    5: t('尖部光电触发'),
    6: t('根部光电触发'),
    7: t('叉臂底部光电触发'),
    8: t('叉臂雷达触发'),
    9: t('系统错误触发'),
    10: t('左避障雷达停止区触发'),
    11: t('右避障雷达停止区触发'),
    12: t('前避障雷达停止区触发'),
    13: t('顶部避障雷达停止区触发'),
    14: t('后避障雷达停止区触发'),
    15: t('后方有障碍物'),
    16: t('安全触边触发'),
    17: t('远程急停触发'),
    18: t('停车保护区域触发'),
    19: t('自旋方向有障碍物'),
  };

  const getObsMsg = (num: number) => {
    return MotionStates[num];
  };
  return {
    getObsMsg,
  };
};

export default useObsError;
