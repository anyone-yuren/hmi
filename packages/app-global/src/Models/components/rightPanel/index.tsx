import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../../store';
import Radar2dPanel from '../2dRadarPanel';
import ObsPanel from '../obsPanel';

const RightPanel = () => {
  const { mode } = useModelStore(
    useShallow((state) => {
      return {
        mode: state.mode,
      };
    }),
  );
  return (
    <div className='w-full h-full flex flex-col gap-2'>
      {mode === 'editor' && <Radar2dPanel />}
      {mode === 'obstacleAvoidance' && <ObsPanel />}
    </div>
  );
};
export default RightPanel;
