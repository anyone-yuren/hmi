import { motion } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../../Models/store';

interface ScanLoadingProps {
  size?: number;
  text?: string;
}

export default function ScanLoading() {
  const { isOffsetTable, showMapLoading } = useModelStore(
    useShallow((store) => {
      return {
        isOffsetTable: store.isOffsetTable,
        showMapLoading: store.showMapLoading,
      };
    }),
  );
  if (!isOffsetTable || !showMapLoading) return null;
  return (
    <div className='flex flex-col items-center justify-center gap-4 absolute w-full h-full left-0 top-0 z-50'>
      <motion.div
        className='
          absolute inset-0
          backdrop-blur-md
        '
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* 扫描框 */}
      <div className='absolute inset-0 border border-[#00d1d1]/40 rounded-md' />

      {/* 四角 */}
      {[
        'top-0 left-0 border-t-4 border-l-4',
        'top-0 right-0 border-t-4 border-r-4',
        'bottom-0 left-0 border-b-4 border-l-4',
        'bottom-0 right-0 border-b-4 border-r-4',
      ].map((pos, i) => (
        <span
          key={i}
          className={`absolute w-6 h-6 border-[#00d1d1]/40 ${pos}`}
        />
      ))}

      {/* 扫描线 */}
      <motion.div
        className='absolute left-0 right-0 h-40 bg-gradient-to-t from-[#00d1d1]/20 via-[#00d1d1]/10 to-transparent '
        animate={{
          top: ['-10%', '100%'],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* 扫描光效 */}
      <motion.div
        className='absolute inset-0 bg-gradient-to-b from-green-400/10 via-transparent to-transparent'
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />
    </div>
  );
}
