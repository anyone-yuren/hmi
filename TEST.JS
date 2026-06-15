const FALLBACK_MOCK_DATA = [
  {
    event: "global_state_update",
    timestamp: dayjs().unix() * 1000,
    current_action_index: 0,
    task: {
      task_id: 9527,
      task_type: 1,
      task_state: 1,
      task_point_id: 12,
      pallet_name: "重载货架_C_02",
    },
    actions: [
      {
        action_id: "act_1",
        title: "环境三维立体空间扫描",
        intent: "获取并建模叉车前向空间的点云结构，确定目标几何质心",
        thought_process: [
          {
            step_id: 1,
            status: "done",
            text: "已激活前置激光雷达阵列，开始向空间投射红外脉冲...",
          },
          {
            step_id: 2,
            status: "active",
            text: "多模态大模型(VLA)正在建立局部占用网格 (Occupancy Grid)...",
          },
        ],
        telemetry: { X轴: 15.42, Y轴: -0.22, Z轴: 5.11, "偏航角 (Yaw)": 1.22 },
      },
    ],
  },
  {
    event: "global_state_update",
    timestamp: dayjs().unix() * 1000 + 1000,
    current_action_index: 0,
    task: {
      task_id: 9527,
      task_type: 1,
      task_state: 1,
      task_point_id: 12,
      pallet_name: "重载货架_C_02",
    },
    actions: [
      {
        action_id: "act_1",
        title: "环境三维立体空间扫描",
        intent: "获取并建模叉车前向空间的点云结构，确定目标几何质心",
        thought_process: [
          {
            step_id: 1,
            status: "done",
            text: "已激活前置激光雷达阵列，开始向空间投射红外脉冲...",
          },
          {
            step_id: 2,
            status: "done",
            text: "局部占用网格建立完毕，边缘障碍物碰撞体积分析安全 clear。",
          },
        ],
        telemetry: { X轴: 15.42, Y轴: -0.22, Z轴: 5.11, "偏航角 (Yaw)": 1.22 },
      },
      {
        action_id: "act_2",
        title: "锁定托盘孔位 6DoF 姿态",
        intent: "通过视觉对齐网络，精确求解进叉孔中心三维坐标及偏航倾角",
        thought_process: [],
        telemetry: { X轴: 0, Y轴: 0, Z轴: 0, "偏航角 (Yaw)": 0 },
      },
    ],
  },
  {
    event: "global_state_update",
    timestamp: dayjs().unix() * 1000 + 2000,
    current_action_index: 1,
    task: {
      task_id: 9527,
      task_type: 1,
      task_state: 1,
      task_point_id: 12,
      pallet_name: "重载货架_C_02",
    },
    actions: [
      {
        action_id: "act_1",
        title: "环境三维立体空间扫描",
        thought_process: [
          { step_id: 1, status: "done", text: "..." },
          { step_id: 2, status: "done", text: "..." },
        ],
        telemetry: { X轴: 15.42, Y轴: -0.22, Z轴: 5.11, "偏航角 (Yaw)": 1.22 },
      },
      {
        action_id: "act_2",
        title: "锁定托盘孔位 6DoF 姿态",
        intent: "通过视觉对齐网络，精确求解进叉孔中心三维坐标及偏航倾角",
        thought_process: [
          {
            step_id: 3,
            status: "done",
            text: "深度边缘分割网络处理完毕，捕捉到高置信度左右叉孔几何边缘。",
          },
          {
            step_id: 4,
            status: "active",
            text: "正在将姿态参数推入运动控制缓冲区，解算多轴联动插补轨迹...",
          },
        ],
        telemetry: { X轴: 12.05, Y轴: -0.01, Z轴: 2.34, "偏航角 (Yaw)": 1.24 },
      },
      {
        action_id: "act_3",
        title: "叉臂高精度多轴插补推进",
        intent: "联动车身底盘与液压门架，启动物理层闭环控制，直至完全进叉",
        thought_process: [],
        telemetry: { X轴: 0, Y轴: 0, Z轴: 0, "偏航角 (Yaw)": 0 },
      },
    ],
  },
  {
    event: "global_state_update",
    timestamp: dayjs().unix() * 1000 + 3000,
    current_action_index: 2,
    task: {
      task_id: 9527,
      task_type: 1,
      task_state: 1,
      task_point_id: 12,
      pallet_name: "重载货架_C_02",
    },
    actions: [
      {
        action_id: "act_1",
        title: "环境三维立体空间扫描",
        thought_process: [
          { step_id: 1, status: "done", text: "..." },
          { step_id: 2, status: "done", text: "..." },
        ],
        telemetry: { X轴: 15.42, Y轴: -0.22, Z轴: 5.11, "偏航角 (Yaw)": 1.22 },
      },
      {
        action_id: "act_2",
        title: "锁定托盘孔位 6DoF 姿态",
        thought_process: [
          { step_id: 3, status: "done", text: "..." },
          { step_id: 4, status: "done", text: "..." },
        ],
        telemetry: { X轴: 12.05, Y轴: -0.01, Z轴: 2.34, "偏航角 (Yaw)": 1.24 },
      },
      {
        action_id: "act_3",
        title: "叉臂高精度多轴插补推进",
        intent: "联动车身底盘与液压门架，启动物理层闭环控制，直至完全进叉",
        thought_process: [
          {
            step_id: 5,
            status: "done",
            text: "100Hz 物理总线驱动轮式底盘微动前行，当前行进距离偏差 4.5mm",
          },
          {
            step_id: 6,
            status: "active",
            text: "液压随动比例阀平稳输出，叉爪正在完全切入托盘底部受力面...",
          },
        ],
        telemetry: { X轴: 2.11, Y轴: 0.0, Z轴: 0.12, "偏航角 (Yaw)": 0.01 },
      },
      {
        action_id: "act_4",
        title: "货物载荷起升与平衡判定",
        intent: "执行闭环起升，通过压力传感器监测载荷质心，保障叉运安全",
        thought_process: [],
        telemetry: { X轴: 0, Y轴: 0, Z轴: 0, "偏航角 (Yaw)": 0 },
      },
    ],
  },
];
