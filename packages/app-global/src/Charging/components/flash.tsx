import { motion } from 'framer-motion';
interface FlashProps {
  type: string;
}

const Flash = (props: FlashProps) => {
  const { type } = props;
  const shadow =
    type === 'car' ? 'shadow-[0_0_4px_2px_rgba(255,255,255,0.4)]' : 'shadow-[0_0_10px_2px_rgba(255,255,255,0.4)]';

  return (
    <>
      <motion.div
        className={`relative w-full h-1 top-1 bg-gradient-to-r  z-40 ${type === 'car' ? 'from-red-500/80 to-white/0' : 'to-red-500/80 from-white/0'}`}
        animate={{
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {new Array(10).fill(0).map((_, index) => (
          <motion.div
            key={index}
            className={`absolute w-[2px] h-[2px] top-1/2 -translate-y-1/2 rounded-full`}
            style={{
              backgroundColor: type === 'car' ? 'red' : 'red',
            }}
            initial={{ left: type === 'car' ? '0%' : '100%', opacity: 1 }}
            animate={{ left: type === 'car' ? '100%' : '0%', opacity: 0 }}
            transition={{
              duration: 3, // 每个点从左到右的时间
              delay: index * 0.3, // 每个点依次延迟
              repeat: Infinity,
              ease: 'linear', // 匀速流动
            }}
          />
        ))}
      </motion.div>
    </>
  );
};

export default Flash;
