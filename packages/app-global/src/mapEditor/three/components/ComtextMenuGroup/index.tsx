import { Rnd } from 'react-rnd';
import { useShallow } from 'zustand/react/shallow';
import AreaContextMenu from '../drawArea/components/contextMenu';
import { useAreaStore } from '../drawArea/store/areaStore';
import PolygonContextMenu from '../drawPolygon/components/contextMenu';
import { usePolygonStore } from '../drawPolygon/store/polygonStore';
import AreaParams from './modules/areaParams';
import BatchGenerateDialog from './modules/batchGenerateDialog';
interface PanelRootProps {
  boundsRef: React.RefObject<Element>;
}
const ContextMenuGroup = ({ boundsRef }: PanelRootProps) => {
  const { selectedIds, showAreaParamsDialog, contextMenuPosition, setShowAreaParamsDialog } = useAreaStore(
    useShallow((store) => ({
      selectedIds: store.selectedIds,
      showAreaParamsDialog: store.showAreaParamsDialog,
      setShowAreaParamsDialog: store.setShowAreaParamsDialog,
      contextMenuPosition: store.contextMenuPosition,
    })),
  );

  const {
    selectedIds: selectedPolygonIds,
    showPolygonParamsDialog,
    contextMenuPosition: polygonContextMenuPosition,
    setShowPolygonParamsDialog,
  } = usePolygonStore(
    useShallow((store) => ({
      selectedIds: store.selectedIds,
      showPolygonParamsDialog: store.showPolygonParamsDialog,
      contextMenuPosition: store.contextMenuPosition,
      setShowPolygonParamsDialog: store.setShowPolygonParamsDialog,
    })),
  );

  return (
    <>
      <AreaContextMenu />
      <PolygonContextMenu />
      <BatchGenerateDialog
        boundsRef={boundsRef}
        contextMenuPosition={contextMenuPosition}
        setShowAreaParamsDialog={setShowAreaParamsDialog}
      />
      {showAreaParamsDialog && (
        <Rnd
          default={{
            x: contextMenuPosition?.x ?? 200 + 20,
            y: contextMenuPosition?.y ?? 100 + 20,
            width: 360,
            height: 240,
          }}
          minWidth={240}
          minHeight={180}
          bounds={boundsRef.current!}
          className='bg-[#1e1e1e] rounded-md shadow-lg'
          style={{ zIndex: 1000 }}
        >
          <div className='flex flex-col h-full text-white'>
            {/* 标题栏 */}
            <div className='h-10 px-3 flex items-center justify-between border-b border-[#333] cursor-move'>
              <span>区域属性</span>
              <span
                className='cursor-pointer'
                onClick={() => {
                  setShowAreaParamsDialog(!showAreaParamsDialog);
                }}
              >
                ✕
              </span>
            </div>

            {/* 内容区 */}
            <div className='flex-1 p-3 overflow-auto'>
              <AreaParams />
            </div>
          </div>
        </Rnd>
      )}
    </>
  );
};
export default ContextMenuGroup;
