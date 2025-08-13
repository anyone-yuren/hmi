import { useVehicleStore } from '@gbeata/store';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Flash from './flash';
import LoadingCharging from './loadingCharging';

const AnimateBrush = (props) => {
  const { setPowerStatus, powerStatus } = useVehicleStore(
    useShallow((state) => {
      return {
        setPowerStatus: state.setPowerStatus,
        powerStatus: state.powerStatus,
      };
    }),
  );
  const [threeColor, setThreeColor] = useState('green');
  const [isBrush, setIsBrush] = useState(false);
  const [isStation, setIsStation] = useState(false);
  const [stretch, setStretch] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 小车是否正在赶路
  const [vehicleChargingData, setVehicleChargingData] = useState<
    {
      key: string;
      message: string;
      time: string;
    }[]
  >([]);
  const [stationChargingData, setStationChargingData] = useState<
    {
      key: string;
      message: string;
      time: string;
    }[]
  >([]);
  return (
    <div className='w-full flex flex-1  relative'>
      <div className='absolute flex gap-2 p-4 z-10'>
        <Button
          type='primary'
          size='small'
          onClick={() => {
            setIsBrush(!isBrush);
            setIsLoading(false);
            setVehicleChargingData(
              isBrush
                ? []
                : [
                    {
                      key: '1',
                      message: '车辆发送光电',
                      time: '2023-01-01 12:00:00',
                    },
                    {
                      key: '2',
                      message: '等待充电桩伸出',
                      time: '2023-01-01 12:00:00',
                    },
                  ],
            );
          }}
        >
          光电触发
        </Button>
        <Button
          type='primary'
          size='small'
          onClick={() => {
            setIsStation(!isStation);
            setStretch(true);
            setStationChargingData(
              isStation
                ? []
                : [
                    {
                      key: '1',
                      message: '充电桩伸出',
                      time: '2023-01-01 12:00:00',
                    },
                    {
                      key: '2',
                      message: '等待充电桩发光',
                      time: '2023-01-01 12:00:00',
                    },
                  ],
            );
          }}
        >
          充电桩光电
        </Button>
        <Button variant='solid' color='yellow' size='small' onClick={() => setThreeColor('yellow')}>
          黄灯
        </Button>
        <Button variant='solid' color='green' size='small' onClick={() => setThreeColor('green')}>
          绿灯
        </Button>
        <Button variant='solid' color='red' size='small' onClick={() => setThreeColor('red')}>
          红灯
        </Button>
        <Button variant='solid' color='red' size='small' onClick={() => setStretch(!stretch)}>
          伸缩机械臂
        </Button>
        <Button variant='solid' color='yellow' size='small' onClick={() => setIsLoading(!isLoading)}>
          准备充电
        </Button>
        <Button
          type='primary'
          size='small'
          onClick={() => {
            setThreeColor('yellow');
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
          size='small'
          onClick={() => {
            setThreeColor('green');
            setPowerStatus({
              power: 0,
              charge_status: 0,
            });

            setStationChargingData([]);
            setVehicleChargingData([]);
            setIsBrush(false);
            setStretch(false);
            setIsStation(false);
          }}
        >
          测试停止
        </Button>
        <Button
          variant='solid'
          color='yellow'
          size='small'
          onClick={() => {
            setVehicleChargingData([
              ...vehicleChargingData,
              {
                key: '3',
                message: '车辆发送光电',
                time: '2023-01-01 12:00:00',
              },
            ]);
          }}
        >
          加数据
        </Button>
      </div>
      {/* 小车 */}
      <div className='flex-1 relative'>
        <div
          className='absolute top-1/4  w-1/3 h-2/3 bg-gradient-to-l from-white/40 to-white/0 [perspective:300px]'
          style={{ right: '40px' }}
        >
          <div className='w-1 h-20 bg-white/80 absolute top-1/2 -right-1'></div>
          <div className='w-1 h-20 absolute top-1/2 -right-2   bg-white/80 [clip-path:polygon(-10%_0%,100%_3%,100%_97%,-10%_100%)]'></div>
          <div
            className='absolute top-1/3 -translate-y-1/2'
            style={{
              width: '80px',
              right: '-80px',
            }}
          >
            {isBrush && <Flash type='car' />}
          </div>
          {/* 充电信息 */}
          <div className='absolute -left-1/2 flex flex-col divide-y divide-slate-400/40'>
            {vehicleChargingData.map((item, index) => (
              <motion.div
                className='py-2'
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 * index,
                }}
              >
                <div className='text-white font-bold'>{item.message}</div>
                <div className='text-xs text-white/50'>{item.time}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* 刷版 */}
      <div className='flex-1 relative'>
        <div
          className='absolute top-1/4  w-1/3 h-2/3 bg-gradient-to-r from-teal-400/40 to-white/0'
          style={{ left: '40px' }}
        >
          {/* 三色灯 */}
          <div className='absolute top-2 left-2 w-6 h-16 bg-white/80 rounded-full flex flex-col justify-between items-center '>
            <div className='flex-1 flex items-center justify-between relative'>
              {threeColor === 'red' && (
                <motion.div
                  className='w-3 h-3 bg-red-500 rounded-full shadow-[0_0_30px_10px_rgba(255,0,0,0.8)]'
                  initial={{
                    opacity: 0.8,
                    scale: 1,
                  }}
                  // 动画状态
                  animate={{
                    // 透明度波动
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'loop' as const,
                  }}
                ></motion.div>
              )}
              <div className='w-3 h-3 bg-red-500 rounded-full absolute left-1/2 -translate-x-1/2'></div>
            </div>
            <div className='flex-1 flex items-center justify-between'>
              {threeColor === 'yellow' && (
                <motion.div
                  className='w-3 h-3 bg-yellow-500 rounded-full shadow-[0_0_30px_10px_rgba(255,255,0,0.8)]'
                  initial={{
                    opacity: 0.8,
                    scale: 1,
                  }}
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                ></motion.div>
              )}
              <div className='w-3 h-3 bg-yellow-500 rounded-full absolute left-1/2 -translate-x-1/2'></div>
            </div>
            <div className='flex-1 flex items-center justify-between'>
              {threeColor === 'green' && (
                <motion.div
                  className='w-3 h-3 bg-green-500 rounded-full shadow-[0_0_30px_10px_rgba(0,255,0,0.8)]'
                  initial={{
                    opacity: 0.8,
                    scale: 1,
                  }}
                  animate={{
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                ></motion.div>
              )}
              <div className='w-3 h-3 bg-green-500 rounded-full absolute left-1/2 -translate-x-1/2'></div>
            </div>
          </div>
          {/* 充电桩机械臂 */}
          <motion.div
            initial={{ x: -16 }}
            animate={stretch ? { x: -80 } : { x: -16 }}
            transition={{ duration: 1.5 }}
            className='w-2 h-20 absolute top-1/2'
          >
            <div className='bg-white/70 w-4 h-24 absolute -top-2'></div>
            <div className='w-2 h-full bg-black/30 absolute'></div>
            <motion.div
              initial={{ width: 0 }}
              animate={stretch ? { width: 64 } : { width: 0 }}
              transition={{ duration: 1.5 }}
              className='h-2 bg-white/60 absolute top-2 left-4'
            ></motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={stretch ? { width: 64 } : { width: 0 }}
              transition={{ duration: 1.5 }}
              className='h-2 bg-white/60 absolute bottom-2 left-4'
            ></motion.div>
          </motion.div>

          <div
            className='absolute bottom-3 -translate-y-1/2'
            style={{
              width: '80px',
              left: '-80px',
            }}
          >
            {isStation && <Flash type='brush' />}
          </div>
          {/* 充电信息 */}
          <div className='absolute -right-1/2 flex flex-col divide-y divide-slate-400/40'>
            {stationChargingData.map((item, index) => (
              <motion.div
                className='py-2'
                key={item.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 * index,
                }}
              >
                <div className='text-white font-bold'>{item.message}</div>
                <div className='text-xs text-white/50'>{item.time}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <LoadingCharging />}
    </div>
  );
};

export default AnimateBrush;
