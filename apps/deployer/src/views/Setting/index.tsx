import { styled } from '@mui/material';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ChassisParameters from './components/chasiss';
import Peripheral from './components/peripheral';
import TravelParameters from './components/travelParameters';
export const SwiperWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  '.swiper-pagination-bullet-active': {
    opacity: '1 !important',
    background: theme.palette.primary.main,
  },
}));

const Setting = () => {
  return (
    <SwiperWrapper>
      <Swiper
        className='h-full !p-4'
        slidesPerView={3}
        spaceBetween={20}
        noSwiping={true}
        pagination={{ clickable: true }}
        modules={[Pagination]}
      >
        <SwiperSlide>
          <div className='bg-[#445260] h-full rounded-2xl p-4 flex flex-col'>
            <TravelParameters />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='bg-[#445260] h-full rounded-2xl p-4 flex flex-col'>
            <ChassisParameters />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='bg-[#445260] h-full rounded-2xl p-4 flex flex-col'>
            <Peripheral />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='bg-[#445260] h-full rounded-2xl'>111</div>
        </SwiperSlide>
        <SwiperSlide>
          <div className='bg-[#445260] h-full rounded-2xl'>111</div>
        </SwiperSlide>
      </Swiper>
    </SwiperWrapper>
  );
};
export default Setting;
