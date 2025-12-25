import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../../store';
import Radar2dPanel from '../2dRadarPanel';
import ObsPanel from '../obsPanel';
import CameraPanel from './cameraPanel';
import DiagnosisPanel from './diagnosisPanel';

const RightPanel = () => {
  const { modelSelect, mode } = useModelStore(
    useShallow((state) => {
      return {
        modelSelect: state.modelSelect,
        mode: state.mode,
      };
    }),
  );
  return (
    <div className='w-full h-full flex flex-col gap-2'>
      {modelSelect === 'radar1' && <Radar2dPanel />}
      {modelSelect === 'topCamera' && <CameraPanel />}
      {mode === 'obstacleAvoidance' && <ObsPanel />}
      {mode === 'diagnosis' && <DiagnosisPanel />}
    </div>
  );
};
export default RightPanel;
