import { Skeleton } from '@mui/material';
import { useRequest } from 'ahooks';
import { Divider, Space, Tag, Typography } from 'antd';
import { useTheme } from 'antd-style';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import diqiu from '../../../assets/img/diqiu.png';
import { getAgvInfo, getVehicleIp, getVehicleTaskMode } from '../../services';
import { useHomeStore } from '../../store/index';

const VehicleInfo = () => {
  const { t } = useTranslation();
  const { data: agv_info, loading } = useRequest(getAgvInfo);
  const { data: vehicle_ip, loading: loading_ip } = useRequest(getVehicleIp);
  const { data: task_mode, loading: loading_task_mode } = useRequest(getVehicleTaskMode);

  const { robotCurrentStatus } = useHomeStore(
    useShallow((state) => {
      return {
        robotCurrentStatus: state.robotCurrentStatus,
      };
    }),
  );
  const theme = useTheme();

  const getNavigationType = (type: number) => {
    switch (type) {
      case 1:
        return t('deployer.hybrid.reflectors');
      case 2:
        return 'SLAM';
      case 5:
        return t('deployer.hybrid.qrCode');
      default:
        return t('deployer.hybrid.unknown');
    }
  };

  return (
    <motion.div
      className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-xl shadow-2xl overflow-hidden'
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* 内容 */}
      <div className='relative z-10 text-white flex flex-col h-full'>
        {/* <SvgIcon name='slam' className='absolute -right-10 -bottom-10 scale-125 opacity-5' size={160} /> */}
        <img src={diqiu} className='w-60 absolute -right-10 -bottom-10 scale-125 opacity-15' />
        <div className='w-full'>
          <h2 className='text-lg font-bold mb-1'>{t('common.home.vehicleStatus')}</h2>
          <motion.div
            className='!w-full h-px'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div
              className='w-full h-full'
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)',
              }}
            />
          </motion.div>
        </div>
        <div className='flex-1 grid grid-cols-3 gap-2'>
          <div className='flex-1 col-span-3 flex flex-col'>
            <div className='text-[60px] md:text-[40px] flex gap-2 items-baseline'>
              <span>
                No.{loading ? <Skeleton variant='rounded' width={60} height={60} /> : agv_info?.agv_id || '-'}
              </span>
              <span
                style={{
                  background: theme.colorPrimary,
                  borderRadius: 4,
                  padding: '2px 4px',
                  color: theme.colorText,
                  fontSize: '12px',
                }}
              >
                {loading_task_mode ? (
                  <Skeleton variant='rounded' width={20} height={16} />
                ) : task_mode?.data?.task_mode === 3 ? (
                  'S'
                ) : (
                  'M'
                )}
              </span>
            </div>
            <Space className='flex-1' split={<Divider type='vertical' />}>
              {/* <Typography.Title level={5}>x: {Math.round((agvPosition.x / 1000) * 100) / 100} m</Typography.Title>
              <Typography.Title level={5}>y: {Math.round((agvPosition.y / 1000) * 100) / 100} m</Typography.Title>
              <Typography.Title level={5}>
                theta: {Math.round((agvPosition?.angel * 180) / Math.PI) || 0}°
              </Typography.Title> */}
              <Typography.Title level={5}>
                {t('common.home.vehicleStatusNavigationType')}:
                <Tag bordered={false} color='default' className='text-base ml-1'>
                  {getNavigationType(robotCurrentStatus?.navigation_type || 0)}
                </Tag>
              </Typography.Title>
              <Typography.Title level={5}>
                {t('common.home.vehicleStatusNavigationStatus')}:
                {!robotCurrentStatus?.navi_status ? (
                  <Tag bordered={false} color='success' className='text-base ml-1'>
                    {t('common.home.vehicleStatusNavigationStatusNormal')}
                  </Tag>
                ) : (
                  <Tag bordered={false} color='error' className='text-base ml-1'>
                    {t('common.home.vehicleStatusNavigationStatusLost')}
                  </Tag>
                )}
              </Typography.Title>
            </Space>
            <div className='flex-1 col-span-1'>
              <Typography.Title level={4} className='!m-0 flex items-center gap-2'>
                IP: {loading_ip ? <Skeleton variant='rounded' width={100} height={20} /> : vehicle_ip?.ip || '-'}
              </Typography.Title>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default VehicleInfo;
