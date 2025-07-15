'use client';

import { createStyles } from 'antd-style';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Bubble = {
  id: number;
  size: number;
  x: number;
};
const useChargingAnimation = createStyles(({ css, token }) => ({
  customSlider: css`
    filter: blur(3px);
    animation: bubbles 6s linear infinite;
    width: 300px;
    height: 300px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 220px;
      height: 220px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #00d1d1;
      border-radius: 42% 38% 62% 49% / 45%;
    }
    @keyframes bubbles {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,
}));

const ChargingAnimation = ({ level = 36 }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const { styles } = useChargingAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) => [
        ...prev,
        {
          id: Math.random(),
          size: Math.random() * 15 + 10,
          x: Math.random() * 160 - 80,
        },
      ]);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='flex flex-col items-center justify-center bg-black/50 text-white  overflow-hidden fixed w-full h-full z-10 top-0 left-0'>
      {/* 动态电波 */}
      <motion.div
        className='absolute rounded-full'
        style={{ width: 300, height: 300 }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: 'linear',
        }}
      >
        <svg width='300' height='300' viewBox='0 0 300 300'>
          <motion.circle
            cx='150'
            cy='150'
            r='140'
            stroke='#00d1d1'
            fill='none'
            animate={{
              r: [135, 140, 135],
              opacity: [0.2, 0.7, 0.2],
              strokeWidth: [2, 4, 2],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: 'linear',
            }}
          />
        </svg>
      </motion.div>

      {/* 中心电量 */}
      <div className={styles.customSlider}></div>
      <div className='relative flex flex-col items-center justify-center w-[200px] h-[200px] bg-black rounded-full border-4 border-teal-500 z-10'>
        <div className='text-6xl font-bold'>{level}%</div>
        <div className='text-2xl mt-1 '>⚡</div>
        <div className='text-sm mt-1'>正在充电</div>
      </div>

      {/* 气泡形变 */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className='absolute bg-teal-400 rounded-full'
          style={{
            width: bubble.size,
            height: bubble.size,
            left: '50%',
            marginLeft: bubble.x,
            bottom: 80,
          }}
          animate={{
            y: -500,
            opacity: [1, 0],
            scaleX: [1, 1.2, 0.8, 1],
            scaleY: [1, 0.8, 1.2, 1],
          }}
          transition={{
            duration: 4,
            ease: 'backIn',
          }}
          onAnimationComplete={() => {
            setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
          }}
        />
      ))}
    </div>
  );
};

export default ChargingAnimation;
