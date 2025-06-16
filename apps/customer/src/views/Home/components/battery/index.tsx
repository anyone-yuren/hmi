'use client';

import { useTheme } from 'antd-style';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

const CircleBattery = ({ level = 15, size = 140 }) => {
  const radius = size / 2 - 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  const controls = useAnimation();
  const theme = useTheme();

  // 设置电量阈值颜色 中高低
  const lowBatteryColor = theme.colorError;
  const highBatteryColor = theme.colorSuccess;
  const midBatteryColor = theme.colorWarning;

  useEffect(() => {
    const shadowColor = level < 20 ? lowBatteryColor : level > 80 ? highBatteryColor : midBatteryColor;
    controls.start({
      filter: [
        `drop-shadow(0 0 4px ${shadowColor})`,
        `drop-shadow(0 0 8px ${shadowColor})`,
        `drop-shadow(0 0 4px ${shadowColor})`,
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
      },
    });
  }, [controls, level]);

  return (
    <div className='flex flex-col items-center relative'>
      <svg width={size} height={size}>
        {/* 背景圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='rgba(255,255,255,0.1)'
          strokeWidth='12'
          fill='transparent'
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        {/* 电量值圆环 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={level < 20 ? lowBatteryColor : level > 80 ? highBatteryColor : midBatteryColor}
          strokeWidth='12'
          fill='transparent'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap='round'
          animate={controls}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {/* 居中文字 */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold'>
        {level}%
      </div>
      <div></div>
    </div>
  );
};

export default CircleBattery;
