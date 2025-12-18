import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { IconifyIcon } from 'ui';
import Coordinates from '../coordinates';

// 3D 物体操作工具
const OperationMessage = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className='absolute bottom-0 w-full z-10 pointer-events-auto'>
      <Coordinates />
      {/* 控制按钮 */}
      <div className='absolute left-0 -top-4  cursor-pointer' onClick={() => setOpen((v) => !v)}>
        <motion.div animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.25 }}>
          <IconifyIcon icon='ep:arrow-up' size={16} />
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key='panel'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 24, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.25 },
              opacity: { duration: 0.2 },
            }}
            className='overflow-hidden shadow-md'
          >
            <div className='flex h-full bg-[#1a1a1a] text-slate-200 gap-2 items-center cursor-pointer w-full text-xs'>
              <span>操作信息:</span> <span className='italic'>移动了库位点 1</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OperationMessage;
