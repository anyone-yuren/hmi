import bg from '@/assets/img/bg.png';
import { Skeleton } from 'antd';
import { useResponsive } from 'antd-style';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import VehicleControl from './components/vehicleControl';
import VehicleFork from './components/vehicleFork';
import VehiclePanel from './components/vehiclePanel';
import VehicleStatus from './components/vehicleStatus';
import VehicleTask from './components/vehicleTask';
import WsContainer from './components/wsContainer';

const Home = () => {
  const { t } = useTranslation();
  const responsive = useResponsive();
  const navigate = useNavigate();
  return (
    <div
      className='flex flex-col h-full w-full justify-between '
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='flex flex-1 flex-col overflow-y-auto gap-4 h-full p-4'>
        <div className='gap-4 w-full grid grid-cols-3 flex-1'>
          <div className='col-span-2 flex gap-4 flex-col'>
            <div className='flex-1'>
              <Suspense fallback={<Skeleton.Button active className='!h-full !w-full' />}>
                <VehiclePanel />
              </Suspense>
            </div>
            <div className='h-[200px] flex gap-4'>
              <div className='flex-1'>
                <Skeleton.Node active className='!h-full !w-full' />
              </div>
            </div>
          </div>
          <div className='col-span-1 flex flex-col h-full gap-4'>
            <div className='flex-1'>
              {/* <Skeleton.Node active className='!h-full !w-full' /> */}
              <VehicleStatus />
            </div>
            <div className='flex-1'>
              {/* <Skeleton.Node active className='!h-full !w-full' /> */}
              <VehicleControl />
            </div>
            <div className='w-full flex-1'>
              {/* <Skeleton.Node active className='!h-full !w-full' /> */}
              <VehicleTask />
            </div>
            <div className='w-full flex-1'>
              {/* <Skeleton.Node active className='!h-full !w-full' /> */}
              <VehicleFork />
            </div>
          </div>
        </div>
      </div>
      <div className='fixed bottom-0 left-0 right-0 z-10'>
        <WsContainer />
      </div>
    </div>
  );
};
export default Home;
