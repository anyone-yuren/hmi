'use client';

import { useGlobalStore } from '@gbeata/store';
import { useTheme } from 'antd-style';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
interface ProgressBarProps {
  min: number;
  max: number;
  value: number;
  height?: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ min, max, value, height = 20, className }) => {
  const { showAnimate } = useGlobalStore(
    useShallow((state) => ({
      showAnimate: state.showAnimate,
    })),
  );
  const theme = useTheme();
  const controls = useAnimation();
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(0);

  // 动态计算百分比和值
  const percent = Math.min(Math.max(value, min), max) / (max - min);
  const progressWidth = percent * width;

  // 百分比决定颜色
  const color = useMemo(() => {
    if (percent <= 0.3) return theme.colorPrimary;
    if (percent <= 0.7) return theme.colorWarning;
    return theme.colorError;
  }, [percent]);

  // 呼吸发光动画
  useEffect(() => {
    if (!showAnimate) {
      return;
    }
    controls.start({
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    });
  }, [controls, showAnimate]);

  // 监听容器宽度变化
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className={className + 'relative w-full'}>
      {/* 上方当前值 */}
      <div
        className='absolute -translate-x-1/2 text-sm font-medium z-10'
        style={{
          left: `${progressWidth}px`,
          color: 'white',
        }}
      >
        {value}
      </div>

      {/* 进度条 */}
      <div className='flex items-center gap-2'>
        <span>{min}</span>
        <svg ref={svgRef} width='100%' height={height} className='overflow-visible'>
          {/* 背景线 */}
          <line
            x1={0}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke='#333'
            strokeWidth={height}
            strokeLinecap='round'
            opacity={0.2}
          />

          {/* 进度线 */}
          <motion.line
            x1={0}
            y1={height / 2}
            x2={progressWidth}
            y2={height / 2}
            stroke={color}
            strokeWidth={height}
            strokeLinecap='round'
            animate={controls}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>

        <span>{max}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
