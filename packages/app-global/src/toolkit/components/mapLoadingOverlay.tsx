import { motion } from 'framer-motion';

interface Props {
  visible?: boolean;
  text?: string;
}

export default function PointCloudLoadingOverlay({
  visible = true,
  text = '点云数据加载中…',
}: Props) {
  if (!visible) return null;

  return (
    <div className='pointer-events-none absolute inset-0 z-20'>
      {/* 🌫 呼吸毛玻璃背景 */}
      <motion.div
        className='
          absolute inset-0
          backdrop-blur-md
          bg-gradient-to-br
          from-black/40 via-black/20 to-black/40
        '
        animate={{
          opacity: [0.3, 0.55, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 🔦 左 → 右 扫描光束 */}
      <motion.div
        className='
          absolute top-0 bottom-0 w-1/3
          bg-gradient-to-r
          from-transparent via-cyan-400/40 to-transparent
          blur-xl
        '
        initial={{ x: '-40%' }}
        animate={{ x: '140%' }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* 🔦 右 → 左 扫描光束 */}
      <motion.div
        className='
          absolute top-0 bottom-0 w-1/3
          bg-gradient-to-l
          from-transparent via-blue-400/30 to-transparent
          blur-xl
        '
        initial={{ x: '140%' }}
        animate={{ x: '-40%' }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* 📝 呼吸文字 */}
      <motion.div
        className='
          absolute bottom-8 left-1/2 -translate-x-1/2
          text-xs tracking-widest text-cyan-300
        '
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {text}
      </motion.div>
    </div>
  );
}
