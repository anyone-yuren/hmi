import { EllipsisOutlined } from '@ant-design/icons';
import { useGlobalStore } from '@gbeata/store';
import { Button, Popover, Typography } from 'antd';
import { useTheme } from 'antd-style';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useHomeStore } from '../../store';

const VehicleFork = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { showAnimate } = useGlobalStore(
    useShallow((state) => ({
      showAnimate: state.showAnimate,
    })),
  );
  const { robotForkarmStatus } = useHomeStore(
    useShallow((state) => ({
      robotForkarmStatus: state.robotForkarmStatus,
    })),
  );

  return (
    <motion.div
      className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden'
      whileHover={{ scale: 1, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* 动态发光圈 */}
      {false ? (
        <motion.div
          className='absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 opacity-10 blur-3xl'
          animate={{
            x: ['-20%', '20%', '-20%'],
            y: ['-40%', '20%', '-40%'],
            scale: [1.4, 2, 1.4],
            rotate: [0, 180, 0],
          }}
          transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut', repeatType: 'reverse' }}
        />
      ) : null}

      {/* 内容 */}
      <div className='relative z-10 h-full text-white flex flex-col'>
        <div className='w-full'>
          <h2 className='text-lg font-bold mb-1 flex justify-between items-center'>
            {t('common.home.vehicleFork')}{' '}
            <Popover
              content={
                <div className='flex flex-col gap-2 min-w-40'>
                  <div className='bg-white/5 rounded-md p-2 flex items-center justify-between transition-all hover:bg-white/10  hover:scale-105'>
                    <p>{t('common.home.eulerX')}</p>
                    <p>{robotForkarmStatus?.euler_x}</p>
                  </div>
                  <div className='bg-white/5 rounded-md p-2 flex items-center justify-between transition-all hover:bg-white/10  hover:scale-105'>
                    <p>{t('common.home.eulerY')}</p>
                    <p>{robotForkarmStatus?.euler_y}</p>
                  </div>
                  <div className='bg-white/5 rounded-md p-2 flex items-center justify-between transition-all hover:bg-white/10  hover:scale-105'>
                    <p>{t('common.home.eulerZ')}</p>
                    <p>{robotForkarmStatus?.euler_z}</p>
                  </div>
                  <div className='bg-white/5 rounded-md p-2 flex items-center justify-between transition-all hover:bg-white/10  hover:scale-105'>
                    <p>{t('common.home.forkWidth')}</p>
                    <p>{robotForkarmStatus?.width}</p>
                  </div>
                </div>
              }
              trigger='click'
              placement='topRight'
            >
              <Button icon={<EllipsisOutlined />} type='text'></Button>
            </Popover>
          </h2>
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
        <div className='flex-1 grid grid-cols-3'>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title level={2}>{robotForkarmStatus.y > -1 ? robotForkarmStatus.y : '-'}</Typography.Title>
            <Typography.Text className='opacity-50'>{t('common.home.vehicleForkx')}</Typography.Text>
          </div>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title
              style={
                {
                  // color: theme.colorPrimary,
                }
              }
              level={2}
            >
              {robotForkarmStatus.x > -1 ? robotForkarmStatus.x : '-'}
            </Typography.Title>
            <Typography.Text className='opacity-50'>{t('common.home.vehicleForky')}</Typography.Text>
          </div>
          <div className='flex-1 flex flex-col justify-center items-center'>
            <Typography.Title level={2}>{robotForkarmStatus.z > -1 ? robotForkarmStatus.z : '-'}</Typography.Title>
            <Typography.Text className='opacity-50'>{t('common.home.vehicleForkz')}</Typography.Text>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default VehicleFork;
