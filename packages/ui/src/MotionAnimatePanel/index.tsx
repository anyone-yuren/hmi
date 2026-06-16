import { AnimatePresence, motion, type Variants } from 'framer-motion';

import type { ReactNode } from 'react';

interface AnimatedWrapperProps {
  children: ReactNode;
  animationType?: 'fade' | 'slide' | 'scale'; // 可选的动画类型
  delay?: number; // 动画延迟（秒）
  duration?: number; // 动画持续时间（秒）
  className?: string; // 可选的类名
}

const AnimatedWrapper = ({
  children,
  animationType = 'fade',
  delay = 0,
  duration = 0.5,
  className,
}: AnimatedWrapperProps) => {
  // 定义不同的动画效果
  const variants: Record<string, Variants> = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { delay, duration } },
      exit: { opacity: 0, transition: { duration } },
    },
    slide: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0, transition: { delay, duration } },
      exit: { opacity: 0, x: -50, transition: { duration } },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { delay, duration } },
      exit: { opacity: 0, scale: 0.8, transition: { duration } },
    },
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={animationType} // 确保动画类型变化时重新触发动画
        initial='hidden'
        animate='visible'
        exit='exit'
        variants={variants[animationType]}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedWrapper;
