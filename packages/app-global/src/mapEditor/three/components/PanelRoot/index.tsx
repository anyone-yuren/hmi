// PanelRoot.tsx
import { Rnd } from 'react-rnd';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorMenuStore } from '../../../store/mapMenuStore';
interface PanelRootProps {
  boundsRef: React.RefObject<Element>;
}
export default function PanelRoot({ boundsRef }: PanelRootProps) {
  const { panelVisible, panelType, hidePanel, selected } = useMapEditorMenuStore(
    useShallow((state) => ({
      panelVisible: state.panelVisible,
      panelType: state.panelType,
      hidePanel: state.hidePanel,
      selected: state.selected,
    })),
  );
  if (!panelVisible || !panelType) return null;
  return (
    <Rnd
      default={{
        x: 200,
        y: 100,
        width: 360,
        height: 240,
      }}
      minWidth={300}
      minHeight={180}
      bounds={boundsRef.current!}
      className='bg-[#1e1e1e] rounded-md shadow-lg'
      style={{ zIndex: 9998 }}
    >
      <div className='flex flex-col h-full text-white'>
        {/* 标题栏 */}
        <div className='h-10 px-3 flex items-center justify-between border-b border-[#333] cursor-move'>
          <span>{getPanelTitle(panelType)}</span>
          <span className='cursor-pointer' onClick={hidePanel}>
            ✕
          </span>
        </div>

        {/* 内容区 */}
        <div className='flex-1 p-3 overflow-auto'>{renderPanel(panelType, selected)}</div>
      </div>
    </Rnd>
  );
}

function getPanelTitle(type: string) {
  return {
    clip: '裁剪设置',
    density: '点云密度',
    focus: '聚焦 / 标定',
    calibration: '标定面板',
  }[type];
}

function renderPanel(type: string, selected: THREE.Object3D | null) {
  switch (type) {
    case 'clip':
      return <>clip panel</>;
    // return <ClipPanel target={selected} />;
    case 'density':
      return <>density panel</>;
    // return <DensityPanel target={selected} />;
    case 'focus':
      return <>focus panel</>;
    // return <FocusPanel target={selected} />;
    default:
      return null;
  }
}
