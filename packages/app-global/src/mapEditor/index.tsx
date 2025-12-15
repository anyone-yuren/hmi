import { Canvas } from '@react-three/fiber';
import { useSize } from 'ahooks';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import CursorGuideLine from './components/cursorGuideLine';
import DrawHandle from './components/draw';
import DrawPoints from './components/drawPoints/draw';
import ParamsPanel from './components/paramPanel';
import BaseElement from './three/base';

const MapEditor = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const size = useSize(wrapperRef);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className='w-full h-full flex flex-col gap-2'>
      <div className='w-full h-full flex gap-2 overflow-hidden'>
        {/* 左侧区域 */}
        <div className='bg-black w-full h-full relative' ref={wrapperRef}>
          {/* 绘制工具 */}
          <DrawHandle />
          {/* 按钮能正常点击 */}
          <Button
            className='absolute z-10 left-2 bottom-2 pointer-events-auto'
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? '展开' : '收起'}
          </Button>

          {/* Canvas 必须套一层 div 才能正确 resize */}
          <div className='absolute inset-0 pointer-events-none'>
            {size?.width && size?.height && (
              <Canvas
                resize={{ scroll: false, offsetSize: true }} // R3F 官方推荐的 resize 配置
                className=' w-full h-full'
                onPointerMove={(e) => {
                  console.log(e);
                  // 获取当前鼠标三维中的坐标位置
                }}
              >
                <BaseElement size={size} />

                <DrawPoints />
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
