import { CloseOutlined, HistoryOutlined } from '@ant-design/icons';
import { Button, List, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import { useAutoCompileStore } from '../store';

const { Text, Title } = Typography;

const HistoryPanel = () => {
  const historyVisible = useAutoCompileStore((state) => state.historyVisible);
  const setHistoryVisible = useAutoCompileStore(
    (state) => state.setHistoryVisible,
  );
  const history = useAutoCompileStore((state) => state.history);
  const selectHistory = useAutoCompileStore((state) => state.selectHistory);
  const selectedHistoryId = useAutoCompileStore(
    (state) => state.selectedHistoryId,
  );

  return (
    <AnimatePresence>
      {historyVisible && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          // transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className='absolute top-0 right-0 h-full w-[350px] bg-black shadow-2xl shadow-neutral-700 z-20 flex flex-col'
        >
          <div className='p-4 shadow-sm flex justify-between items-center bg-white/20'>
            <div className='flex items-center gap-2'>
              <HistoryOutlined />
              <Title level={5} className='!mb-0'>
                构建历史
              </Title>
            </div>
            <Button
              type='text'
              icon={<CloseOutlined />}
              onClick={() => setHistoryVisible(false)}
            />
          </div>

          <div className='flex-1 overflow-y-auto p-4'>
            <List
              dataSource={history}
              renderItem={(item) => (
                <div
                  key={item.id}
                  onClick={() => selectHistory(item.id)}
                  className={`mb-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedHistoryId === item.id
                      ? 'border-blue-500 bg-blue-50/80'
                      : 'border-gray-500 bg-white/20'
                  }`}
                >
                  <div className='flex justify-between items-start mb-2'>
                    <Text strong>
                      {dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                    <Tag
                      color={item.status === 'success' ? 'success' : 'error'}
                    >
                      {item.status === 'success' ? '成功' : '失败'}
                    </Tag>
                  </div>
                  <div className='flex justify-between text-gray-500 text-sm'>
                    <span>耗时: {item.duration}</span>
                    <span>ID: {item.id.slice(-6)}</span>
                  </div>
                </div>
              )}
            />
            {history.length === 0 && (
              <div className='text-center text-gray-400 mt-10'>
                暂无构建记录
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HistoryPanel;
