const useActiveDevice = (activeDevices: number[] = []) => {
  const activeDevice = [
    { value: 1, label: '叉臂' },
    { value: 2, label: '顶部雷达升降杆' },
    { value: 3, label: '自身' },
    { value: 4, label: '摇头机构' },
  ];
  return activeDevice.filter((item) => activeDevices.includes(item.value));
};

export const useStrategyListName = () => {
  return {
    strategy_line_keep: '直线保持',
    strategy_under_fork_protection: '叉臂下方保护',
    strategy_place_cargo_space_protection: '放货空间检测',
    strategy_pick_cargo_fork_tip_protection: '取货叉尖保护',
    strategy_end_path_adaptive_reduce_range: '末端路线自适应调整避障',
    strategy_top_protection: '顶部安全防护',
    strategy_door_frame_move_protection: '移动门架保护',
    strategy_end_path_close_protection: '末端路线屏蔽叉尖避障',
    strategy_amr_load_protection: 'AMR负载防护',
  };
};
export default useActiveDevice;
