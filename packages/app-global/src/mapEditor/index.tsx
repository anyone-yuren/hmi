import { Canvas } from '@react-three/fiber';
import { useSize } from 'ahooks';
import { useRef } from 'react';
import CursorGuideLine from './components/cursorGuideLine';
import DrawBsline from './components/drawLine/deawBsline';
import DrawLine from './components/drawLine/draw';
import DrawPoints from './components/drawPoints/draw';
import Handles from './components/handles';
import ParamsPanel from './components/paramPanel';
import BaseElement from './three/base';
import RenderDevice from './three/components';

const MapEditor = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const size = useSize(wrapperRef);
  return (
    <div className='w-full h-full flex flex-col gap-2'>
      <div className='w-full h-full flex gap-2 overflow-hidden'>
        {/* 左侧区域 */}
        <div className='bg-black w-full h-full relative' ref={wrapperRef}>
          <Handles />
          {/* 按钮能正常点击 */}
          {/* Canvas 必须套一层 div 才能正确 resize */}
          <div className='absolute inset-0 '>
            {size?.width && size?.height && (
              <Canvas
                resize={{ scroll: false, offsetSize: true }} // R3F 官方推荐的 resize 配置
                className=' w-full h-full'
              >
                <BaseElement size={size} />
                <RenderDevice />
                <DrawPoints />
                <DrawLine />
                <DrawBsline />
                <CursorGuideLine />
              </Canvas>
            )}
          </div>
        </div>
        {/* 右侧 panel */}
        <ParamsPanel />
      </div>
    </div>
  );
};

export default MapEditor;
