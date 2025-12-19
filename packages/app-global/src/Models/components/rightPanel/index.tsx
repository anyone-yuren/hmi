import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../../store';
import Radar2dPanel from '../2dRadarPanel';
import ObsPanel from '../obsPanel';
import DiagnosisPanel from './diagnosisPanel';

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
      {mode === 'diagnosis' && <DiagnosisPanel />}
    </div>
  );
};
export default RightPanel;
