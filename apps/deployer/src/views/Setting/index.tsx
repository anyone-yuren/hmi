import LoginModalTrigger, { triggerLoginModal } from '@/views/Network/components/loginClient';
import { AuthComponent } from '@gbeata/app-global';
import { styled } from '@mui/material';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Peripheral from './components/peripheral';
export const SwiperWrapper = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  '.swiper-pagination-bullet-active': {
    opacity: '1 !important',
    background: theme.palette.primary.main,
  },
}));

import { useRequest } from 'ahooks';
import { config_agv_info } from './service';

const Setting = () => {
  const { t } = useTranslation();

  const { data, loading } = useRequest(config_agv_info);
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
          <div className='bg-[#445260] h-full rounded-2xl p-4 flex flex-col w-full'>
            <Peripheral />
          </div>
        </SwiperSlide>
      </Swiper>
      <LoginModalTrigger />
      <AuthComponent authKey={['admin']}>
        <Button
          loading={loading}
          type='primary'
          disabled={!data?.support_wireless_configuration}
          className='absolute bottom-4 right-4 z-10'
          onClick={() => {
            triggerLoginModal();
          }}
        >
          {t('deployer.setting.networkSetting')}
        </Button>
      </AuthComponent>
    </SwiperWrapper>
  );
};
export default Setting;
