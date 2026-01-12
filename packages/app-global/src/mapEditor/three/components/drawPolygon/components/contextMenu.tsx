import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePolygonStore } from '../store/polygonStore';

const PolygonContextMenu = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { contextMenuPosition, setShowPolygonParamsDialog } = usePolygonStore(
    useShallow((store) => ({
      contextMenuPosition: store.contextMenuPosition,
      setShowPolygonParamsDialog: store.setShowPolygonParamsDialog,
    })),
  );
  // 点击其他位置销毁
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        ref.current.style.display = 'none';
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (!contextMenuPosition.x || !contextMenuPosition.y) {
      return;
    }
    if (ref.current) {
      ref.current.style.display = 'block';
    }
  }, [contextMenuPosition]);
  return (
    <div
      ref={ref}
      className='context-menu bg-black text-white p-2 rounded-md  min-w-16'
      style={{ position: 'absolute', left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }}
    >
      <div className='px-2 py-1 cursor-pointer hover:bg-[#333]'>删除</div>
      <div className='px-2 py-1 cursor-pointer hover:bg-[#333]'>复制</div>
      <div
        className='px-2 py-1 cursor-pointer hover:bg-[#333]'
        onClick={() => {
          setShowPolygonParamsDialog(true);
          // 关闭当前弹窗
          if (ref.current) ref.current.style.display = 'none';
        }}
      >
        属性
      </div>
    </div>
  );
};
export default PolygonContextMenu;
