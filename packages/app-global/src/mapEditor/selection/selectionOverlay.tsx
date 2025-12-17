// SelectionOverlay.tsx
import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSelectionStore } from '../selection/selectionStore';
import { useBoxSelect } from './useBoxSelect';

export function SelectionOverlay() {
  const box = useBoxSelect();
  const { gl, camera, controls } = useThree();
  const { setCandidates, openFilter, startSelection } = useSelectionStore(
    useShallow((store) => ({
      setCandidates: store.setCandidates,
      openFilter: store.openFilter,
      startSelection: store.startSelection,
    })),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<[number, number] | null>(null);
  const endRef = useRef<[number, number] | null>(null);
  const [dragging, setDragging] = useState(false);
  const [, forceUpdate] = useState({});

  // 禁用相机平移时拖拽
  if (controls) {
    controls.enablePan = !startSelection;
  }

  // RAF / useFrame 优化拖拽矩形渲染
  useFrame(() => {
    if (dragging) forceUpdate({});
  });

  const getMousePos = (e: React.PointerEvent) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top] as [number, number];
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!startSelection) return;
    const pos = getMousePos(e);
    startRef.current = pos;
    endRef.current = pos;
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    endRef.current = getMousePos(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!startRef.current || !endRef.current) return;
    // 使用最新相机投影计算选中的对象
    const items = box.finish(startRef.current, endRef.current, e.shiftKey);
    setCandidates(items);
    openFilter();
    setDragging(false);
    startRef.current = null;
    endRef.current = null;
  };

  if (!startSelection) return null;

  const startPoint = startRef.current;
  const endPoint = endRef.current;

  // 渲染选框
  return (
    <Html fullscreen zIndexRange={[0, 100]}>
      <div
        ref={containerRef}
        className='absolute inset-0 w-full h-full'
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {dragging && startPoint && endPoint && (
          <div
            className='pointer-events-none'
            style={{
              position: 'absolute',
              left: Math.min(startPoint[0], endPoint[0]),
              top: Math.min(startPoint[1], endPoint[1]),
              width: Math.abs(endPoint[0] - startPoint[0]),
              height: Math.abs(endPoint[1] - startPoint[1]),
              border: '1px solid #3b82f6',
              backgroundColor: 'rgba(59,130,246,0.2)',
            }}
          />
        )}
      </div>
    </Html>
  );
}
