import { CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useVehicleStore } from '@gbeata/store';
import { Button, Timeline } from 'antd';
import { createStyles } from 'antd-style';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import stationPng from '../assets/img/station-l.png';
import x20l from '../assets/img/x20-l.png';

const useStyles = createStyles(({ css }) => ({
  line: css`
    .ant-timeline-item-head {
      background: transparent !important;
    }
  `,
}));

const bubbleVariants = {
  initial: {
    y: 0,
    opacity: 0,
    scale: 1,
  },
  animate: {
    y: -200,
    opacity: [0, 1, 0],
    scale: 1.5,
  },
};

const bubbleTransition = {
  duration: 3,
  ease: 'easeInOut',
  repeat: Infinity,
  repeatType: 'loop' as const,
  times: [0, 0.8, 1],
};

const Bubble = ({ delay = 0, left = '50%', size = 'w-3 h-3' }) => (
  <motion.div
    className={`absolute bottom-0 ${size} rounded-full bg-yellow-200`}
    style={{ left }}
    variants={bubbleVariants}
    initial='initial'
    animate='animate'
    transition={{ ...bubbleTransition, delay }}
  />
);

const Charging = () => {
  const { setPowerStatus, powerStatus } = useVehicleStore(
    useShallow((state) => {
      return {
        setPowerStatus: state.setPowerStatus,
        powerStatus: state.powerStatus,
      };
    }),
  );
  const { t } = useTranslation();
  const { styles } = useStyles();
  const [isStation, setIsStation] = useState(false);
  const [isVehicle, setIsVehicle] = useState(false);
  const [isError, setIsError] = useState(false);
  const [processItems, setProcessItems] = useState([
    {
      children: (
        <div className='shadow-custom-box bg-yellow-200/40 p-2 rounded-md shadow-yellow-200/40'>
          <div className='text-sm'>充电光电触发</div>
          <div className='text-xs '>2025-09-01 10:00:00</div>
        </div>
      ),
      // dot: <div className='w-4 h-4 rounded-full bg-yellow-200'></div>,
      dot: <CheckCircleOutlined className='text-yellow-200' />,
    },
    {
      children: (
        <div className='shadow-custom-box bg-[#22d3ee]/40 p-2 rounded-md shadow-[#22d3ee]/40'>
          <div className='text-sm'>接收光电触发</div>
          <div className='text-sm'>2025-09-01 10:00:00</div>
        </div>
      ),
      dot: <CheckCircleOutlined className='text-[#22d3ee]' />,
    },
  ]);
  const stationItems = () => {
    return {
      children: (
        <div className='shadow-custom-box bg-[#22d3ee]/40 p-2 rounded-md shadow-[#22d3ee]/40 relative overflow-hidden'>
          <motion.div
            className='absolute top-[0%] left-[-50%] w-1/4 h-full bg-gradient-to-r from-transparent via-[#22d3ee]/40 to-transparent rotate-[0deg]'
            animate={{ left: ['-20%', '100%'] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.8,
            }}
          />
          <div className='text-sm'>发送充电信号</div>
          <div className='text-sm'>2025-09-01 10:00:00</div>
        </div>
      ),
      dot: <ClockCircleOutlined style={{ fontSize: '16px', color: '#22d3ee' }} />,
    };
  };
  const vehicleItems = () => {
    return {
      children: (
        <div className='shadow-custom-box bg-yellow-200/40 p-2 rounded-md shadow-yellow-200/40 relative overflow-hidden'>
          <motion.div
            className='absolute top-[0%] left-[-50%] w-1/4 h-full bg-gradient-to-l from-transparent via-yellow-200/40 to-transparent rotate-[0deg]'
            animate={{ left: ['100%', '-20%'] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.8,
            }}
          />
          <div className='text-sm'>准备充电信号</div>
          <div className='text-sm'>2025-09-01 10:00:00</div>
        </div>
      ),
      dot: <ClockCircleOutlined style={{ fontSize: '16px', color: '#fef08a' }} />,
    };
  };
  return (
    <div className='flex flex-row h-full p-4 gap-4 '>
      <div className='flex gap-4 items-center w-2/5 '>
        <motion.div
          className='w-full h-full rounded-xl backdrop-blur-2xl'
          animate={
            isStation
              ? {
                  boxShadow: [
                    '0 0 0px rgba(34,211,238, 0.3)',
                    '0 0 30px rgba(34,211,238, 0.5)',
                    '0 0 0px rgba(34,211,238, 0.3)',
                  ],
                }
              : {
                  boxShadow: '0 0 0px rgba(34,211,238, 0)', // 关闭动画，静止状态
                }
          }
          transition={{
            duration: 1.6,
            repeat: isStation ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          <div className='flex flex-1 flex-col gap-4 h-full relative p-4 rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden'>
            <div className='w-full'>
              <h2 className='text-lg font-bold mb-1'>{t('common.charging.station')} </h2>
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

            {/* 充电桩图片 */}
            <div className='w-1/2 absolute bottom-4 right-4'>
              {isError && (
                <motion.div
                  initial={{ opacity: 0.7, scale: 1 }}
                  animate={{ opacity: 1, scale: 1.1 }}
                  transition={{ duration: 0.4, ease: 'easeInOut', repeatType: 'loop', repeat: Infinity }}
                  className='absolute top-1/2 z-10 w-full flex items-center justify-center text-red-600'
                >
                  <SvgIcon name='error' size={80} />
                  <div className='text-lg font-bold'>电压异常</div>
                </motion.div>
              )}
              <motion.img
                src={stationPng}
                initial={{ filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' }}
                animate={
                  powerStatus.charge_status === 4 || isError
                    ? {
                        filter: isError
                          ? 'drop-shadow(0 10px 10px rgba(255,0,0,0.5))'
                          : 'drop-shadow(0 10px 10px rgba(34,211,238,0.5))',
                      }
                    : { filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' }
                }
                transition={
                  powerStatus.charge_status === 4 || isError
                    ? { duration: 1.6, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }
                    : { duration: 0 }
                }
                className='w-full'
              />
            </div>
            {/* 充电桩电池电压 */}
            <div className='flex flex-col gap-4'>
              <div className='w-full h-12  rounded-md flex items-end justify-between shadow-md shadow-[#22d3ee]/20 px-4 py-2'>
                <div className='text-sm text-[#22d3ee] font-bold flex items-end gap-2'>
                  <SvgIcon name='volt' size={32} />
                  电压
                </div>
                <div className='text-sm font-bold'>22.8V</div>
              </div>
              <div className='w-full h-12  rounded-md flex items-end justify-between shadow-md shadow-[#22d3ee]/20 px-4 py-2'>
                <div className='text-sm text-[#22d3ee] font-bold flex items-end gap-2'>
                  <SvgIcon name='ampere' size={32} />
                  电流
                </div>
                <div className='text-sm font-bold'>22.8A</div>
              </div>
              <div className='w-full h-12  rounded-md flex items-end justify-between shadow-md shadow-[#22d3ee]/20 px-4 py-2'>
                <div className='text-sm text-[#22d3ee] font-bold flex items-end gap-2'>
                  <SvgIcon name='celsius' size={32} />
                  温度
                </div>
                <div className='text-sm font-bold'>22.8℃</div>
              </div>
              <div className='flex justify-end gap-4'>
                <Button
                  variant='solid'
                  color='cyan'
                  onClick={() => {
                    setIsStation(true);
                    setProcessItems([...processItems, stationItems()]);
                  }}
                >
                  发送信号
                </Button>
                <Button
                  variant='solid'
                  color='red'
                  onClick={() => {
                    setIsError(!isError);
                  }}
                >
                  异常警告
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className='flex gap-4 items-center flex-1 overflow-y-auto'>
        <div className='flex flex-col w-full h-full relative p-4'>
          <Timeline className={styles.line} items={processItems} />
        </div>
      </div>
      <div className='relative h-full rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm flex flex-col w-2/5 gap-4'>
        <motion.div
          className='w-full h-full rounded-xl backdrop-blur-2xl p-4'
          animate={
            isVehicle
              ? {
                  boxShadow: [
                    '0 0 0px rgba(254,240,138, 0.3)',
                    '0 0 30px rgba(254,240,138, 0.5)',
                    '0 0 0px rgba(254,240,138, 0.3)',
                  ],
                }
              : {
                  boxShadow: '0 0 0px rgba(254,240,138, 0)', // 关闭动画，静止状态
                }
          }
          transition={{
            duration: 1.6,
            repeat: isVehicle ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          <div className='absolute bottom-0 left-0 w-full'>
            <motion.img
              src={x20l}
              initial={{ filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' }}
              animate={
                powerStatus.charge_status === 4
                  ? { filter: 'drop-shadow(0 10px 10px rgba(255,255,0,0.5))' }
                  : { filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' }
              }
              transition={
                powerStatus.charge_status === 4
                  ? { duration: 1.6, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }
                  : { duration: 0 }
              }
              className='w-2/3 absolute bottom-4 left-4'
            />
            {powerStatus.charge_status === 4 && (
              <div className='w-full h-64  rounded-xl overflow-hidden '>
                <Bubble delay={-0.8} left='5%' size='w-1 h-1' />
                <Bubble delay={0} left='10%' size='w-4 h-4' />
                <Bubble delay={0.2} left='20%' size='w-2 h-2' />
                <Bubble delay={0.6} left='40%' size='w-3 h-3' />
                <Bubble delay={1.2} left='60%' size='w-2.5 h-2.5' />
                <Bubble delay={1.8} left='30%' size='w-1.5 h-1.5' />
                <Bubble delay={2.4} left='50%' size='w-2 h-2' />
              </div>
            )}
          </div>

          <div className='w-full'>
            <h2 className='text-lg font-bold mb-1'>车辆电池</h2>
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
          {/* 车辆电池电压 */}
          <div className='flex flex-col gap-4 mt-4'>
            <div className='w-full h-12  rounded-md flex items-end justify-between shadow-md shadow-yellow-400/20 px-4 py-2'>
              <div className='text-sm text-yellow-400 font-bold flex items-end gap-2'>
                <SvgIcon name='volt' size={32} />
                电压
              </div>
              <div className='text-sm font-bold'>22.8V</div>
            </div>
            <div className='w-full h-12  rounded-md flex items-end justify-between shadow-md shadow-yellow-400/20 px-4 py-2'>
              <div className='text-sm text-yellow-400 font-bold flex items-end gap-2'>
                <SvgIcon name='ampere' size={32} />
                电流
              </div>
              <div className='text-sm font-bold'>22.8A</div>
            </div>
            <div className='w-full h-12  rounded-md flex items-end justify-between shadow-md shadow-yellow-400/20 px-4 py-2'>
              <div className='text-sm text-yellow-400 font-bold flex items-end gap-2'>
                <SvgIcon name='celsius' size={32} />
                温度
              </div>
              <div className='text-sm font-bold'>22.8℃</div>
            </div>
            <div className='flex items-center gap-4'>
              <Button
                variant='solid'
                color='yellow'
                onClick={() => {
                  setIsVehicle(true);
                  setProcessItems([...processItems, vehicleItems()]);
                }}
              >
                发送信号
              </Button>
              <Button
                variant='solid'
                color='green'
                onClick={() => {
                  setIsStation(false);
                  setIsVehicle(false);
                  setPowerStatus({
                    power: 50,
                    charge_status: 4,
                  });
                }}
              >
                开始充电
              </Button>
              <Button
                variant='solid'
                color='red'
                onClick={() => {
                  setIsStation(false);
                  setIsVehicle(false);
                  setPowerStatus({
                    power: 0,
                    charge_status: 0,
                  });
                }}
              >
                停止充电
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Charging;
