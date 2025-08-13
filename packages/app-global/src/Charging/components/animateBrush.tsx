import { Button } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Flash from './flash';
import LoadingCharging from './loadingCharging';

const AnimateBrush = (props) => {
  const [threeColor, setThreeColor] = useState('red');
  const [isBrush, setIsBrush] = useState(false);
  const [stretch, setStretch] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 小车是否正在赶路
  return (
    <div className='w-full flex flex-1 bg-black/10 relative'>
      <div className='absolute flex gap-2 p-4 z-10'>
        <Button type='primary' size='small' onClick={() => setIsBrush(true)}>
          光电触发
        </Button>
        <Button variant='solid' color='yellow' size='small' onClick={() => setThreeColor('yellow')}>
          黄灯
        </Button>
        <Button variant='solid' color='green' size='small' onClick={() => setThreeColor('green')}>
          绿灯
        </Button>
        <Button variant='solid' color='red' size='small' onClick={() => setThreeColor('red')}>
          红灯
        </Button>
        <Button variant='solid' color='red' size='small' onClick={() => setStretch(!stretch)}>
          伸缩机械臂
        </Button>
        <Button variant='solid' color='yellow' size='small' onClick={() => setIsLoading(!isLoading)}>
          准备充电
        </Button>
      </div>
      {/* 小车 */}
      <div className='flex-1 relative'>
        <div
          className='absolute top-1/4  w-1/4 h-2/3 bg-gradient-to-l from-white/40 to-white/0 [perspective:300px]'
          style={{ right: '40px' }}
        >
          <div className='w-1 h-20 bg-white/80 absolute top-1/2 -right-1'></div>
          <div className='w-1 h-20 absolute top-1/2 -right-2   bg-white/80 [clip-path:polygon(-10%_0%,100%_3%,100%_97%,-10%_100%)]'></div>
          <div
            className='absolute top-1/3 -translate-y-1/2'
            style={{
              width: '80px',
              right: '-80px',
            }}
          >
            <Flash type='car' />
          </div>
        </div>
      </div>
      {/* 刷版 */}
      <div className='flex-1 relative'>
        <div
          className='absolute top-1/4  w-1/4 h-2/3 bg-gradient-to-r from-teal-400/40 to-white/0'
          style={{ left: '40px' }}
        >
          {/* 三色灯 */}
          <div className='absolute top-2 left-2 w-6 h-16 bg-white/80 rounded-full flex flex-col justify-between items-center '>
            <div className='flex-1 flex items-center justify-between relative'>
              {threeColor === 'red' && (
                <motion.div
                  className='w-3 h-3 bg-red-500 rounded-full shadow-[0_0_30px_10px_rgba(255,0,0,0.8)]'
                  initial={{
                    opacity: 0.8,
                    scale: 1,
                  }}
                  // 动画状态
                  animate={{
                    // 透明度波动
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'loop' as const,
                  }}
                ></motion.div>
              )}
              <div className='w-3 h-3 bg-red-500 rounded-full absolute left-1/2 -translate-x-1/2'></div>
            </div>
            <div className='flex-1 flex items-center justify-between'>
              {threeColor === 'yellow' && (
                <motion.div
                  className='w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_30px_10px_rgba(255,255,0,0.8)]'
                  initial={{
                    opacity: 0.8,
                    scale: 1,
                  }}
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                ></motion.div>
              )}
              <div className='w-3 h-3 bg-yellow-500 rounded-full absolute left-1/2 -translate-x-1/2'></div>
            </div>
            <div className='flex-1 flex items-center justify-between'>
              {threeColor === 'green' && (
                <motion.div
                  className='w-3 h-3 bg-green-500 rounded-full shadow-[0_0_30px_10px_rgba(0,255,0,0.8)]'
                  initial={{
                    opacity: 0.8,
                    scale: 1,
                  }}
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                ></motion.div>
              )}
              <div className='w-3 h-3 bg-green-500 rounded-full absolute left-1/2 -translate-x-1/2'></div>
            </div>
          </div>
          {/* 充电桩机械臂 */}
          <motion.div
            initial={{ x: -16 }}
            animate={stretch ? { x: -80 } : { x: -16 }}
            transition={{ duration: 1.5 }}
            className='w-2 h-20 absolute top-1/2'
          >
            <div className='bg-white/70 w-4 h-24 absolute -top-2'></div>
            <div className='w-2 h-full bg-black/30 absolute'></div>
            <motion.div
              initial={{ width: 0 }}
              animate={stretch ? { width: 64 } : { width: 0 }}
              transition={{ duration: 1.5 }}
              className='h-2 bg-white/60 absolute top-2 left-4'
            ></motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={stretch ? { width: 64 } : { width: 0 }}
              transition={{ duration: 1.5 }}
              className='h-2 bg-white/60 absolute bottom-2 left-4'
            ></motion.div>
          </motion.div>

          <div
            className='absolute bottom-3 -translate-y-1/2'
            style={{
              width: '80px',
              left: '-80px',
            }}
          >
            <Flash type='brush' />
          </div>
        </div>
      </div>

      {isLoading && <LoadingCharging />}
    </div>
  );
};

export default AnimateBrush;
