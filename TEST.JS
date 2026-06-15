const config = {
  "event": "global_state_update",
  "timestamp": 1718171135200,      // 毫秒级全局时序戳
  "task": {
    "task_id": 8842,
    "task_type": 1,               // 1: 智能取货, 2: 精准放货
    "task_state": 1,              // 0: 待命, 1: 执行中, 2: 成功, 3: 取消, 4: 异常
    "task_point_id": 12,
    "pallet_name": "标准托盘_A_04"
  },
  "current_action_index": 0,       // 当前正在执行/激活的动作索引（对应左侧高亮）
  "actions": [                    // 完整的动作队列列表（左侧队列 + 右下大脑数据源）
    {
      "action_id": "act_1",
      "timestamp": 1718171105,
      "action_type": "vision",    // vision: 感知层, forkarm: 控制层
      "title": "环境语义与空间遮挡分析",
      "intent": "感知当前点位障碍物，检索目标托盘三维位姿",
      "status": "active",         // pending, active, done, failed
      "thought_process": [         // 多模态大脑当前动作下的完整推理步骤
        { "status": "done", "text": "正在调取前置 3D 激光雷达与 RGB-D 相机感知数据..." },
        { "status": "done", "text": "发现目标托盘，置信度 98.4%，表面存在 3° 倾角夹角" },
        { "status": "active", "text": "计算多模态对齐网络 (VLM) ... 正在输出 6DoF 抓取位姿姿态" }
      ],
      "telemetry": {              // 右上角横排 4 维度的实时遥测数据
        "X轴": 12.42,
        "Y轴": -0.41,
        "Z轴": 8.25,
        "偏航角 (Yaw)": 3.14
      }
    },
    {
      "action_id": "act_2",
      "timestamp": 1718171125,
      "action_type": "forkarm",
      "title": "端到端控制：叉臂精确多轴补偿",
      "intent": "动态控制叉臂执行机构，完成进叉闭环",
      "status": "pending",
      "thought_process": [
        { "status": "pending", "text": "等待视觉 6DoF 位姿参数锁定..." },
        { "status": "pending", "text": "控制闭环：下发底层机械臂前移与横移指令 (100Hz 动态补偿)" }
      ],
      "telemetry": {
        "X轴": 1050,
        "Y轴": 12,
        "Z轴": 450,
        "横滚角 (Roll)": 0.2
      }
    }
  ]
}