import { Tag } from "antd";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
// 引入全新编写的车端长连接通信 Hook
import { useVlaWebSocket } from "./hooks/useVlaWebSocket";
// 引入刚刚编写的断线状态组件
import { WsDisconnectedOverlay } from "./components/WsDisconnectedOverlay";

// ==================== 核心面板子组件定义 ====================

function MinimalTaskBar({
  t,
  timestamp,
  isOffline,
}: {
  t: any;
  timestamp: number;
  isOffline: boolean;
}) {
  const TASK_TYPE_MAP: Record<number, { label: string; tag: string }> = {
    1: { label: "智能取货", tag: "cyan" },
    2: { label: "精准放货", tag: "orange" },
  };
  const TASK_STATE_MAP: Record<number, { label: string; tag: string }> = {
    1: { label: "执行中", tag: "processing" },
  };
  const typeInfo = TASK_TYPE_MAP[t?.task_type] ?? {
    label: "未知任务",
    tag: "default",
  };
  const stateInfo = TASK_STATE_MAP[t?.task_state] ?? {
    label: "--",
    tag: "default",
  };

  return (
    <div className="relative flex items-center justify-between border-b border-[#1a3554] bg-gradient-to-r from-[#091522] via-[#0d223a] to-[#091522] px-8 py-5 overflow-hidden shrink-0">
      <div className="flex items-center gap-6">
        <div>
          <span className="text-xs font-bold tracking-[0.25em] text-[#00e5ff] opacity-90 block mb-0.5 animate-pulse">
            VLA 自主决策核心总线
          </span>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-[#f0f5fa] tracking-wide">
              中央控制大盘
            </h1>
            <span className="text-xs px-2 py-0.5 font-mono text-[#00e5ff] bg-[#102a45] rounded border border-[#1e4670] font-bold">
              任务单号 #{t?.task_id || "--"}
            </span>
            <Tag
              color={typeInfo.tag}
              className="m-0 text-xs px-2.5 py-0.5 font-bold rounded"
            >
              {typeInfo.label}
            </Tag>
          </div>
        </div>
        <div className="h-8 w-[1px] bg-[#1c3857]" />
        <div className="flex items-center gap-6 text-sm text-[#8ca6c2] font-medium">
          <div>
            目标点位:{" "}
            <span className="text-[#00e5ff] font-bold">
              P_{t?.task_point_id || "--"}
            </span>
          </div>
          <div>
            载荷标识:{" "}
            <span className="text-[#e0e8f0] font-bold">
              {t?.pallet_name || "--"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-5">
        {/* 长连接离线切换提示警告角标 */}
        {isOffline && (
          <span className="text-xs font-bold font-mono px-2 py-1 text-[#ff4d4f] bg-[#2a1215] border border-[#5c1d24] rounded animate-pulse">
            [ 核心连接断开 - 运行本地降级模拟源 ]
          </span>
        )}
        <div className="text-right font-mono bg-[#07111c] border border-[#14283d] px-3 py-1 rounded-lg">
          <span className="text-[11px] block text-[#4b6d8f] uppercase font-bold tracking-wider mb-0.5">
            全局系统时序戳
          </span>
          <span className="text-sm text-[#00e5ff] font-bold tracking-wide">
            {timestamp
              ? dayjs(timestamp).format("YYYY/MM/DD HH:mm:ss.SSS")
              : "--"}
          </span>
        </div>
        <div className="flex items-center gap-3 bg-[#0a1829] border border-[#1e426b] px-4 py-2 rounded-xl">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isOffline ? "bg-orange-500" : "bg-[#00e5ff]"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isOffline ? "bg-orange-500" : "bg-[#00e5ff]"
              }`}
            ></span>
          </span>
          <span className="text-sm text-[#c5d3e0] font-semibold tracking-wide">
            {isOffline ? "备份就绪" : stateInfo.label}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActionQueue({
  actions,
  currentIdx,
}: {
  actions: any[];
  currentIdx: number;
}) {
  // 车载交互优化：随着 actions 递增，自动将当前激活的 Action 滚动至可视区域中央
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeItem = containerRef.current.children[
        currentIdx
      ] as HTMLElement;
      if (activeItem) {
        containerRef.current.scrollTo({
          top:
            activeItem.offsetTop -
            containerRef.current.clientHeight / 2 +
            activeItem.clientHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentIdx, actions?.length]);

  return (
    <div className="w-[320px] shrink-0 border border-[#1a314d] bg-[#050b12] rounded-2xl p-5 flex flex-col min-h-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1a314d] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-4 bg-[#00e5ff] rounded-full" />
          <span className="text-sm font-bold text-[#a2b8cc]">指令动作队列</span>
        </div>
        <span className="text-xs font-mono bg-[#10253d] text-[#00e5ff] px-2 py-0.5 rounded border border-[#1c3f66] font-bold">
          {actions?.length || 0} 项动作
        </span>
      </div>
      <div
        ref={containerRef}
        className="space-y-3 flex-1 overflow-y-auto scrollbar-none"
      >
        {actions?.map((a, i) => {
          const isSelected = currentIdx === i;
          const isPast = i < currentIdx;
          return (
            <div
              key={a.action_id || i}
              className={`p-4 rounded-xl border transition-all relative overflow-hidden ${
                isSelected
                  ? "bg-[#0b2442] border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.2)] scale-[1.02]"
                  : isPast
                  ? "bg-[#04090f] border-[#0d1824] opacity-35"
                  : "bg-[#08121c] border-[#142438] opacity-70"
              }`}
            >
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#00e5ff]" />
              )}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded font-bold ${
                    a.action_type === "vision"
                      ? "bg-[#0e2d4a] text-[#00e5ff]"
                      : "bg-[#183610] text-[#90f244]"
                  }`}
                >
                  {a.action_type === "vision" ? "感知层" : "控制层"}
                </span>
                <span className="text-xs font-mono">
                  {isSelected ? (
                    <span className="text-[#00e5ff] animate-pulse">
                      正在解算
                    </span>
                  ) : isPast ? (
                    <span className="text-[#4b6d8f]">已归档</span>
                  ) : (
                    <span className="text-[#5c7b9c]">队列中</span>
                  )}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-[#f0f5fa] truncate">
                {a.title}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TelemetryPanel({ telemetry }: { telemetry: any }) {
  const activeTelemetry = telemetry || {};
  return (
    <div className="border border-[#90f244]/40 bg-gradient-to-r from-[#111f0f] to-[#040804] rounded-2xl p-5 flex flex-col shrink-0">
      <div className="flex items-center justify-between border-b border-[#254717] pb-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-4 bg-[#90f244] rounded-full" />
          <span className="text-sm font-bold text-[#90f244]">
            实时运动学遥测姿态
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 w-full">
        {Object.entries(activeTelemetry).map(([key, value]: [string, any]) => {
          const isAngle =
            key.includes("角") ||
            key.toLowerCase().includes("yaw") ||
            key.toLowerCase().includes("roll");
          return (
            <div
              key={key}
              className="bg-[#091408] border border-[#193612] rounded-xl p-3"
            >
              <div className="text-xs text-[#639452] font-bold tracking-wide">
                {key}
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#90f244] tracking-tight font-mono">
                  {typeof value === "number" ? value.toFixed(2) : "--"}
                </span>
                <span className="text-xs text-[#446e34] font-bold ml-1">
                  {isAngle ? "度" : "毫米"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgentBrain({
  action,
  displayedSteps,
  isActionThinking,
}: {
  action: any;
  displayedSteps: any[];
  isActionThinking: boolean;
}) {
  const hasSkeleton = displayedSteps.some((s) => s.isSkeleton);
  const showTopIndicator = isActionThinking || hasSkeleton;

  return (
    <div className="flex-1 border border-[#00e5ff]/40 bg-gradient-to-b from-[#071629] to-[#04090f] rounded-2xl p-5 flex flex-col min-h-0 relative shadow-[0_0_35px_rgba(0,229,255,0.05)] overflow-hidden">
      {/* 优化后的局部轻量级遮罩动画层（仅在指针真实切换时短暂出现，防剧烈闪烁） */}
      <AnimatePresence>
        {isActionThinking && (
          <motion.div
            key="global_action_thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ willChange: "opacity" }}
            className="absolute inset-0 bg-[#040c17]/90 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-3 border border-[#00e5ff]/20 z-30"
          >
            <div className="relative flex items-center justify-center w-12 h-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-[#00e5ff]/40 rounded-full"
              />
              <div className="w-5 h-5 bg-[#00e5ff] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.6)] animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-xs font-mono text-[#00e5ff] tracking-widest font-bold">
                CONTEXT SWITCHING
              </p>
              <p className="text-[11px] text-[#527ca6] mt-0.5">
                正在同步增量流式动作时序...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-b border-[#1f3e61] pb-3 mb-3 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
            <span className="text-xs font-bold text-[#00e5ff] tracking-widest uppercase">
              VLA 多模态大脑模型推理中枢
            </span>
          </div>
          <h2 className="text-base font-bold text-[#ffffff] tracking-wide">
            {action?.title || "--"}
          </h2>
          <p className="text-sm text-[#8ba3bd]">
            <span className="text-[#00e5ff] font-semibold">当前意图目标：</span>
            {action?.intent || "--"}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0c2440] border border-[#1e4c80] px-3 py-1.5 rounded-xl">
          <div className="flex space-x-1 items-center h-4">
            {[0, 0.2, 0.4].map((delay, index) => (
              <motion.span
                key={index}
                className="w-1 h-3.5 bg-[#00e5ff] rounded-full"
                animate={{ scaleY: showTopIndicator ? [1, 2.2, 1] : 1 }}
                transition={
                  showTopIndicator
                    ? {
                        repeat: Infinity,
                        duration: 0.6,
                        delay,
                        ease: "easeInOut",
                      }
                    : {}
                }
              />
            ))}
          </div>
          <span className="text-xs text-[#00e5ff] font-bold tracking-wider ml-1 animate-pulse">
            {isActionThinking
              ? "加载新上下文..."
              : hasSkeleton
              ? "推理树增量解算中..."
              : "决策输出保持收敛"}
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full overflow-y-auto space-y-3 pr-1 text-sm scrollbar-none">
        <AnimatePresence initial={false}>
          {displayedSteps.map((step: any, idx: number) => {
            if (step.isSkeleton) {
              return (
                <motion.div
                  key={`skeleton-${step.step_key}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ willChange: "transform, opacity" }}
                  className="p-4 rounded-xl border border-[#00e5ff]/30 bg-[#051426] relative flex items-start gap-4 overflow-hidden min-h-[85px]"
                >
                  <div className="mt-1 shrink-0 w-5 h-5 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.2,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-[#00e5ff] border-t-transparent rounded-full"
                    />
                  </div>
                  <div className="flex-1 space-y-2.5 pt-1 w-full relative">
                    <div className="text-xs font-bold tracking-wider text-[#00e5ff]/70">
                      步骤 {String(idx + 1).padStart(2, "0")} //
                      正在拦截解算语义...
                    </div>
                    <div className="relative h-4 bg-[#0d243f] rounded w-11/12 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1a4b80] to-transparent w-[50%]"
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: "linear",
                        }}
                        style={{ willChange: "transform" }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            }

            const isActive = step.status === "active";
            return (
              <motion.div
                key={`real-${step.step_key}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{ willChange: "transform, opacity" }}
                className={`p-4 rounded-xl border relative flex items-start gap-4 transition-colors duration-300 min-h-[85px] ${
                  isActive
                    ? "bg-[#0e2d4f] border-[#00e5ff]/60 shadow-[inset_0_0_15px_rgba(0,229,255,0.15)]"
                    : "bg-[#08121c]/80 border-[#152a40] opacity-80"
                }`}
              >
                <div className="mt-1 shrink-0 text-base font-bold w-5 h-5 flex items-center justify-center text-[#00e5ff]">
                  {step.status === "done" ? "✔" : "●"}
                </div>
                <div className="flex-1 leading-relaxed w-full">
                  <div
                    className={`text-xs font-bold tracking-wider mb-1 ${
                      isActive ? "text-[#00e5ff]" : "text-[#5c7c9c]"
                    }`}
                  >
                    步骤 {String(idx + 1).padStart(2, "0")} //{" "}
                    {step.status === "done" ? "已完成" : "执行中"}
                  </div>
                  <p
                    className={`text-base ${
                      isActive ? "text-[#ffffff] font-medium" : "text-[#b1c4d6]"
                    }`}
                  >
                    {step.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==================== 5. 主控制大盘逻辑核心 ====================

const VlaConsole = () => {
  // 调用自定义通信 Hook 动态接收真网总线或降级数据
  const { vlaData, isUsingMock, readyState } = useVlaWebSocket();
  const [displayedSteps, setDisplayedSteps] = useState<any[]>([]);
  const [isActionThinking, setIsActionThinking] = useState(false);

  // 核心引用追踪器
  const currentActionIdRef = useRef<string>("");
  // 全局唯一步骤注册锁：解决 actions 递增下，同一/不同 Action 步骤不退化骨架屏的关键
  const globalProcessedStepsRef = useRef<Record<string, boolean>>({});

  // 监听并实时解耦多模态动作与步骤树的增量流式计算
  useEffect(() => {
    if (!vlaData) return;

    const { actions, current_action_index } = vlaData;
    const currentAction = actions?.[current_action_index];
    if (!currentAction) return;

    const activeActionId = currentAction.action_id;

    // 阶段一：检测动作指针是否转移到了全新 Action
    if (currentActionIdRef.current !== activeActionId) {
      currentActionIdRef.current = activeActionId;

      // 仅触发 600ms 轻量级切页渲染缓冲，而不是冗长的 2s 强阻断大面具
      setIsActionThinking(true);
      setDisplayedSteps([]);

      setTimeout(() => {
        setIsActionThinking(false);
        // 切页完成，无缝抓取最新帧的推理快照
        if (currentAction.thought_process?.length > 0) {
          processIncomingSteps(currentAction.thought_process, activeActionId);
        }
      }, 600);
      return;
    }

    // 阶段二：如果没有处于动画锁中，无缝处理追加或状态变更的步骤条
    if (isActionThinking) return;
    processIncomingSteps(currentAction.thought_process || [], activeActionId);

    // 增量流式卡片推演解算器
    function processIncomingSteps(incomingSteps: any[], actionId: string) {
      incomingSteps.forEach((inStep) => {
        // 使用 "ActionID_StepID" 拼装全真域绝对唯一识别键，对抗追加式递增带来的冲突
        const globalStepKey = `${actionId}_${inStep.step_id}`;
        const isAlreadyProcessed =
          globalProcessedStepsRef.current[globalStepKey];

        if (!isAlreadyProcessed) {
          // 抢先占位锁定，防止重复渲染
          globalProcessedStepsRef.current[globalStepKey] = true;

          // 1. 骨架屏物理卡片瞬间推入顶替
          setDisplayedSteps((prev) => [
            ...prev,
            {
              step_id: inStep.step_id,
              step_key: globalStepKey,
              isSkeleton: true,
            },
          ]);

          // 2. 1秒物理硬件解算时滞结束后，丝滑融合渲染业务报文
          setTimeout(() => {
            setDisplayedSteps((prev) =>
              prev.map((item) =>
                item.step_key === globalStepKey
                  ? { ...inStep, step_key: globalStepKey, isSkeleton: false }
                  : item,
              ),
            );
          }, 1000);
        } else {
          // 3. 如果早就完成了解算，仅向下游同步状态更新（例: active -> done）而绝不退化骨架动画
          setDisplayedSteps((prev) =>
            prev.map((item) =>
              item.step_key === globalStepKey && !item.isSkeleton
                ? { ...inStep, step_key: globalStepKey, isSkeleton: false }
                : item,
            ),
          );
        }
      });
    }
  }, [vlaData, isActionThinking]);

  if (!vlaData) {
    return (
      <div className="text-white p-6 bg-[#03060a] h-screen flex flex-col items-center justify-center font-mono gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-8 h-8 border-2 border-[#00e5ff] border-t-transparent rounded-full"
        />
        <div className="text-[#00e5ff] tracking-widest text-sm font-bold animate-pulse">
          正在握手自主 VLA 通信通道链路...
        </div>
      </div>
    );
  }

  const { task, timestamp, actions, current_action_index } = vlaData;
  const currentAction = actions?.[current_action_index] || { telemetry: {} };

  return (
    <div
      className="relative h-screen w-full overflow-hidden font-sans text-white flex flex-col bg-[#03060a]"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(0, 229, 255, 0.08), transparent 60%),
          radial-gradient(circle at 100% 100%, rgba(144, 242, 68, 0.03), transparent 50%),
          repeating-linear-gradient(0deg, rgba(255,255,255,0.005) 0px, rgba(255,255,255,0.005) 1px, transparent 1px, transparent 40px)
        `,
      }}
    >
      {/* 顶部任务控制流面板 */}
      <MinimalTaskBar t={task} timestamp={timestamp} isOffline={isUsingMock} />

      <div className="flex-1 flex gap-5 p-5 min-h-0 w-full bg-gradient-to-b from-transparent to-[#020407]">
        {/* 指令动作队列组件 */}
        <ActionQueue
          actions={actions || []}
          currentIdx={current_action_index}
        />

        <div className="flex-1 flex flex-col gap-5 min-h-0">
          {/* 当状态不为 1 (即未连接) 时，断线组件以最高层级（z-50）瞬间切入扑杀 */}
          <AnimatePresence>
            {readyState !== 1 && (
              <WsDisconnectedOverlay readyState={readyState} />
            )}
          </AnimatePresence>

          {/* 遥测面板 */}
          <TelemetryPanel telemetry={currentAction.telemetry} />

          {/* 模型大脑推理树面板 */}
          <AgentBrain
            action={currentAction}
            displayedSteps={displayedSteps}
            isActionThinking={isActionThinking}
          />
        </div>
      </div>
    </div>
  );
};

export default VlaConsole;
