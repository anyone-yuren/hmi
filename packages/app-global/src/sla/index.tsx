import { Tag } from "antd";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { WsDisconnectedOverlay } from "./components/WsDisconnectedOverlay";
import { useVlaWebSocket } from "./hooks/useVlaWebSocket";

// ==================== 顶部大任务状态栏 ====================
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
  const typeInfo = TASK_TYPE_MAP[t?.task_type] ?? {
    label: "未分配任务",
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
              单号 #{t?.task_id || "--"}
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
        {isOffline && (
          <span className="text-xs font-bold font-mono px-2 py-1 text-[#ff4d4f] bg-[#2a1215] border border-[#5c1d24] rounded animate-pulse">
            [ 链路意外断开 - 自动启动本地降级 ]
          </span>
        )}
        <div className="text-right font-mono bg-[#07111c] border border-[#14283d] px-3 py-1 rounded-lg">
          <span className="text-[11px] block text-[#4b6d8f] uppercase font-bold tracking-wider mb-0.5">
            时序时钟
          </span>
          <span className="text-sm text-[#00e5ff] font-bold tracking-wide">
            {timestamp ? dayjs(timestamp).format("HH:mm:ss.SSS") : "--"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ==================== 动态动作执行链 ====================
function ActionQueue({
  actions,
  currentIdx,
}: {
  actions: any[];
  currentIdx: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const activeChild = containerRef.current.children[
      currentIdx
    ] as HTMLElement;
    if (activeChild) {
      const containerHeight = containerRef.current.clientHeight;
      containerRef.current.scrollTo({
        top:
          activeChild.offsetTop -
          containerHeight / 2 +
          activeChild.clientHeight / 2,
        behavior: "smooth",
      });
    }
  }, [currentIdx, actions?.length]);

  const STATUS_MAP: Record<
    string,
    { badge: string; textClass: string; containerClass: string }
  > = {
    active: {
      badge: "● 执行中",
      textClass: "text-[#00e5ff] animate-pulse font-bold",
      containerClass:
        "bg-[#0b2442] border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.2)] scale-[1.02]",
    },
    done: {
      badge: "✓ 已完成",
      textClass: "text-[#4b6d8f]",
      containerClass: "bg-[#04090f] border-[#0d1824] opacity-35",
    },
    failed: {
      badge: "❌ 异常阻断",
      textClass: "text-[#ff4d4f] font-bold",
      containerClass:
        "bg-[#240b11] border-[#ff4d4f] shadow-[0_0_12px_rgba(255,77,79,0.15)]",
    },
    pending: {
      badge: "队列中",
      textClass: "text-[#5c7b9c]",
      containerClass: "bg-[#08121c] border-[#142438] opacity-70",
    },
  };

  return (
    <div className="w-[280px] shrink-0 border border-[#1a314d] bg-[#050b12] rounded-2xl p-5 flex flex-col min-h-0 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1a314d] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-4 bg-[#00e5ff] rounded-full" />
          <span className="text-sm font-bold text-[#a2b8cc]">
            动态动作执行链
          </span>
        </div>
        <span className="text-xs font-mono bg-[#10253d] text-[#00e5ff] px-2 py-0.5 rounded border border-[#1c3f66] font-bold">
          共 {actions?.length || 0} 步
        </span>
      </div>
      <div
        ref={containerRef}
        className="space-y-3 flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {actions?.map((a, i) => {
          const currentStatus =
            a.status ||
            (i === currentIdx ? "active" : i < currentIdx ? "done" : "pending");
          const styleConfig = STATUS_MAP[currentStatus] || STATUS_MAP.pending;

          return (
            <div
              key={a.action_id || i}
              className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${styleConfig.containerClass}`}
            >
              {currentStatus === "active" && (
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#00e5ff]" />
              )}
              {currentStatus === "failed" && (
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#ff4d4f]" />
              )}
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-[#00e5ff] tracking-wider">
                  ACTION #{String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-xs font-mono">
                  <span className={styleConfig.textClass}>
                    {styleConfig.badge}
                  </span>
                </span>
              </div>
              <h4 className="text-sm font-semibold text-[#f0f5fa] mt-1 truncate">
                {a.title}
              </h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== 实时遥测姿态面板 ====================
function TelemetryPanel({ telemetry }: { telemetry: any }) {
  const data = telemetry || {};
  const fmt = (val: any) => (typeof val === "number" ? val.toFixed(2) : "--");

  return (
    <div className="border border-[#90f244]/30 bg-gradient-to-b from-[#0b170a] to-[#030603] rounded-2xl p-4 flex flex-col shrink-0 shadow-[0_8px_32px_rgba(144,242,68,0.03)]">
      <div className="flex items-center justify-between border-b border-[#203a15] pb-2 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-3.5 bg-[#90f244] rounded-full animate-pulse" />
          <span className="text-xs font-black tracking-widest text-[#90f244] uppercase font-mono">
            REAL-TIME KINEMATICS TELEMETRY // 实时多轴运动学解算
          </span>
        </div>
      </div>

      <div className="flex gap-4 items-stretch w-full">
        <div className="flex-1 bg-[#050d04] border border-[#193312] rounded-xl p-3 grid grid-cols-3 gap-3 relative overflow-hidden">
          <div className="absolute right-1 bottom-0 text-[32px] font-black font-mono text-[#193312]/20 select-none pointer-events-none">
            POS
          </div>
          <div className="flex flex-col justify-between">
            <span className="text-[11px] text-[#558246] font-bold font-mono">
              前向纵距
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black font-mono text-[#90f244] tracking-tight">
                {fmt(data["X轴"])}
              </span>
              <span className="text-[10px] text-[#3d6330] font-bold font-mono ml-1">
                mm
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between border-l border-[#193312]/60 pl-3">
            <span className="text-[11px] text-[#558246] font-bold font-mono">
              横向对齐
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black font-mono text-[#90f244] tracking-tight">
                {fmt(data["Y轴"])}
              </span>
              <span className="text-[10px] text-[#3d6330] font-bold font-mono ml-1">
                mm
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between border-l border-[#193312]/60 pl-3">
            <span className="text-[11px] text-[#558246] font-bold font-mono">
              绝对举升
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black font-mono text-[#90f244] tracking-tight">
                {fmt(data["Z轴"])}
              </span>
              <span className="text-[10px] text-[#3d6330] font-bold font-mono ml-1">
                mm
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#050d04] border border-[#193312] rounded-xl p-3 grid grid-cols-3 gap-3 relative overflow-hidden">
          <div className="absolute right-1 bottom-0 text-[32px] font-black font-mono text-[#193312]/20 select-none pointer-events-none">
            ROT
          </div>
          <div className="flex flex-col justify-between">
            <span className="text-[11px] text-[#558246] font-bold font-mono">
              偏航角
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black font-mono text-[#a6ff54] tracking-tight">
                {fmt(data["偏航角 (Yaw)"] || data["yaw"])}
              </span>
              <span className="text-[10px] text-[#3d6330] font-bold font-mono ml-1">
                deg
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between border-l border-[#193312]/60 pl-3">
            <span className="text-[11px] text-[#558246] font-bold font-mono">
              俯仰角
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black font-mono text-[#a6ff54] tracking-tight">
                {fmt(data["pitch"])}
              </span>
              <span className="text-[10px] text-[#3d6330] font-bold font-mono ml-1">
                deg
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-between border-l border-[#193312]/60 pl-3">
            <span className="text-[11px] text-[#558246] font-bold font-mono">
              横滚角
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black font-mono text-[#a6ff54] tracking-tight">
                {fmt(data["roll"])}
              </span>
              <span className="text-[10px] text-[#3d6330] font-bold font-mono ml-1">
                deg
              </span>
            </div>
          </div>
        </div>

        <div className="w-[160px] bg-[#081407] border border-[#224219] rounded-xl p-3 flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute -right-2 -bottom-2 text-[44px] font-black font-mono text-[#193312]/15 select-none pointer-events-none">
            GEO
          </div>
          <span className="text-[11px] text-[#60944f] font-bold font-mono uppercase tracking-wide">
            孔径宽度
          </span>
          <div className="flex items-baseline justify-between mt-1 z-10">
            <span className="text-2xl font-black font-mono text-[#b6ff6b] tracking-tight">
              {fmt(data["width"])}
            </span>
            <span className="text-xs text-[#4c7d3c] font-bold font-mono">
              mm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== 多模态大脑决策树 ====================
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
  const stepsBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepsBottomRef.current) {
      stepsBottomRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [displayedSteps, isActionThinking]);

  return (
    <div className="flex-1 border border-[#00e5ff]/40 bg-gradient-to-b from-[#071629] to-[#04090f] rounded-2xl p-5 flex flex-col min-h-0 relative shadow-[0_0_35px_rgba(0,229,255,0.05)] overflow-hidden">
      <AnimatePresence mode="wait">
        {isActionThinking && (
          <motion.div
            key="global_action_thinking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
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
                正在同步增量动作推理树...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start justify-between border-b border-[#1f3e61] pb-3 mb-3 shrink-0">
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

      <div
        className="flex-1 min-h-0 w-full overflow-y-auto space-y-3 pr-1 text-sm"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <AnimatePresence initial={false}>
          {displayedSteps.map((step: any, idx: number) => {
            if (step.isSkeleton) {
              return (
                <motion.div
                  key={`skeleton-${step.step_key}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
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
                      />
                    </div>
                  </div>
                </motion.div>
              );
            }

            const isLastStep = idx === displayedSteps.length - 1;
            const stepStatus = isLastStep ? step.status : "done";
            const isActive = stepStatus === "active";

            const formattedTime = step.timestamp
              ? dayjs(step.timestamp).format("HH:mm:ss.SSS")
              : dayjs().format("HH:mm:ss.SSS");

            return (
              <motion.div
                key={`real-${step.step_key}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`p-4 rounded-xl border relative flex items-start gap-4 transition-colors duration-300 min-h-[85px] ${
                  isActive
                    ? "bg-[#0e2d4f] border-[#00e5ff]/60 shadow-[inset_0_0_15px_rgba(0,229,255,0.15)]"
                    : "bg-[#08121c]/80 border-[#152a40] opacity-80"
                }`}
              >
                <div className="mt-1 shrink-0 text-base font-bold w-5 h-5 flex items-center justify-center text-[#00e5ff]">
                  {stepStatus === "done" ? "✔" : "●"}
                </div>
                <div className="flex-1 leading-relaxed w-full">
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className={`text-xs font-bold tracking-wider ${
                        isActive ? "text-[#00e5ff]" : "text-[#5c7c9c]"
                      }`}
                    >
                      步骤 {String(idx + 1).padStart(2, "0")} //{" "}
                      {stepStatus === "done" ? "已完成" : "执行中"}
                    </div>
                    <div className="text-[11px] font-mono font-medium text-[#4b6d8f] bg-[#050d14] px-1.5 py-0.5 rounded border border-[#142638]">
                      T + {formattedTime}
                    </div>
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
        <div
          ref={stepsBottomRef}
          className="h-[1px] w-full invisible shrink-0"
        />
      </div>
    </div>
  );
}

// ==================== 车载赛博风缺省值空数据组件 ====================
function VlaEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center font-sans relative p-8 select-none">
      <div className="absolute w-[450px] h-[450px] border border-[#152b47]/30 rounded-full flex items-center justify-center pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.25, 0.1] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-[300px] h-[300px] border border-dashed border-[#ff4d4f]/10 rounded-full"
        />
      </div>

      <div className="relative flex flex-col items-center text-center max-w-md z-10">
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl border-2 bg-[#ff4d4f]/5 border-[#ff4d4f]/40 text-[#ff4d4f]/80 text-2xl font-mono flex items-center justify-center shadow-[0_0_25px_rgba(255,77,79,0.1)]"
          >
            ∅
          </motion.div>
          <div className="absolute inset-0 w-20 h-20 border border-[#ff4d4f]/20 rounded-full animate-ping opacity-10" />
        </div>

        <h3 className="text-lg font-bold text-[#f0f5fa] tracking-widest uppercase mb-2">
          未接收到自主核核心数据
        </h3>
        <p className="text-sm text-[#527ca6] leading-relaxed mb-6 font-mono">
          数据通道当前处于收敛空载状态。无线链路丢失或自主核服务异常，系统正在发起无线重连，请检查网关及上位机状态。
        </p>

        <div className="flex gap-1.5 items-center justify-center w-36 h-1.5 bg-[#0a1420] border border-[#162d47] rounded-full overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-12 h-full bg-gradient-to-r from-transparent via-[#ff4d4f]/50 to-transparent"
          />
        </div>
      </div>
    </div>
  );
}

// ==================== 主控制大盘全局核心 ====================
const VlaConsole = () => {
  const { vlaData, isUsingMock, readyState } = useVlaWebSocket();
  const [displayedSteps, setDisplayedSteps] = useState<any[]>([]);
  const [isActionThinking, setIsActionThinking] = useState(false);

  const currentTaskIdRef = useRef<number | string>("");
  const currentActionIdRef = useRef<string>("");
  const globalProcessedStepsRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!vlaData) {
      setDisplayedSteps([]);
      return;
    }

    const { task, actions } = vlaData;
    const activeTaskId = task?.task_id;

    const fallbackIdx = actions?.length ? actions.length - 1 : 0;
    const currentAction = actions?.[fallbackIdx];

    if (activeTaskId && currentTaskIdRef.current !== activeTaskId) {
      currentTaskIdRef.current = activeTaskId;
      currentActionIdRef.current = "";
      globalProcessedStepsRef.current = {};
      setDisplayedSteps([]);
      setIsActionThinking(false);
      return;
    }

    if (!currentAction) return;
    const activeActionId = currentAction.action_id;

    if (currentActionIdRef.current !== activeActionId) {
      currentActionIdRef.current = activeActionId;
      setIsActionThinking(true);
      setDisplayedSteps([]);

      setTimeout(() => {
        setIsActionThinking(false);
        if (currentAction.thought_process?.length > 0) {
          processIncomingSteps(currentAction.thought_process, activeActionId);
        }
      }, 600);
      return;
    }

    if (isActionThinking) return;
    processIncomingSteps(currentAction.thought_process || [], activeActionId);

    function processIncomingSteps(incomingSteps: any[], actionId: string) {
      incomingSteps.forEach((inStep) => {
        const globalStepKey = `${actionId}_${inStep.step_id}`;
        const isAlreadyProcessed =
          globalProcessedStepsRef.current[globalStepKey];

        if (!isAlreadyProcessed) {
          globalProcessedStepsRef.current[globalStepKey] = true;
          setDisplayedSteps((prev) => [
            ...prev,
            {
              step_id: inStep.step_id,
              step_key: globalStepKey,
              isSkeleton: true,
            },
          ]);

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

  // 处理无业务数据时的拦截与缺省逻辑分流
  const task = vlaData?.task || null;
  const timestamp = vlaData?.timestamp || 0;
  const actions = vlaData?.actions || [];
  const fallbackIdx = actions.length ? actions.length - 1 : 0;
  const currentAction = actions[fallbackIdx] || null;

  // 【核心修改点】：细分首帧无数据场景
  // 1. 如果 readyState === 0（连接中），则展示科技感 Loading 动效转圈
  if (!vlaData && readyState === 0) {
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
      <MinimalTaskBar t={task} timestamp={timestamp} isOffline={isUsingMock} />

      <div className="flex-1 flex gap-5 p-5 min-h-0 w-full bg-gradient-to-b from-transparent to-[#020407]">
        <AnimatePresence mode="wait">
          {/* 2. 如果无数据，且 readyState !== 0（已断开或连接失败），进入科技感空状态缺省页 */}
          {!vlaData ? (
            <motion.div
              key="vla-empty-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex border border-[#1c3857]/40 bg-[#040912]/60 rounded-3xl backdrop-blur-md shadow-2xl"
            >
              <VlaEmptyState />
            </motion.div>
          ) : (
            // 正常有业务增量数据流入时的控制台面板
            <motion.div
              key="vla-dashboard-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex gap-5 min-h-0"
            >
              <ActionQueue actions={actions} currentIdx={fallbackIdx} />

              <div className="flex-1 flex flex-col gap-5 min-h-0 relative">
                <AnimatePresence mode="wait">
                  {readyState !== 1 && !isUsingMock && (
                    <WsDisconnectedOverlay
                      key="ws-disconnect-guard"
                      readyState={readyState}
                    />
                  )}
                </AnimatePresence>

                <TelemetryPanel telemetry={currentAction?.telemetry} />
                <AgentBrain
                  action={currentAction}
                  displayedSteps={displayedSteps}
                  isActionThinking={isActionThinking}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VlaConsole;
