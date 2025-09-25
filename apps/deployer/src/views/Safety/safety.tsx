import { useRequest } from 'ahooks';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import SafetyBase from './component/3dComponents/safetyBase';
import SafetyCanvas from './component/3dComponents/safetyCanvas';
import SafetyObsLines from './component/3dComponents/safetyObsLines';
import SafetyPointCloud from './component/3dComponents/safetyPointCloud';
import SafetyVehicle from './component/3dComponents/safetyVehicle';
import WsContainer from './component/WsContainer';
import { getDeviceList, safetyConfig } from './service/index';
import { useSafetyStore } from './store/safety.store';
import { generateRectanglePoints } from './utils/index';
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
  const { data: config } = useRequest(safetyConfig);
  const { obsInfo, setSensorPointsKey, clearSensorPoints } = useSafetyStore(
    useShallow((store) => ({
      setSensorPointsKey: store.setSensorPointsKey,
      clearSensorPoints: store.clearSensorPoints,
      obsInfo: store.obsInfo,
    })),
  );
  const { data: deviceList = [] } = useRequest(getDeviceList);
  const [wsContainerVisible, setWsContainerVisible] = useState(false);

  useEffect(() => {
    clearSensorPoints();
    setSensorPointsKey([]);
    const url = new URL(window.location.href);
    url.hash.indexOf('safetyPointsCloud') > 0 && setWsContainerVisible(true);
  }, []);

  useEffect(() => {
    if (
      !obsInfo?.scheme_id ||
      !config?.data ||
      !config?.data?.obs_scheme ||
      !config?.data?.obs_scheme?.scheme_list ||
      !config?.data?.strategy_list ||
      !deviceList?.data
    )
      return;
    // 激活的传感器和策略所需要的雷达列表
    let sensorList: any = [];
    const scheme_list = config?.data?.obs_scheme?.scheme_list;
    const strategy = config?.data?.strategy_list;
    const scheme = scheme_list.find((item) => item.scheme_id === obsInfo.scheme_id);
    if (scheme?.pc_sensor_list?.length) {
      sensorList = [...sensorList, ...scheme?.pc_sensor_list];
    }
    Object.keys(strategy)?.map((item) => {
      const pc_sensor_list = strategy?.[item]?.associated_pc_sensor_list;
      const sensor_list = strategy?.[item]?.associated_sensor_list;
      pc_sensor_list?.length && (sensorList = [...sensorList, ...pc_sensor_list]);
      sensor_list?.length && (sensorList = [...sensorList, ...sensor_list]);
    });
    const list = deviceList?.data
      ?.filter((item) => sensorList.includes(item.name))
      ?.map((item, index) => item.topic || index);
    setSensorPointsKey(list);
  }, [obsInfo, config, deviceList]);

  const vehicleOutline = useMemo(() => {
    if (
      !config?.data ||
      !config?.data?.vehicle_outline?.rectangle_list ||
      !config?.data?.vehicle_outline?.rectangle_list.length
    ) {
      return [];
    }
    return config?.data?.vehicle_outline?.rectangle_list;
  }, [config]);

  const forksUnderOutline = useMemo(() => {
    if (!config?.data || !config?.data?.strategy_list || !config?.data?.strategy_list?.strategy_under_fork_protection) {
      return {};
    }
    console.log('forksUnderOutline是否在变');
    return config?.data?.strategy_list?.strategy_under_fork_protection;
  }, [config]);

  const activeScheme: any = useMemo(() => {
    if (
      obsInfo?.scheme_id === undefined ||
      !config?.data ||
      !config?.data?.obs_scheme ||
      !config?.data?.obs_scheme?.scheme_list ||
      !config?.data?.obs_scheme?.scheme_list?.length
    ) {
      return [];
    }
    const obj = config?.data?.obs_scheme?.scheme_list.find((item: any) => item.scheme_id === obsInfo?.scheme_id);
    return {
      project_area: obj?.protect_areas || [],
      project_distance: [obj?.backward_stop_distance || 0, obj?.forward_stop_distance || 0],
    };
  }, [obsInfo, config]);

  const projectArea = useMemo(() => {
    const vehicle = vehicleOutline.find((item) => item.name === 'head');
    const forks = vehicleOutline.find((item) => item.name === 'forkarm');

    const vehiclePoints = generateRectanglePoints(vehicle?.rectangle);
    const forksPoints = generateRectanglePoints(forks?.rectangle);
    const distance = activeScheme.project_distance || [0, 0];
    const [[], [rightVehicleXPoint, rightVehicleYPoint]] = [vehiclePoints[1], vehiclePoints[2]];
    const [[], [rightForksXPoint, rightForksYPoint]] = [forksPoints[0], forksPoints[3]];
    const rectangles = {
      front: [
        ...vehiclePoints[1]?.map((item) => item * 1000),
        ...[rightVehicleXPoint * 1000 + distance[0], rightVehicleYPoint * 1000],
      ],
      back: [
        ...forksPoints[0]?.map((item) => item * 1000),
        ...[rightForksXPoint * 1000 - distance[1], rightForksYPoint * 1000],
      ],
    };
    return [
      { rectangle: rectangles.front, color: 'green' },
      { rectangle: rectangles.back, color: 'green' },
      ...(activeScheme?.project_area || []),
    ];
  }, [vehicleOutline, activeScheme]);

  return (
    <>
      <SafetyCanvas>
        <SafetyBase></SafetyBase>
        <SafetyVehicle
          vehicleRect={vehicleOutline}
          forksUnderRect={forksUnderOutline}
          distance={activeScheme.project_distance}
        ></SafetyVehicle>
        <SafetyObsLines lines={projectArea || []}></SafetyObsLines>
        <SafetyPointCloud
          projectArea={projectArea}
          forksUnderRect={forksUnderOutline}
          vehicleRect={vehicleOutline}
        ></SafetyPointCloud>
      </SafetyCanvas>
      {wsContainerVisible && (
        <WsContainer>
          <></>
        </WsContainer>
      )}
    </>
  );
};
export default Safety;
