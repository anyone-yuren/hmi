import { Button } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';

const AnimateBrush = () => {
  const [threeColor, setThreeColor] = useState('red');
  return (
    <div className='w-full flex flex-1 bg-black/10 relative'>
      <div className='absolute flex gap-2 p-4 z-10'>
        <Button type='primary' size='small'>
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
      </div>
      {/* 小车 */}
      <div className='flex-1 relative'>
        <div className='absolute top-1/4 right-8 w-1/4 h-2/3 bg-gradient-to-l from-white/40 to-white/0 [perspective:300px]'>
          <div className='w-1 h-20 bg-white/80 absolute top-1/2 -right-1'></div>
          <div className='w-1 h-20 absolute top-1/2 -right-2   bg-white/80 [clip-path:polygon(-10%_0%,100%_3%,100%_97%,-10%_100%)]'></div>
        </div>
      </div>
      {/* 刷版 */}
      <div className='flex-1 relative'>
        <div className='absolute top-1/4 left-8 w-1/4 h-2/3 bg-gradient-to-r from-teal-400/40 to-white/0'>
          {/* 三色灯 */}
          <div className='absolute top-2 left-2 w-6 h-16 bg-white/80 rounded-full flex flex-col justify-between items-center '>
            <div className='flex-1 flex items-center justify-between relative'>
              {threeColor === 'red' && (
                <motion.div
                  className='w-3 h-3 bg-red-500 rounded-full'
                  initial={{
                    opacity: 0.8,
                    scale: 1,
                    boxShadow: '0 0 10px rgba(255, 0, 6, 1)', // 初始阴影
                  }}
                  // 动画状态
                  animate={{
                    // 透明度波动
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.3, 1],
                    // 阴影扩散实现发光效果
                    boxShadow: [
                      '0 0 10px rgba(255, 0, 6, 0.7)',
                      '0 0 20px rgba(255, 0, 6, 1)',
                      '0 0 30px rgba(255, 0, 6, 0.7)',
                    ],
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
                  className='w-3 h-3 bg-yellow-500 rounded-full'
                  initial={{
                    opacity: 0.8,
                    scale: 1,
                    boxShadow: '0 0 10px rgba(255, 255, 0, 1)', // 初始阴影
                  }}
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      '0 0 10px rgba(255, 255, 0, 0.7)',
                      '0 0 20px rgba(255, 255, 0, 1)',
                      '0 0 30px rgba(255, 255, 0, 0.7)',
                    ],
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
                  className='w-3 h-3 bg-green-500 rounded-full'
                  initial={{
                    opacity: 0.8,
                    scale: 1,
                    boxShadow: '0 0 10px rgba(0, 255, 0, 1)', // 初始阴影
                  }}
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      '0 0 10px rgba(0, 255, 0, 0.7)',
                      '0 0 20px rgba(0, 255, 0, 1)',
                      '0 0 30px rgba(0, 255, 0, 0.7)',
                    ],
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
          <div className='w-2 h-20 absolute top-1/2 -left-4'>
            <div className='bg-white/70 w-4 h-24 absolute -top-2'></div>
            <div className='w-2 h-full bg-black'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimateBrush;
