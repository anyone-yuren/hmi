import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAreaStore } from '../store/areaStore';

const AreaContextMenu = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { contextMenuPosition, setShowAreaParamsDialog, setShowBatchGenerateDialog } = useAreaStore(
    useShallow((store) => ({
      contextMenuPosition: store.contextMenuPosition,
      setShowAreaParamsDialog: store.setShowAreaParamsDialog,
      setShowBatchGenerateDialog: store.setShowBatchGenerateDialog,
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
      <div className='px-2 py-1 cursor-pointer hover:bg-[#333]'>批量修改点</div>
      <div
        className='px-2 py-1 cursor-pointer hover:bg-[#333]'
        onClick={() => {
          setShowBatchGenerateDialog(true);
          // 关闭当前弹窗
          if (ref.current) ref.current.style.display = 'none';
        }}
      >
        批量生成库位
      </div>
      <div
        className='px-2 py-1 cursor-pointer hover:bg-[#333]'
        onClick={() => {
          setShowAreaParamsDialog(true);
          // 关闭当前弹窗
          if (ref.current) ref.current.style.display = 'none';
        }}
      >
        属性
      </div>
    </div>
  );
};
export default AreaContextMenu;
