import { useWebSocket } from "ahooks";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

// 动态获取车端当前宿主 Host
const currentHost = window.location.hostname;
// 使用端口 10009 或对应反向代理，订阅 VLA 自主核总线
const VLA_WS_URL = import.meta.env.DEV
  ? "/ws10009" // 开发环境走代理
  : `ws://${currentHost}:10009`; // 生产环境直连

// ========== 静态备用降级 Mock 数据源（与全量协议一致） ==========
const FALLBACK_MOCK_DATA = [
  {
    event: "global_state_update",
    timestamp: dayjs().unix() * 1000,
    current_action_index: 0,
    task: {
      task_id: 8842,
      task_type: 1,
      task_state: 1,
      task_point_id: 12,
      pallet_name: "标准托盘_A_04",
    },
    actions: [
      {
        action_id: "act_1",
        action_type: "vision",
        title: "环境语义与空间遮挡分析",
        intent: "感知当前点位障碍物，检索目标托盘三维位姿",
        thought_process: [
          {
            step_id: 1,
            status: "done",
            text: "正在调取前置 3D 激光雷达与 RGB-D 相机感知数据...",
          },
          {
            step_id: 2,
            status: "done",
            text: "发现目标托盘，置信度 98.4%，表面存在 3° 倾角夹角",
          },
        ],
        telemetry: { X轴: 12.42, Y轴: -0.41, Z轴: 8.25, "偏航角 (Yaw)": 3.14 },
      },
      {
        action_id: "act_2",
        action_type: "forkarm",
        title: "端到端控制：叉臂精确多轴补偿",
        intent: "动态控制叉臂执行机构，完成进叉闭环",
        thought_process: [],
        telemetry: { X轴: 0, Y轴: 0, Z轴: 0, "横滚角 (Roll)": 0.0 },
      },
    ],
  },
  {
    event: "global_state_update",
    timestamp: dayjs().unix() * 1000 + 500,
    current_action_index: 0,
    task: {
      task_id: 8842,
      task_type: 1,
      task_state: 1,
      task_point_id: 12,
      pallet_name: "标准托盘_A_04",
    },
    actions: [
      {
        action_id: "act_1",
        action_type: "vision",
        title: "环境语义与空间遮挡分析",
        intent: "感知当前点位障碍物，检索目标托盘三维位姿",
        thought_process: [
          {
            step_id: 1,
            status: "done",
            text: "正在调取前置 3D 激光雷达与 RGB-D 相机感知数据...",
          },
          {
            step_id: 2,
            status: "done",
            text: "发现目标托盘，置信度 98.4%，表面存在 3° 倾角夹角",
          },
          {
            step_id: 3,
            status: "active",
            text: "计算多模态对齐网络 (VLM) ... 正在输出 6DoF 抓取位姿姿态",
          },
        ],
        telemetry: { X轴: 12.46, Y轴: -0.4, Z轴: 8.24, "偏航角 (Yaw)": 3.14 },
      },
      {
        action_id: "act_2",
        action_type: "forkarm",
        title: "端到端控制：叉臂精确多轴补偿",
        intent: "动态控制叉臂执行机构，完成进叉闭环",
        thought_process: [],
        telemetry: { X轴: 0, Y轴: 0, Z轴: 0, "横滚角 (Roll)": 0.0 },
      },
    ],
  },
  {
    event: "global_state_update",
    timestamp: dayjs().unix() * 1000 + 1000,
    current_action_index: 1,
    task: {
      task_id: 8842,
      task_type: 1,
      task_state: 1,
      task_point_id: 12,
      pallet_name: "标准托盘_A_04",
    },
    actions: [
      {
        action_id: "act_1",
        action_type: "vision",
        title: "环境语义与空间遮挡分析",
        intent: "感知当前点位障碍物，检索目标托盘三维位姿",
        thought_process: [
          {
            step_id: 1,
            status: "done",
            text: "正在调取前置 3D 激光雷达与 RGB-D 相机感知数据...",
          },
          {
            step_id: 2,
            status: "done",
            text: "发现目标托盘，置信度 98.4%，表面存在 3° 倾角夹角",
          },
          {
            step_id: 3,
            status: "done",
            text: "计算多模态对齐网络 (VLM) ... 6DoF 参数已锁定",
          },
        ],
        telemetry: { X轴: 12.46, Y轴: -0.4, Z轴: 8.24, "偏航角 (Yaw)": 3.14 },
      },
      {
        action_id: "act_2",
        action_type: "forkarm",
        title: "端到端控制：叉臂精确多轴补偿",
        intent: "动态控制叉臂执行机构，完成进叉闭环",
        thought_process: [
          {
            step_id: 4,
            status: "active",
            text: "控制指令下发成功，100Hz 物理总线驱动叉臂多轴精准动态补偿",
          },
        ],
        telemetry: {
          X轴: 1050.4,
          Y轴: 12.1,
          Z轴: 450.8,
          "横滚角 (Roll)": 0.22,
        },
      },
    ],
  },
];

export const useVlaWebSocket = () => {
  const [vlaData, setVlaData] = useState<any>(null);
  const [isUsingMock, setIsUsingMock] = useState<boolean>(false);
  const mockTimerRef = useRef<any>(null);
  const mockIndexRef = useRef<number>(0);

  // 初始化 ahooks WebSocket 客户端
  const { sendMessage, readyState } = useWebSocket(VLA_WS_URL, {
    reconnectLimit: Infinity, // 车机长连接采用无限重连机制
    reconnectInterval: 5000, // 重连探测窗口 5秒
    onMessage: (e) => {
      // 过滤协议握手响应
      if (e?.data?.includes("subscribe")) return;

      // 精准拦截核心自选 VLA 主流通道包
      if (e?.data?.includes("/sirius/topics/vla")) {
        try {
          const rawMessage = JSON.parse(e?.data);
          // 假设标准的发布订阅报文主体包裹在 msg 或 data 字段中，如果返回的就是全量 JSON 则直接赋值
          const payload = rawMessage?.msg || rawMessage;

          if (payload && payload.event === "global_state_update") {
            // 一旦接收到真网数据，立刻掐断并清除 Mock 降级定时器
            clearMockInterval();
            setIsUsingMock(false);
            setVlaData(payload);
          }
        } catch (error) {
          console.error("VLA 全量包 JSON 解析失败:", error);
        }
      }
    },
  });

  // 辅助函数：启动 Mock 本地轮询降级
  const startMockInterval = () => {
    if (mockTimerRef.current) return;
    setIsUsingMock(true);
    // 初次立刻推一次基础帧
    setVlaData({
      ...FALLBACK_MOCK_DATA[mockIndexRef.current],
      timestamp: dayjs().unix() * 1000,
    });

    mockTimerRef.current = setInterval(() => {
      mockIndexRef.current =
        (mockIndexRef.current + 1) % FALLBACK_MOCK_DATA.length;
      setVlaData({
        ...FALLBACK_MOCK_DATA[mockIndexRef.current],
        timestamp: dayjs().unix() * 1000, // 修正毫秒级系统时钟
      });
    }, 4500); // 维持原有的推流步长速度
  };

  // 辅助函数：销毁 Mock 轮询
  const clearMockInterval = () => {
    if (mockTimerRef.current) {
      clearInterval(mockTimerRef.current);
      mockTimerRef.current = null;
    }
  };

  // 监听连接就绪状态，控制订阅上报或无缝降级切换
  useEffect(() => {
    if (readyState === 1) {
      // WebSocket 连接成功，向底盘总线派发 VLA 订阅指令
      sendMessage(
        JSON.stringify({
          uri: "subscribe",
          topics: ["/sirius/topics/vla"],
        }),
      );
    } else {
      // 处于断线、连接中或连接关闭状态，为了保证车载屏幕不挂白，强制切换为静态 Mock 数据兜底
      startMockInterval();
    }

    return () => clearMockInterval();
  }, [readyState, sendMessage]);

  return {
    vlaData,
    isUsingMock, // 可以用于在前台 UI 渲染一个“离线降级”或“模拟数据”的科技警告角标
    readyState,
  };
};
