'use client';

import { useVehicleStore } from '@/store/vehicleStore';
import { useTheme } from 'antd-style';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const BarBattery = ({ level = 15, width = 80, height = 20 }) => {
  const { power } = useVehicleStore(
    useShallow((state) => {
      return {
        power: state.power,
      };
    }),
  );
  const controls = useAnimation();
  const theme = useTheme();

  // 设置电量阈值颜色 中高低
  const lowBatteryColor = theme.colorError;
  const highBatteryColor = theme.colorSuccess;
  const midBatteryColor = theme.colorWarning;

  useEffect(() => {
    const shadowColor = power < 20 ? lowBatteryColor : power > 80 ? highBatteryColor : midBatteryColor;
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
  }, [controls, power]);

  // 计算电量条宽度
  const batteryWidth = (power / 100) * (width - 6); // 3px padding

  const batteryColor = power < 20 ? lowBatteryColor : power > 80 ? highBatteryColor : midBatteryColor;

  return (
    <div className='flex flex-col items-center relative'>
      <svg width={width} height={height}>
        {/* 电池外框 */}
        <rect
          x='0'
          y='0'
          width={width - 4}
          height={height}
          rx='6'
          ry='6'
          stroke='rgba(255,255,255,0.2)'
          strokeWidth='2'
          fill='transparent'
        />
        {/* 电池头 */}
        <rect x={width - 4} y={height * 0.25} width='4' height={height * 0.5} rx='1' fill='rgba(255,255,255,0.2)' />
        {/* 电量值条 */}
        <motion.rect
          x='2'
          y='2'
          width={batteryWidth}
          height={height - 4}
          rx='4'
          fill={batteryColor}
          animate={controls}
        />
      </svg>
      {/* 电量百分比文字 */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-sm font-semibold'>
        {power}%
      </div>
    </div>
  );
};

export default BarBattery;
