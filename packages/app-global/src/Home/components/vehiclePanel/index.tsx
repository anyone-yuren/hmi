import CarStage from '../CarPanel';

const VehiclePanel = () => {
  return (
    <div className='relative h-full rounded-2xl bg-white/10 border border-white/20  shadow-2xl overflow-hidden'>
      {true ? <CarStage /> : null}
    </div>
  );
};
export default VehiclePanel;
