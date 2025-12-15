import ControlView from '../controlView';
import DrawLinesSelect from '../drawLine';
import DrawPlaneSelect from '../drawPlane';
import DrawPointsSelect from '../drawPoints';
import DrawStationSelect from '../drawStation';

const DrawHandle = () => {
  return (
    <div className='top-0 left-0 w-full flex items-start justify-between gap-2 bg-[#1a1a1a] z-10 absolute font-bold'>
      <div className='flex gap-2 items-center px-2'>
        <DrawPointsSelect />
        <DrawStationSelect />
        <DrawLinesSelect />
        <DrawPlaneSelect />
      </div>
      <div className='flex gap-2 items-center px-2'>
        <ControlView />
      </div>
    </div>
  );
};

export default DrawHandle;
