import { Typography } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useWorkflowStore } from '../store/useWorkflowStore';

const { Title } = Typography;

const HistoryPanel = () => {
  const history = useWorkflowStore((state) => state.history);
  const jumpToHistory = useWorkflowStore((state) => state.jumpToHistory);
  const showHistory = useWorkflowStore((state) => state.showHistory);
  const setShowHistory = useWorkflowStore((state) => state.setShowHistory);
  return (
    <>
      {/* Toggle Button in Toolbar Area (Absolute positioning relative to parent container) */}

      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='absolute bottom-0 left-0 right-0 z-10 h-32 border-t border-gray-700 bg-[#1f1f1f] text-gray-200 shadow-xl'
          >
            <div className='flex h-full flex-col'>
              <div className='flex items-center justify-between border-b border-gray-700 p-3'>
                <div className='flex items-center gap-4'>
                  <Title level={5} style={{ margin: 0, color: '#e5e7eb' }}>
                    操作历史
                  </Title>
                  <div className='text-xs text-gray-500'>
                    Undo: {history.past.length} | Redo: {history.future.length}
                  </div>
                </div>
                <span
                  className='cursor-pointer text-gray-400 hover:text-white'
                  onClick={() => setShowHistory(false)}
                >
                  ✕
                </span>
              </div>
              <div className='flex-1 overflow-y-auto p-4'>
                <div className='flex flex-col gap-2'>
                  {/* Current State */}
                  <div className='rounded border border-[#00d1d1] bg-[#2a2a2a] p-1 text-sm text-[#00d1d1] font-medium'>
                    当前状态 (最新)
                  </div>

                  {/* Past History */}
                  {[...history.past].reverse().map((state, index) => {
                    const originalIndex = history.past.length - 1 - index;
                    return (
                      <div
                        key={`past-${originalIndex}`}
                        className='cursor-pointer rounded bg-[#2a2a2a] p-1 text-sm text-gray-400 hover:bg-[#333] hover:text-gray-200 transition-colors'
                        onClick={() => jumpToHistory(originalIndex)}
                      >
                        操作记录 {originalIndex + 1}
                        <span className='ml-2 text-xs text-gray-600'>
                          ({state.nodes.length} 节点, {state.edges.length} 连线)
                        </span>
                      </div>
                    );
                  })}

                  {history.past.length === 0 && (
                    <div className='text-center text-xs text-gray-600 py-4'>
                      暂无历史记录
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HistoryPanel;
