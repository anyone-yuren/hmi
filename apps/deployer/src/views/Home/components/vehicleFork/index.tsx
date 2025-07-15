import { useGlobalStore } from '@/store/globalStore';
import { Typography } from 'antd';
import { useTheme } from 'antd-style';
import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';

const VehicleFork = () => {
  const theme = useTheme();
  const { showAnimate } = useGlobalStore(
    useShallow((state) => ({
      showAnimate: state.showAnimate,
    })),
  );
  return (
    <motion.div
      className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden'
      whileHover={{ scale: 1, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* 动态发光圈 */}
      {showAnimate ? (
        <motion.div
          className='absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 opacity-10 blur-3xl'
          animate={{
            x: ['-20%', '20%', '-20%'],
            y: ['-40%', '20%', '-40%'],
            scale: [1.4, 2, 1.4],
            rotate: [0, 180, 0],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut', repeatType: 'reverse' }}
        />
      ) : null}

      {/* 内容 */}
      <div className='relative z-10 h-full text-white flex flex-col'>
        <h2 className='text-lg font-bold mb-1'>货叉位置</h2>
        {showAnimate ? (
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
        ) : null}
        <div className='flex-1 grid grid-cols-3'>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title level={2}>1</Typography.Title>
            <Typography.Text className='opacity-50'>左右</Typography.Text>
          </div>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title
              style={
                {
                  // color: theme.colorPrimary,
                }
              }
              level={2}
            >
              2
            </Typography.Title>
            <Typography.Text className='opacity-50'>前后</Typography.Text>
          </div>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title level={2}>0</Typography.Title>
            <Typography.Text className='opacity-50'>上下</Typography.Text>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default VehicleFork;
