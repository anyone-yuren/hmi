import { useShallow } from 'zustand/react/shallow';
import { useMapEditorViewStore } from '../../../store/view';
import AutoDoor from './autoDoor';
import Elevator from './elevator';

const DeviceIconGroup = () => {
  const { devicesView } = useMapEditorViewStore(
    useShallow((s) => ({
      devicesView: s.devicesView as Array<'elevator' | 'autoDoor'>,
    })),
  );
  return (
    <group>
      {devicesView?.includes('elevator') && <Elevator />}
      {devicesView?.includes('autoDoor') && <AutoDoor />}
    </group>
  );
};
export default DeviceIconGroup;
