import { Canvas } from '@react-three/fiber';
import { useSize } from 'ahooks';
import { useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import CursorGuideLine from './components/cursorGuideLine';
import DrawBsline from './components/drawLine/deawBsline';
import DrawLine from './components/drawLine/draw';
import DrawPoints from './components/drawPoints/draw';
import Handles from './components/handles';
import ParamsPanel from './components/paramPanel';
import HybridManagement from './hybridmanagement';
import { SelectionOverlayBox } from './selection/selectionOverlay';
import { useMapEditorViewStore } from './store/view';
import BaseElement from './three/base';
import RenderDevice from './three/components';
import ContextMenu from './three/components/ContextMenu';
import PanelRoot from './three/components/PanelRoot';
import { SceneRaycaster } from './three/components/SceneRaycaster';
import { SlamMapFloor } from './three/components/SlamMap';
import RenderMesh from './three/components/drawArea';

const MapEditor = () => {
  const { showMapEditor } = useMapEditorViewStore(
    useShallow((state) => {
      return {
        showMapEditor: state.showMapEditor,
      };
    }),
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelBoundsRef = useRef<HTMLDivElement>(null);
  const size = useSize(wrapperRef);
  if (!showMapEditor) {
    return <HybridManagement />;
  }
  return (
    <div className='w-full h-full flex flex-col gap-2'>
      <div className='w-full h-full flex gap-2 overflow-hidden'>
        {/* 左侧区域 */}
        <div className='bg-black w-full h-full relative' ref={wrapperRef}>
          <Handles />
          {/* 按钮能正常点击 */}
          {/* Canvas 必须套一层 div 才能正确 resize */}
          <div className='absolute inset-0 ' ref={panelBoundsRef}>
            {size?.width && size?.height && (
              <Canvas
                resize={{ scroll: false, offsetSize: true }} // R3F 官方推荐的 resize 配置
                className=' w-full h-full'
                dpr={[1, 1.5]}
                gl={{
                  antialias: false,
                  stencil: false,
                  depth: true,
                  powerPreference: 'high-performance',
                }}
              >
                <BaseElement size={size} />
                <RenderDevice />
                <DrawPoints />
                <DrawLine />
                <DrawBsline />
                <CursorGuideLine />
                <RenderMesh />
                {/* <SlamPointCloud url='/static/ply/warehouse_slam.ply' /> */}
                <SlamMapFloor mapIndex={0} />
                <SelectionOverlayBox />
                <SceneRaycaster />
              </Canvas>
            )}
            <ContextMenu />
            <PanelRoot boundsRef={panelBoundsRef} /> {/* ⭐ 只渲染一次 */}
          </div>
        </div>
        {/* 右侧 panel */}
        <ParamsPanel />
      </div>
    </div>
  );
};

export default MapEditor;
