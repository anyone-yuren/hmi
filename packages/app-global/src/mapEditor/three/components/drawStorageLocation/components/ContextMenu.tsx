import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../../store';
import { useStorageLocationStore } from '../store/storageLocationStore';

const StorageLocationContextMenu = () => {
  const ref = useRef<HTMLDivElement>(null);
  const {
    contextMenuPosition,
    setContextMenuPosition,
    setShowBindVehicleDialog,
    setShowShelfConfigDialog,
    removeStorageLocation,
    selectedIds,
  } = useStorageLocationStore(
    useShallow((store) => ({
      contextMenuPosition: store.contextMenuPosition,
      setContextMenuPosition: store.setContextMenuPosition,
      setShowBindVehicleDialog: store.setShowBindVehicleDialog,
      setShowShelfConfigDialog: store.setShowShelfConfigDialog,
      removeStorageLocation: store.removeStorageLocation,
      selectedIds: store.selectedIds,
    })),
  );

  const { staticPoints, setStaticPoints } = useMapEditorStore(
    useShallow((state) => ({
      staticPoints: state.staticPoints,
      setStaticPoints: state.setStaticPoints,
    })),
  );

  // Close when clicking elsewhere
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setContextMenuPosition(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [setContextMenuPosition]);

  if (!contextMenuPosition) return null;

  return (
    <div
      ref={ref}
      className='context-menu bg-black text-white p-2 rounded-md min-w-32 z-[9999]'
      style={{
        position: 'fixed', // Fixed because we used clientX/Y
        left: contextMenuPosition.x + 'px',
        top: contextMenuPosition.y + 'px',
      }}
    >
      <div
        className='px-2 py-1 cursor-pointer hover:bg-[#333]'
        onClick={() => {
          setShowBindVehicleDialog(true);
          setContextMenuPosition(null);
        }}
      >
        绑定车型
      </div>
      <div
        className='px-2 py-1 cursor-pointer hover:bg-[#333]'
        onClick={() => {
          setShowShelfConfigDialog(true);
          setContextMenuPosition(null);
        }}
      >
        添加货架库位
      </div>
      <div
        className='px-2 py-1 cursor-pointer hover:bg-[#333] text-red-500'
        onClick={() => {
          // Remove associated parking points for all selected locations
          const newStaticPoints = staticPoints.filter(
            (p) => !selectedIds.includes(p.storageLocationId || ''),
          );
          setStaticPoints(newStaticPoints);

          // Remove locations
          selectedIds.forEach((id) => removeStorageLocation(id));
          setContextMenuPosition(null);
        }}
      >
        删除
      </div>
    </div>
  );
};

export default StorageLocationContextMenu;
