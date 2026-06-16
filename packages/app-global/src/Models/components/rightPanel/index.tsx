import { useShallow } from 'zustand/react/shallow';
import { useModelStore } from '../../store';
import BodyPanel from '../../threeComponent/PanelRoot/BodyPanel';
import ForkPanel from '../../threeComponent/PanelRoot/ForkPanel';
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
      {modelSelect === 'radar1' && mode === 'editor' && <Radar2dPanel />}
      {modelSelect === 'topCamera' && mode === 'editor' && <CameraPanel />}
      {modelSelect === 'fork' && mode === 'editor' && <ForkPanel />}
      {modelSelect === 'body' && mode === 'editor' && <BodyPanel />}
      {mode === 'obstacleAvoidance' && <ObsPanel />}
      {mode === 'diagnosis' && <DiagnosisPanel />}
    </div>
  );
};
export default RightPanel;
