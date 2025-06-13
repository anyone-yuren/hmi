import { motion } from 'framer-motion';

const VehicleInfo = () => {
  return (
    <motion.div
      className='relative h-full p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl overflow-hidden'
      whileHover={{ scale: 1, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* 动态发光圈 */}
      <motion.div
        className='absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 opacity-10 blur-3xl'
        animate={{ x: ['-20%', '20%', '-20%'], y: ['-40%', '20%', '-40%'], scale: [1.4, 2, 1.4], rotate: [0, 180, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut', repeatType: 'reverse' }}
      />

      {/* 内容 */}
      <div className='relative z-10 text-white'>
        <h2 className='text-2xl font-bold mb-2'>车辆信息</h2>
        <p className='text-white/80'>谁给你一袋米哟，辛辣天赛</p>
      </div>
    </motion.div>
  );
};
export default VehicleInfo;
