import { useRequest } from 'ahooks';
import { Skeleton, Spin } from 'antd';
import { useResponsive } from 'antd-style';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import bg from '../assets/img/bg.png';
import VehicleControl from './components/vehicleControl';
import VehicleFork from './components/vehicleFork';
import VehiclePanel from './components/vehiclePanel';
import VehicleStatus from './components/vehicleStatus';
import VehicleTask from './components/vehicleTask';
import WsContainer from './components/wsContainer';
import { getDeviceList } from './services';
import { useHomeStore } from './store';

const Home = () => {
  const { t } = useTranslation();
  const responsive = useResponsive();
  const navigate = useNavigate();
  const [renderView, setRenderView] = useState(false);
  const { setRobotRadarStatus, isContentWss, setIsContentWss } = useHomeStore(
    useShallow((store) => {
      return {
        isContentWss: store.isContentWss,
        setRobotRadarStatus: store.setRobotRadarStatus,
        setIsContentWss: store.setIsContentWss,
      };
    }),
  );
  const { run: getDevice } = useRequest(getDeviceList, {
    manual: true,
    onSuccess: (res) => {
      if (res?.data && res?.code === 200) {
        setRobotRadarStatus(res.data);
      }
    },
  });

  useEffect(() => {
    renderView && getDevice();
  }, [renderView]);

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
        {!renderView ? (
          <div className='flex w-full h-full items-center justify-center'>
            <Spin></Spin>
          </div>
        ) : (
          <div className='gap-4 w-full grid grid-cols-3 flex-1'>
            <div className='col-span-2 flex gap-4 flex-col'>
              <div className='flex-1'>
                <Suspense fallback={<Skeleton.Button active className='!h-full !w-full' />}>
                  <VehiclePanel />
                </Suspense>
              </div>
              <div className='flex gap-4'>
                <div className='flex-1'>
                  {/* <Skeleton.Node active className='!h-full !w-full' /> */}
                  <VehicleTask />
                </div>
              </div>
            </div>
            <div className='col-span-1 flex flex-col h-full gap-4'>
              <div className=''>
                {/* <Skeleton.Node active className='!h-full !w-full' /> */}
                <VehicleStatus />
              </div>
              <div className='flex-1'>
                {/* <Skeleton.Node active className='!h-full !w-full' /> */}
                <VehicleControl />
              </div>
              {/* <div className='w-full flex-1'>
              <VehicleTask />
            </div> */}
              <div className='w-full flex-1'>
                {/* <Skeleton.Node active className='!h-full !w-full' /> */}
                <VehicleFork />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='fixed bottom-0 left-0 right-0 z-10'>
        <WsContainer setRenderView={setRenderView} />
      </div>
    </div>
  );
};
export default Home;
