import { Typography } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import { motion } from 'framer-motion';

const useStyles = createStyles(({ css }) => ({
  loader: css`
    color: #fff;
    width: 4px;
    aspect-ratio: 1;
    border-radius: 50%;
    box-shadow:
      19px 0 0 7px,
      38px 0 0 3px,
      57px 0 0 0;
    transform: translateX(-38px);
    animation: l21 0.5s infinite alternate linear;

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
  const { styles } = useStyles();
  const theme = useTheme();
  return (
    <motion.div
      className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden'
      whileHover={{ scale: 1, boxShadow: '0 0 40px rgba(255,255,255,0.4)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* 动态发光圈 */}
      <motion.div
        className='absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 opacity-10 blur-3xl'
        animate={{ x: ['-20%', '20%', '-20%'], y: ['-40%', '20%', '-40%'], scale: [1.4, 2, 1.4], rotate: [0, 180, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: 'easeInOut', repeatType: 'reverse' }}
      />

      {/* 内容 */}
      <div className='relative z-10 text-white flex h-full flex-col'>
        <h2 className='text-lg font-bold mb-1'>任务</h2>
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
        {/* <Empty></Empty> */}
        <div className='flex-1'>
          <div className='flex flex-row items-start py-2 gap-4'>
            <div className='py-4 flex items-center gap-5 flex-col'>
              <div className={styles.loader}></div>
              <Typography.Title level={4} className='!m-0'>
                运行中
              </Typography.Title>
            </div>
            <div className='p-2'>
              <Typography.Title level={4}>任务号：P002-23-23-4-1-12</Typography.Title>
              <div className='flex items-center gap-6 opacity-100 text-md'>
                <div>任务类型：移动</div>
                <div>任务点：2232</div>
                <Typography.Text
                  style={{
                    color: theme.colorWarning,
                  }}
                >
                  实际速度: 0mm/s
                </Typography.Text>
                <Typography.Text
                  style={{
                    color: theme.colorPrimary,
                  }}
                >
                  规划速度: 0mm/s
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
