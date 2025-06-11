import GlobalFooter from '@/components/Footer';
import { Skeleton } from 'antd';
import { useResponsive } from 'antd-style';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();
  const responsive = useResponsive();
  const navigate = useNavigate();

  return (
    <div className='flex flex-col h-full w-full justify-between'>
      <div className='flex flex-1 flex-col overflow-y-auto gap-4 h-full p-4'>
        <div className='gap-4 w-full grid grid-cols-3 flex-1'>
          <div className='col-span-2'>
            <Skeleton.Button active className='!h-full !w-full' />
          </div>
          <div className='col-span-1 flex flex-col h-full gap-4'>
            <div className='w-full flex-1'>
              <Skeleton.Node active className='!h-full !w-full' />
            </div>
            <div className='w-full flex-1'>
              <Skeleton.Node active className='!h-full !w-full' />
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
    </div>
  );
};
export default Home;
