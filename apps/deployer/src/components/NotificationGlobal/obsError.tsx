import { useTranslation } from 'react-i18next';

const useObsError = () => {
  const { t } = useTranslation();
  const MotionStates = {
    0: t('common.obsError.tip0'),
    1: t('common.obsError.tip1'),
    2: t('common.obsError.tip2'),
    3: t('common.obsError.tip3'),
    4: t('common.obsError.tip4'),
    5: t('common.obsError.tip5'),
    6: t('common.obsError.tip6'),
    7: t('common.obsError.tip7'),
    8: t('common.obsError.tip8'),
    9: t('common.obsError.tip9'),
    10: t('common.obsError.tip10'),
    11: t('common.obsError.tip11'),
    12: t('common.obsError.tip12'),
    13: t('common.obsError.tip13'),
    14: t('common.obsError.tip14'),
    15: t('common.obsError.tip15'),
    16: t('common.obsError.tip16'),
    17: t('common.obsError.tip17'),
    18: t('common.obsError.tip18'),
    19: t('common.obsError.tip19'),
  };

  const getObsMsg = (num: number) => {
    return MotionStates[num];
  };
  return {
    getObsMsg,
  };
};

export default useObsError;
