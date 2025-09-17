// Accordion.tsx
import { RightOutlined } from '@ant-design/icons';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

type AccordionProps = {
  id?: string;
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export const Line1px = () => {
  return (
    <div className='w-full h-px bg-gradient-to-r from-white/0 via-[#e3e3e3] to-white/0 absolute bottom-0 left-0'></div>
  );
};

export default function Accordion({ id, title, children, defaultOpen = false, className }: AccordionProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const contentId = id ?? `accordion-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={className}>
      <motion.button
        type='button'
        className='w-full p-0 text-left bg-transparent rounded-md focus:outline-none'
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-controls={contentId}
        layout
        style={{
          cursor: 'pointer',
        }}
      >
        <div className='flex items-center justify-between w-full relative'>
          {title}
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ display: 'inline-block' }}
          >
            <RightOutlined />
          </motion.span>
          <Line1px />
        </div>
        {/* 简单旋转图标 */}
      </motion.button>

      {/* 内容区：使用 AnimatePresence + 动态高度动画 */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key='content'
            id={contentId}
            role='region'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
