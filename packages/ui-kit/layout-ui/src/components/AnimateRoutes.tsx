// components/AnimatedRoutes.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";

export default function AnimatedRoutes() {
  const location = useLocation();
  const outlet = useOutlet();

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<"enter" | "exit">(
    "enter"
  );

  const prevOutlet = useRef(outlet); // 上一次的页面组件

  // 检测路径变化，先播放退出动画
  useEffect(() => {
    // debugger;
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("exit");
    }
  }, [location, displayLocation]);

  // 动画结束后更新展示页面
  const handleAnimationComplete = () => {
    if (transitionStage === "exit") {
      setDisplayLocation(location);
      setTransitionStage("enter");
    }
  };

  // 保存旧页面，防止切换时立即替换
  if (transitionStage === "exit") {
    // 使用旧页面内容
    prevOutlet.current = outlet;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayLocation.pathname}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -80 }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={handleAnimationComplete}
      >
        {transitionStage === "exit" ? prevOutlet.current : outlet}
      </motion.div>
    </AnimatePresence>
  );
}
