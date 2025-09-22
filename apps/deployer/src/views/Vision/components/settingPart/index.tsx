import { memo } from 'react';
import CargoState from './cargoState/index';
import VisionPick from './visionPick/index';
import VisionStock from './visionStock/index';

import TruckLoad from './truckload/index';

const SettingPart = () => {
  return (
    <>
      <div className='flex flex-wrap flex-col h-full w-full gap-[20px] pr-[20px]'>
        <VisionPick></VisionPick>
        <CargoState></CargoState>
        <VisionStock></VisionStock>
        <TruckLoad></TruckLoad>
      </div>
    </>
  );
};

export default memo(SettingPart);
