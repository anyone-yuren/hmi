import { Typography } from 'antd';
import { motion } from 'framer-motion';
import ProgressBar from './progressBar';

const ElectricInfo = () => {
  return (
    <motion.div
      className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-2xl shadow-sm shadow-teal-500/40 overflow-hidden'
      whileHover={{ scale: 1, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* 内容 */}
      <div className='relative z-10 text-white h-full flex flex-col'>
        <h2 className='text-2xl font-bold mb-1'>电控箱</h2>
        <motion.div
          initial={{ width: '40px', opacity: 0.2 }}
          animate={{
            width: '160px',
            opacity: 1,
          }}
          transition={{
            duration: 3,
            ease: 'easeInOut',
          }}
          className='h-[1px] bg-gradient-to-r from-teal-500 to-purple-500/0 rounded-full'
        />
        <div className='flex flex-1 flex-col gap-2 py-2 overflow-y-auto'>
          <div className='grid grid-cols-3 gap-4 items-center'>
            <Typography.Title level={5} className='flex-1 text-nowrap !m-0'>
              中央控制器（月）
            </Typography.Title>
            <ProgressBar className='col-span-2' min={0} max={100} value={55} height={12} />
          </div>
          <div className='grid grid-cols-3 gap-4 items-center'>
            <Typography.Title level={5} className='flex-1 text-nowrap !m-0'>
              通讯模块（月）
            </Typography.Title>
            <ProgressBar className='col-span-2' min={0} max={100} value={15} height={12} />
          </div>
          <div className='grid grid-cols-3 gap-4 items-center'>
            <Typography.Title level={5} className='flex-1 text-nowrap !m-0'>
              工业交换机（月）
            </Typography.Title>
            <ProgressBar className='col-span-2' min={0} max={100} value={75} height={12} />
          </div>
          <div className='grid grid-cols-3 gap-4 items-center'>
            <Typography.Title level={5} className='flex-1 text-nowrap !m-0'>
              散热风扇（月）
            </Typography.Title>
            <ProgressBar className='col-span-2' min={0} max={100} value={25} height={12} />
          </div>
          <div className='grid grid-cols-3 gap-4 items-center'>
            <Typography.Title level={5} className='col-span-1 text-nowrap !m-0'>
              控制面板开关（月）
            </Typography.Title>
            <ProgressBar className='col-span-2' min={0} max={100} value={50} height={12} />
          </div>
          <div className='grid grid-cols-3 gap-4 items-center'>
            <Typography.Title level={5} className='flex-1 text-nowrap !m-0'>
              天线（月）
            </Typography.Title>
            <ProgressBar className='col-span-2' min={0} max={100} value={45} height={12} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default ElectricInfo;
