import bg from '@/assets/img/bg.png';
import GlobalFooter from '@/components/Footer';
import { Skeleton } from 'antd';
import { useResponsive } from 'antd-style';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import VehicleInfo from './components/vehicleInfo';
import VehiclePanel from './components/vehiclePanel';
import WsContainer from './components/wsContainer';

const Home = () => {
  const { t } = useTranslation();
  const responsive = useResponsive();
  const navigate = useNavigate();
  console.log(1111111);
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
          <div className='col-span-2'>
            <Suspense fallback={<Skeleton.Button active className='!h-full !w-full' />}>
              <VehiclePanel />
            </Suspense>
          </div>
          <div className='col-span-1 flex flex-col h-full gap-4'>
            <div className='w-full flex-1'>
              {/* <Skeleton.Node active className='!h-full !w-full' /> */}
              <VehicleInfo />
            </div>
            <div className='w-full flex-1'>
              {/* <Skeleton.Node active className='!h-full !w-full' /> */}
              <VehicleInfo />
            </div>
          </div>
        </div>
        <div className='h-[200px]'>
          <Skeleton.Node active className='!h-full !w-full' />
          {/* <div className='rounded-xl bg-[linear-gradient(to_right,#ffffff80_0%,#ffffff80_0%,transparent_20%,transparent_80%,#ffffff80_100%,#ffffff80_100%)] p-[1px]'>
            <div className='rounded-xl p-4 bg-gradient-to-t from-black to-[#ffffff01]'>渐变边框盒子</div>
          </div> */}
        </div>
      </div>
      <GlobalFooter />
      <div className='fixed bottom-0 left-0 right-0 z-10'>
        <WsContainer />
      </div>
    </div>
  );
};
export default Home;
