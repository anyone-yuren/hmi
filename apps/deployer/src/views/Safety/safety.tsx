import { useTranslation } from 'react-i18next';
import SafetyBase from './component/3dComponents/safetyBase';
import SafetyCanvas from './component/3dComponents/safetyCanvas';
import SafetyObsLines from './component/3dComponents/safetyObsLines';
import SafetyPointCloud from './component/3dComponents/safetyPointCloud';
import SafetyVehicle from './component/3dComponents/safetyVehicle';
const mock = {
  rectangle_list: [
    {
      id: 1,
      name: 'head',
      rectangle: [-200, -400, 200, -100], // 车头左上右下坐标
      is_active: false,
      associated_device: 0,
    },
    {
      id: 2,
      name: 'forkarm',
      rectangle: [-170, -100, 170, 400], // 叉臂左上右下坐标
      is_active: true,
      associated_device: 1,
    },
  ],
  // 叉臂高度订阅 /sirius/topics/robot_status_forkarm data?.z , 点云在obsInfo的推送里
  strategy_under_fork_protection: {
    rectangle: [-200, -50, 170, 400],
    min_forkarm_height_to_open_this: 500,
    height_start: 100, // 叉臂离地基础高度
    forkarm_height_cut: 300, // 叉臂上方裁剪高度, 保护区域高度需要叉臂高度减去height_start和forkarm_height_cut
    min_distance_to_task_point_close_this: 1500,
    associated_sensor_list: ['Lidar3d_17'],
  },
  // 避障方案来切换
  scheme_list: [
    {
      id: 1,
      protect_areas: [
        {
          id: 5,
          name: 'fork_arm',
          rectangle: [1000, 1000, 800, 800],
        },
        {
          id: 2,
          name: 'head',
          rectangle: [500, 600, 700, 800],
        },
        {
          id: 3,
          name: 'head',
          rectangle: [-200, -563, 200, -401],
        },
      ],
    },
    {
      id: 2,
      protect_areas: [
        {
          id: 5,
          name: 'fork_arm',
          rectangle: [1, 2, 3, 4],
        },
        {
          id: 2,
          name: 'head',
          rectangle: [5, 6, 7, 8],
        },
      ],
    },
  ],
};

const Safety = () => {
  const { t } = useTranslation();
  return (
    <SafetyCanvas>
      <SafetyBase></SafetyBase>
      <SafetyVehicle
        vehicleRect={mock.rectangle_list}
        forksUnderRect={mock.strategy_under_fork_protection}
      ></SafetyVehicle>
      <SafetyObsLines lines={mock.scheme_list?.[0].protect_areas}></SafetyObsLines>
      <SafetyPointCloud
        projectArea={mock.scheme_list?.[0].protect_areas}
        forksUnderRect={mock.strategy_under_fork_protection}
      ></SafetyPointCloud>
    </SafetyCanvas>
  );
};
export default Safety;
