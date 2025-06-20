import { useGlobalStore } from '@/store/globalStore';
import { useShallow } from 'zustand/react/shallow';
import CarStage from '../CarPanel';

const VehiclePanel = () => {
  const { showThree } = useGlobalStore(
    useShallow((state) => ({
      showThree: state.showThree,
    })),
  );
  return (
    <div className='relative h-full rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl overflow-hidden'>
      {showThree ? <CarStage /> : null}
    </div>
  );
};
export default VehiclePanel;
