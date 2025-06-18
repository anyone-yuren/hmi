import { motion } from 'framer-motion';
const BatteryInfo = () => {
  return (
    <motion.div
      className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-2xl shadow-sm shadow-teal-500/40 overflow-hidden'
      whileHover={{ scale: 1, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* 动态发光圈 */}
      {/* <motion.div
        className='absolute -inset-0.5 rounded-full bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 opacity-10 blur-xl scale-150'
        animate={{
          x: ['-20%', '20%', '-20%'],
          y: ['-40%', '20%', '-40%'],
          scale: [1.2, 1.6, 1.2],
          rotate: [60, 60, 60],
        }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', repeatType: 'reverse' }}
      /> */}

      {/* 内容 */}
      <div className='relative z-10 text-white'>
        <h2 className='text-2xl font-bold mb-1'>电池</h2>
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
        {/* <BatteryChart loading={false} /> */}
      </div>
    </motion.div>
  );
};
export default BatteryInfo;
