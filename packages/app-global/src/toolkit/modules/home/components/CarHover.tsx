// CardHover.tsx
import React from 'react';

interface CardHoverProps {
  children: React.ReactNode;
  bgColor?: string;
}

const CardHover: React.FC<CardHoverProps> = ({ children, bgColor }) => {
  return (
    <div
      className='
        relative block max-w-[262px] p-2 bg-white/5 backdrop-blur-md
        rounded-md overflow-hidden z-0 group
        transition-all group/card
      '
    >
      {/* 扩散圆 */}
      <span
        className={`
          absolute -top-8 right-[-16px] w-8 h-8 ${bgColor || 'bg-[#00838d]'}
          rounded-full scale-100 origin-center
          transition-transform duration-300 ease-out
          z-[-1]
          group-hover:scale-[21]
        '`}
      ></span>
      {children}
    </div>
  );
};

export default CardHover;
