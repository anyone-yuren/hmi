import { motion } from "framer-motion";

interface WsDisconnectedProps {
  readyState: number;
}

export function WsDisconnectedOverlay({ readyState }: WsDisconnectedProps) {
  // readyState 状态映射：0-连接中, 2-关闭中, 3-已关闭或连接失败
  const isConnecting = readyState === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 bg-[#040810]/85 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-6 border border-[#ff4d4f]/20 z-50 overflow-hidden"
      style={{ willChange: "opacity" }}
    >
      {/* 科技感背景辐射光晕 */}
      <div
        className={`absolute w-72 h-72 rounded-full blur-[100px] opacity-20 ${
          isConnecting ? "bg-[#00e5ff]" : "bg-[#ff4d4f]"
        }`}
      />

      {/* 核心警示图形：模拟车机雷达/声波脉冲 */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* 动态扩散的外圈 */}
        <motion.div
          animate={
            isConnecting
              ? { scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }
              : { scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }
          }
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className={`absolute inset-0 border-2 rounded-full ${
            isConnecting ? "border-[#00e5ff]/50" : "border-[#ff4d4f]/50"
          }`}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className={`absolute w-20 h-24 border border-dashed rounded-full ${
            isConnecting ? "border-[#00e5ff]/30" : "border-[#ff4d4f]/30"
          }`}
        />

        {/* 中心物理图标/符号 */}
        <motion.div
          animate={isConnecting ? {} : { scale: [0.95, 1.05, 0.95] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-xl shadow-lg ${
            isConnecting
              ? "bg-[#00e5ff]/10 border border-[#00e5ff] text-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.3)]"
              : "bg-[#ff4d4f]/10 border border-[#ff4d4f] text-[#ff4d4f] shadow-[0_0_20px_rgba(255,77,79,0.3)]"
          }`}
        >
          {isConnecting ? "⟳" : "⚡"}
        </motion.div>
      </div>

      {/* 文本警示区（全中文化、车载特大字号） */}
      <div className="text-center z-10 px-6">
        <h3
          className={`text-xl font-bold tracking-widest ${
            isConnecting ? "text-[#00e5ff]" : "text-[#ff4d4f]"
          }`}
        >
          {isConnecting ? "自主核通信总线连接中" : "自主核通信总线已断开"}
        </h3>
        <p className="text-sm text-[#7e99b3] mt-2 max-w-md leading-relaxed">
          {isConnecting
            ? "正在尝试握手底盘 CAN 总线网关，重构 VLA 数据通道..."
            : "无线链路丢失或自主核服务异常。系统正在发起无限重连机制，请检查车载网关状态。"}
        </p>
      </div>

      {/* 底部高频闪烁的时序扫描流光条 */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#0c1624] overflow-hidden">
        <motion.div
          className={`h-full w-1/3 bg-gradient-to-r from-transparent ${
            isConnecting ? "via-[#00e5ff]" : "via-[#ff4d4f]"
          } to-transparent`}
          animate={{ x: ["-100%", "300%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
