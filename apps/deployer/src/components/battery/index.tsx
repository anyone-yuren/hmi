'use client';

import { useGlobalStore } from '@/store/globalStore';
import { useVehicleStore } from '@gbeata/store';
import { useTheme } from 'antd-style';
import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const BarBattery = ({ level = 15, width = 80, height = 20 }) => {
  const { powerStatus } = useVehicleStore(
    useShallow((state) => {
      return {
        powerStatus: state.powerStatus,
      };
    }),
  );
  const { showAnimate } = useGlobalStore(
    useShallow((state) => {
      return {
        showAnimate: state.showAnimate,
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
    if (!showAnimate) {
      return;
    }
    const shadowColor =
      powerStatus.power < 20 ? lowBatteryColor : powerStatus.power > 80 ? highBatteryColor : midBatteryColor;
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
  }, [controls, powerStatus.power, showAnimate]);

  // 计算电量条宽度
  const batteryWidth = (powerStatus.power / 100) * (width - 6); // 3px padding

  const batteryColor =
    powerStatus.power < 20 ? lowBatteryColor : powerStatus.power > 80 ? highBatteryColor : midBatteryColor;

  return (
    <div className='flex flex-col items-center relative'>
      <svg width={width} height={height}>
        {/* 电池外框 */}
        <rect
          x='0'
          y='0'
          width={width - 6}
          height={height}
          rx='6'
          ry='6'
          stroke='rgba(255,255,255,1)'
          strokeWidth='2'
          fill='transparent'
        />
        {/* 电池头 */}
        <rect x={width - 4} y={height * 0.25} width='4' height={height * 0.5} ry='1' fill='rgba(255,255,255,1)' />
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
        {powerStatus.power}%
      </div>
    </div>
  );
};

export default BarBattery;
