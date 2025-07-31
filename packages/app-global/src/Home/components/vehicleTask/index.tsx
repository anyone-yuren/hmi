import { useGlobalStore } from '@gbeata/store';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Typography } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useHomeStore } from '../../store/index';

const useStyles = createStyles(({ css }) => ({
  loader: css`
    color: #fff;
    width: 4px;
    aspect-ratio: 1;
    border-radius: 50%;
    margin-bottom: 16px;
    box-shadow:
      19px 0 0 7px,
      38px 0 0 3px,
      57px 0 0 0;
    transform: translateX(-38px);
    animation: l21 1s infinite alternate linear;

    @keyframes l21 {
      50% {
        box-shadow:
          19px 0 0 3px,
          38px 0 0 7px,
          57px 0 0 3px;
      }
      100% {
        box-shadow:
          19px 0 0 0,
          38px 0 0 3px,
          57px 0 0 7px;
      }
    }
  `,
}));

const VehicleTask = () => {
  const { t } = useTranslation();
  const { styles } = useStyles();
  const theme = useTheme();
  const { showAnimate } = useGlobalStore(
    useShallow((state) => ({
      showAnimate: state.showAnimate,
    })),
  );
  const { taskInfo, controlStatus } = useHomeStore(
    useShallow((state) => ({
      taskInfo: state.taskInfo,
      controlStatus: state.controlStatus,
    })),
  );
  const taskState = [
    t('common.taskState.moving'),
    t('common.taskState.pickUp'),
    t('common.taskState.pickDown'),
    t('common.taskState.charging'),
  ];
  // const taskStatus = [t('common.taskStatus.init'), t('common.taskStatus.running'), t('common.success')];
  const taskStatus = [t('common.taskStatus.init'), t('common.taskStatus.running')];
  return (
    <motion.div
      className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden'
      whileHover={{ scale: 1, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* 动态发光圈 */}
      {true ? (
        // {showAnimate ? (
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
      <div className='relative z-10 text-white flex h-full flex-col'>
        <h2 className='text-lg font-bold mb-1'>{t('common.home.task')}</h2>
        {showAnimate ? (
          <motion.div
            initial={{ width: '40px', opacity: 0.2 }}
            animate={{
              width: '160px',
              opacity: 1,
            }}
            transition={{
              duration: 3,
              ease: 'easeInOut',
            }}
            className='h-[1px] bg-gradient-to-r from-teal-500 to-purple-500/0 rounded-full'
          />
        ) : null}
        {/* <Empty></Empty> */}
        <div className='flex-1'>
          <div className='flex flex-row items-center py-2 gap-4'>
            <div className=' flex items-center flex-col'>
              {taskInfo?.task_state === 1 ? <div className={styles.loader}></div> : null}
              {taskInfo?.task_state === 2 ? <CheckCircleIcon fontSize='large' /> : null}
              {/* <img className='w-12 h-10' src={runningGif} alt='' /> */}
              <Typography.Title level={4} className='!m-0'>
                {taskStatus[taskInfo?.task_state] ?? null}
              </Typography.Title>
            </div>
            <div className='p-2'>
              <Typography.Title level={4}>
                {t('common.home.taskId')}:{taskInfo?.task_id}
              </Typography.Title>
              <div className='flex items-center gap-6 opacity-100 text-md'>
                <div>
                  {t('common.home.taskType')}:{taskState[taskInfo?.task_state] ?? '-'}
                </div>
                <div>
                  {t('common.home.taskPoint')}:{taskInfo?.task_point_id}
                </div>
                <Typography.Text
                  style={{
                    color: theme.colorWarning,
                  }}
                >
                  {t('common.home.actualSpeed')}: {controlStatus?.vel_real ?? 0} mm/s
                </Typography.Text>
                <Typography.Text
                  style={{
                    color: theme.colorPrimary,
                  }}
                >
                  {t('common.home.plannedSpeed')}: {controlStatus?.vel_reference ?? 0} mm/s
                </Typography.Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default VehicleTask;
