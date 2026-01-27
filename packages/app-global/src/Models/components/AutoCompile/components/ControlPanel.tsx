import { Progress, Typography } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useAutoCompileStore } from '../store';

const { Text } = Typography;

const ControlPanel = () => {
  const progress = useAutoCompileStore((state) => state.progress);
  const isCompiling = useAutoCompileStore((state) => state.isCompiling);

  return (
    <AnimatePresence>
      {isCompiling && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className='absolute bottom-10 left-1/2 w-[600px] bg-black p-4 rounded-lg shadow-lg border border-gray-600 z-10'
        >
          <div className='flex items-center gap-4'>
            <Text strong className='whitespace-nowrap'>
              编译进度
            </Text>
            <Progress
              percent={progress}
              status={isCompiling ? 'active' : 'normal'}
              strokeColor='#00d1d1'
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ControlPanel;
