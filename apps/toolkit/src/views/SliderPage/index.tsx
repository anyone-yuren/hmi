import mainBg from '@/assets/img/mainBg.jpg';
import { AuthComponent, useAuthPermission } from '@gbeata/app-global';
import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SvgIcon } from 'ui';
// 去除table hover央视
const useStyles = createStyles(({ css, token }) => {
  return {
    customerSwiper: css`
      height: 100%;
      background: url(${mainBg}) no-repeat center center;
      background-size: cover;
      .swiper-slide {
        display: flex;
        width: 100%;
        padding: 80px;
      }
      .swiper-pagination-bullet {
        background-color: ${token.colorTextBase};
        width: 15px;
        height: 15px;
        opacity: 0.2;
      }
      .swiper-pagination-bullet-active-main {
        width: 30px;
        opacity: 1;
        border-radius: 8px;
      }
    `,
  };
});

const SwiperPage = () => {
  const { styles } = useStyles();
  const navigate = useNavigate();
  const { auth } = useAuthPermission();
  const { t } = useTranslation();
  return (
    <>
      <Swiper
        className={styles.customerSwiper}
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
      >
        <SwiperSlide>
          <div className='grid grid-cols-4 gap-8 w-full h-full justify-center'>
            <AuthComponent authKey={['admin']}>
              <div
                className='flex flex-col items-center justify-center gap-2'
                onClick={() => {
                  navigate('/singleTask');
                }}
              >
                <div className='flex justify-center items-center w-44 h-44 py-2 px-4 bg-gradient-to-b from-[#223d62] to-[#3b587e] rounded-3xl'>
                  <SvgIcon name={'task'} size={140} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.task')}
                </Typography.Title>
              </div>
            </AuthComponent>
            <div
              className='flex flex-col items-center justify-center gap-2'
              onClick={() => {
                navigate('/diagnosis');
              }}
            >
              <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                <SvgIcon name={'diagnosis'} size={180} />
              </div>
              <Typography.Title className='!font-normal' level={3}>
                {t('deployer.sliderPage.diagnosis')}
              </Typography.Title>
            </div>
            <AuthComponent authKey={['admin', 'customer']}>
              <div
                className='flex flex-col items-center justify-center gap-2'
                onClick={() => {
                  navigate('/hybrid');
                }}
              >
                <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                  <SvgIcon name={'hybrid'} size={180} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.navigation')}
                </Typography.Title>
              </div>
            </AuthComponent>
            <AuthComponent authKey={['admin', 'customer']}>
              <div
                className='flex flex-col items-center justify-center gap-2'
                onClick={() => {
                  navigate('/safety');
                }}
              >
                <div className='flex justify-center items-center w-44 h-44 py-2 px-4 bg-gradient-to-b from-yellow-500 to-yellow-400 rounded-3xl'>
                  <SvgIcon name={'safety'} size={140} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.safety')}
                </Typography.Title>
              </div>
            </AuthComponent>
            <AuthComponent authKey={['admin']}>
              <div
                className='flex flex-col items-center justify-center gap-2'
                onClick={() => {
                  navigate('/vision');
                }}
              >
                <div className='flex justify-center items-center w-44 h-44 py-2 px-4 bg-gradient-to-b from-[#ff7e5f] to-red-600 rounded-3xl'>
                  <SvgIcon name={'vision'} size={140} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.vision')}
                </Typography.Title>
              </div>
            </AuthComponent>
            {/* <div className='flex flex-col items-center justify-center gap-2'>
              <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                <SvgIcon name={'offset'} size={180} />
              </div>
              <Typography.Title className='!font-normal' level={3}>
                {t('deployer.sliderPage.offset')}
              </Typography.Title>
            </div> */}
            <AuthComponent authKey={['admin', 'customer']}>
              <div
                className='flex flex-col items-center justify-center gap-2'
                onClick={() => {
                  navigate('/charging');
                }}
              >
                <div className='flex justify-center items-center w-44 h-44 py-2 px-4 bg-gradient-to-b from-[#8BC34A] to-[#4CAF50]  rounded-3xl'>
                  <SvgIcon name={'charging'} size={180} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.charging')}
                </Typography.Title>
              </div>
            </AuthComponent>
            <div
              className='flex flex-col items-center justify-center gap-2'
              onClick={() => {
                navigate('/about');
              }}
            >
              <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                <SvgIcon name={'about'} size={180} />
              </div>
              <Typography.Title className='!font-normal' level={3}>
                {t('deployer.sliderPage.about')}
              </Typography.Title>
            </div>
            {/* <div className='flex flex-col items-center justify-center gap-2'>
              <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                <SvgIcon name={'calibration'} size={180} />
              </div>
              <Typography.Title className='!font-normal' level={3}>
                标定
              </Typography.Title>
            </div> */}
            <AuthComponent authKey={['admin', 'customer']}>
              <div
                className='flex flex-col items-center justify-center gap-2'
                onClick={() => {
                  navigate('/io');
                }}
              >
                <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                  <SvgIcon name={'io'} size={180} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.io')}
                </Typography.Title>
              </div>
            </AuthComponent>

            <AuthComponent authKey={['']}>
              <div
                className='flex flex-col items-center justify-center gap-2'
                onClick={() => {
                  navigate('/maintenance');
                }}
              >
                <div className='flex justify-center items-center w-44 h-44  bg-gradient-to-b from-[#0A3D62] to-[#3C6382]  rounded-3xl'>
                  <SvgIcon name={'maintenance'} size={140} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.maintenance')}
                </Typography.Title>
              </div>
            </AuthComponent>
            <AuthComponent authKey={['customer']}>
              <div
                className='flex flex-col items-center justify-center gap-2'
                onClick={() => {
                  navigate('/setting');
                }}
              >
                <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                  <SvgIcon name={'setting'} size={180} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.setting')}
                </Typography.Title>
              </div>
              <div
                className='flex flex-col items-center justify-center gap-2'
                onClick={() => {
                  navigate('/maintenance');
                }}
              >
                <div className='flex justify-center items-center w-44 h-44  bg-gradient-to-b from-[#0A3D62] to-[#3C6382]  rounded-3xl'>
                  <SvgIcon name={'maintenance'} size={140} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.maintenance')}
                </Typography.Title>
              </div>
              {
                <AuthComponent authKey={['']}>
                  <div className='flex flex-col items-center justify-center gap-2 invisible'>
                    <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                      <SvgIcon name={'setting'} size={180} />
                    </div>
                    <Typography.Title className='!font-normal' level={3}>
                      设置
                    </Typography.Title>
                  </div>
                  <div className='flex flex-col items-center justify-center gap-2 invisible'>
                    <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                      <SvgIcon name={'setting'} size={180} />
                    </div>
                    <Typography.Title className='!font-normal' level={3}>
                      设置
                    </Typography.Title>
                  </div>
                </AuthComponent>
              }
            </AuthComponent>

            <AuthComponent authKey={['']}>
              <div className='flex flex-col items-center justify-center gap-2'></div>
              <div className='flex flex-col items-center justify-center gap-2'></div>
              <div className='flex flex-col items-center justify-center gap-2'>
                <div className='w-44 h-44'></div>
              </div>
            </AuthComponent>
          </div>
        </SwiperSlide>
        {auth(['admin']) && (
          <SwiperSlide>
            <div className='grid grid-cols-4 gap-8 w-full h-full justify-center'>
              <div
                className='flex flex-col items-center justify-center gap-2'
                onClick={() => {
                  navigate('/setting');
                }}
              >
                <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                  <SvgIcon name={'setting'} size={180} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.setting')}
                </Typography.Title>
              </div>
              <div
                className='flex flex-col items-center justify-center gap-2'
                onClick={() => {
                  navigate('/maintenance');
                }}
              >
                <div className='flex justify-center items-center w-44 h-44  bg-gradient-to-b from-[#0A3D62] to-[#3C6382]  rounded-3xl'>
                  <SvgIcon name={'maintenance'} size={140} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.maintenance')}
                </Typography.Title>
              </div>
              <div className='flex flex-col items-center justify-center gap-2 invisible'>
                <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                  <SvgIcon name={'cloud'} size={180} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  {t('deployer.sliderPage.cloud')}
                </Typography.Title>
              </div>
              <div className='flex flex-col items-center justify-center gap-2 invisible'>
                <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                  <SvgIcon name={'setting'} size={180} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  设置
                </Typography.Title>
              </div>
              <div className='flex flex-col items-center justify-center gap-2 invisible'>
                <div className='flex justify-center items-center w-44 h-44  rounded-3xl'>
                  <SvgIcon name={'setting'} size={180} />
                </div>
                <Typography.Title className='!font-normal' level={3}>
                  设置
                </Typography.Title>
              </div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </>
  );
};

export default SwiperPage;
