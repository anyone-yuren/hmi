import { useVehicleStore } from '@gbeata/store';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import Flash from './flash';
import LoadingCharging from './loadingCharging';
const AnimateBrush = (props) => {
  const { setPowerStatus, powerStatus, chargePileStatus } = useVehicleStore(
    useShallow((state) => {
      return {
        chargePileStatus: state.chargePileStatus,
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

  const { t } = useTranslation();

  const initViewState = () => {
    setThreeColor('green');
    setPowerStatus({
      ...powerStatus,
      // power: 0,
      // charge_status: 0,
    });

    setStationChargingData([]);
    setVehicleChargingData([]);
    setIsBrush(false);
    setStretch(false);
    setIsStation(false);
  };

  useEffect(() => {
    const ary = [2, 3];
    if (!ary.includes(chargePileStatus.charge_status)) {
      // initViewState();
    }
    if (chargePileStatus.charge_status === 2) {
      setIsLoading(true);
    }
    if (chargePileStatus.charge_status === 3) {
      // 充电状态，动画一直一步到位
      setIsLoading(false);
      setIsBrush(true);
      setStretch(true);
    }
  }, [chargePileStatus.charge_status]);
  useEffect(() => {
    // 车子关电触发
    if (chargePileStatus.pe_charge_output) {
      setIsBrush(true);
      setIsLoading(false);
      const timeString = dayjs().format('HH:mm:ss');
      setVehicleChargingData([
        {
          key: '1',
          message: t('common.charging.vehicleSendLight'),
          time: timeString,
        },
        {
          key: '2',
          message: t('common.charging.waitChargeStationOn'),
          time: timeString,
        },
      ]);
    }
  }, [chargePileStatus.pe_charge_output]);
  useEffect(() => {
    if (chargePileStatus.brush_board_status === 0) {
      setStretch(true);
      const timeString = dayjs().format('HH:mm:ss');
      setStationChargingData([
        {
          key: '2',
          message: t('common.charging.waitChargeStationLight'),
          time: timeString,
        },
        {
          key: '1',
          message: t('common.charging.chargeStationOn'),
          time: timeString,
        },
      ]);
    }
  }, [chargePileStatus.brush_board_status]);

  useEffect(() => {
    // 充电桩光电触发
    if (chargePileStatus.pe_charge_input) {
      setIsStation(true);
      const timeString = dayjs().format('HH:mm:ss');
      setStationChargingData((origin) => {
        return [
          ...origin,
          {
            key: '3',
            message: t('common.charging.chargingStationLight'),
            time: timeString,
          },
        ];
      });
      // setStationChargingData([
      //   ...stationChargingData,
      //   {
      //     key: '3',
      //     message: '充电桩发送光电',
      //     time: timeString,
      //   },
      // ]);
    }
  }, [chargePileStatus.pe_charge_input]);
  return (
    <div className='w-full flex flex-1  relative'>
      {false && (
        <div className='absolute flex gap-2 p-4 z-50'>
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
              setStretch(false);
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
                charge_status: 3,
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
                ...powerStatus,
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
      )}
      {/* 小车 */}
      <div className='flex-1 relative'>
        <div
          className='absolute  z-40 top-1/2 -translate-y-1/2 w-1/3 h-2/3 bg-gradient-to-l from-white/40 to-white/0'
          style={{ right: '80px' }}
        >
          {/* 俯视截面 */}
          <div className='w-12 h-[calc(100%+4px)] absolute -top-[2px] -right-12  bg-gradient-to-r from-white/40 to-white/10 [clip-path:polygon(-10%_0%,100%_6%,100%_94%,-10%_100%)]'></div>
          {/* 传感器 */}
          <div className='w-1 h-20 absolute top-1/2 -right-10 flex flex-col justify-between '>
            <div className='w-1 h-3 bg-gradient-to-r from-white/80 to-white/40 rounded-[1px]'>
              <div
                className='absolute top-0'
                style={{
                  width: '92px',
                  right: '-92px',
                }}
              >
                {isBrush && <Flash type='car' />}
              </div>
            </div>
            <div className='w-1 h-3 bg-gradient-to-r from-white/80 to-white/40 rounded-[1px]'></div>
          </div>
          <div className='w-1 h-20 bg-white/80 absolute top-1/2 -right-12'></div>
          <div className='w-1 h-20 absolute top-1/2 -right-12 translate-x-1 bg-white/30 [clip-path:polygon(-10%_0%,100%_3%,100%_97%,-10%_100%)]'></div>

          {/* 充电信息 */}
          <div className='absolute -left-full flex flex-col divide-y divide-slate-400/40'>
            {vehicleChargingData.map((item, index) => (
              <motion.div
                className='py-2 flex items-center justify-center gap-[2px]'
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 * index,
                }}
              >
                <CheckCircleIcon style={{ color: '#4caf50' }} size='large' />
                <div className='flex-1'>
                  <div className='text-white font-bold'>{item.message}</div>
                  <div className='text-xs text-white/50'>{item.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* 刷版 */}
      <div className='flex-1 relative'>
        <div
          className='absolute top-1/2 -translate-y-1/2 w-1/3 h-2/3 bg-gradient-to-r from-teal-400/60 to-white/0'
          style={{ left: '80px' }}
        >
          {/* 开关 */}
          <div className='absolute top-8 left-1/2 translate-x-1/2 w-6 h-6 bg-gradient-to-r from-yellow-500 to-yellow-700/40 rounded-full flex flex-col justify-between items-center '>
            <div className='flex-1 flex items-center justify-between relative'>
              <div className='w-3 h-3 bg-gradient-to-r from-red-500 to-red-800 rounded-full absolute left-1/2 -translate-x-1/2 shadow-[1px_0_10px_1px_rgba(0,0,0,0.8)]'></div>
            </div>
          </div>
          {/* 俯视截面 */}
          <div className='w-12 h-full absolute top-0 -left-12  bg-gradient-to-l  from-teal-400/60 to-teal-600/10 [clip-path:polygon(-10%_6%,100%_0%,100%_100%,-10%_94%)]'></div>
          {/* 传感器 */}
          <div className='w-1 h-20 absolute top-1/2 -left-7 flex flex-col justify-between'>
            <div className='w-1 h-3 bg-gradient-to-l from-white/80 to-white/40 rounded-[1px]'></div>
            <div className='w-1 h-3 bg-gradient-to-l from-white/80 to-white/40 rounded-[1px] relative'>
              <div
                className='absolute top-0 '
                style={{
                  width: '92px',
                  left: '-92px',
                }}
              >
                {isStation && <Flash type='brush' />}
              </div>
            </div>
          </div>
          {/* 充电桩机械臂 */}
          <motion.div
            initial={{ x: -16 }}
            animate={stretch ? { x: -84 } : { x: -16 }}
            transition={{ duration: 1.5 }}
            className='w-2 h-20 absolute top-1/2 -left-8'
          >
            <div className='w-4 h-24 absolute -top-2 bg-gradient-to-l from-white/80 to-white/50'></div>
            <div className='w-2 h-full bg-black/30 absolute'></div>
            <motion.div
              initial={{ width: 0 }}
              animate={stretch ? { width: 68 } : { width: 0 }}
              transition={{ duration: 1.5 }}
              className='h-2 bg-white/60 absolute top-2 left-4'
            ></motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={stretch ? { width: 68 } : { width: 0 }}
              transition={{ duration: 1.5 }}
              className='h-2 bg-white/60 absolute bottom-2 left-4'
            ></motion.div>
          </motion.div>
          {/* 充电信息 */}
          <div className='absolute -right-full flex flex-col divide-y divide-slate-400/40'>
            {stationChargingData.map((item, index) => (
              <motion.div
                className='py-2 flex items-center justify-center gap-[2px]'
                key={item.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 * index,
                }}
              >
                <CheckCircleIcon style={{ color: '#4caf50' }} size='large' />
                <div className='flex-1'>
                  <div className='text-white font-bold'>{item.message}</div>
                  <div className='text-xs text-white/50'>{item.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* 充电桩上的面板 */}
          <div className='absolute top-1/2 left-1/2 -translate-y-2 -translate-x-3 w-20 h-24 bg-gradient-to-r from-black/70 to-white/0 rounded-sm p-4'>
            <div className='w-full h-full bg-gradient-to-r from-white/70 to-white/0 rounded-sm'></div>
          </div>
        </div>
      </div>

      {isLoading && <LoadingCharging state={chargePileStatus.charge_status} />}
    </div>
  );
};

export default AnimateBrush;
