import { useTranslation } from 'react-i18next';
const useActiveDevice = (activeDevices: number[] = []) => {
  const { t } = useTranslation();
  const activeDevice = [
    { value: 1, label: t('common.forkArm') },
    { value: 2, label: t('common.topRadarLift') },
    { value: 3, label: t('common.self') },
    { value: 4, label: t('common.shakeArm') },
  ];
  return activeDevice.filter((item) => activeDevices.includes(item.value));
};

export const useStrategyListName = () => {
  const { t } = useTranslation();
  return {
    strategy_line_keep: t('common.lineKeep'),
    strategy_under_fork_protection: t('common.underForkProtection'),
    strategy_place_cargo_space_protection: t('common.placeCargoSpaceProtection'),
    strategy_pick_cargo_fork_tip_protection: t('common.pickCargoForkTipProtection'),
    strategy_end_path_adaptive_reduce_range: t('common.endPathAdaptiveReduceRange'),
    strategy_top_protection: t('common.topProtection'),
    strategy_door_frame_move_protection: t('common.doorFrameMoveProtection'),
    strategy_end_path_close_protection: t('common.endPathCloseProtection'),
    strategy_amr_load_protection: t('common.amrLoadProtection'),
  };
};
export default useActiveDevice;
