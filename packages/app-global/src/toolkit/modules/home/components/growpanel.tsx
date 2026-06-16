import React from 'react';

const GrowPanel: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <div
      className='
        relative h-full rounded-lg text-white overflow-hidden cursor-pointer group
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        hover:scale-[1.03] hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)]
      '
    >
      {/* 左侧滑动光效 */}
      <div
        className='
          pointer-events-none absolute inset-0
          bg-[linear-gradient(transparent,rgba(0,0,0,0.1))]
          transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          group-hover:-translate-x-full z-[1]
        '
      />

      {/* 右侧滑动光效 */}
      <div
        className='
          pointer-events-none absolute inset-0
          bg-[linear-gradient(rgba(0,0,0,0.1),transparent)]
          transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          group-hover:translate-x-full z-[1]
        '
      />

      {/* 内容 */}
      {children}
    </div>
  );
};

export default GrowPanel;
