import classNames from 'classnames';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../../../store';
import { useStorageLocationStore } from '../../../../../three/components/drawStorageLocation/store/storageLocationStore';

const DrawStorageLocationSelect = () => {
  const { selectDrawType, setSelectDrawType, setParamsPanelCollapsed } =
    useMapEditorStore(
      useShallow((state) => ({
        selectDrawType: state.selectDrawType,
        setSelectDrawType: state.setSelectDrawType,
        setParamsPanelCollapsed: state.setParamsPanelCollapsed,
      })),
    );

  const { setMode } = useStorageLocationStore(
    useShallow((state) => ({
      setMode: state.setMode,
    })),
  );

  const isActive = selectDrawType === 'storageLocation';

  const handleClick = () => {
    setSelectDrawType('storageLocation');
    setMode('draw-storage-location');
    setParamsPanelCollapsed(false);
  };

  return (
    <div
      className={classNames(
        'flex gap-0.5 px-1 items-center cursor-pointer text-white hover:bg-[#00d1d1]/20 rounded-md',
        {
          'bg-[#00d1d1]/60': isActive,
        },
      )}
      onClick={handleClick}
    >
      <IconifyIcon icon='mdi:warehouse' size={16} />
      <span>库位</span>
    </div>
  );
};

export default DrawStorageLocationSelect;
