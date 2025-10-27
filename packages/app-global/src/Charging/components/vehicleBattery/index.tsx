import { useVehicleStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { Button, Slider, Switch, Typography } from 'antd';
import { ThemeProvider } from 'antd-style';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { useAgvType } from '../../../hooks/useAgvType';
import {
  // getAccumulatedChargingDegrees,
  // getAccumulatedChargingTimes,
  // getLastFullChargeTime,
  // getPeripheralControlParam,
  // postPeripheralControlParam,
  getChargingConfig,
  postChargingConfig,
} from '../../services';
import { useChargeStore } from '../../store/charge.store';
import ChargingHistory from '../chargingHistory';

// 获取图片函数
const getImage = (imageName: string) => {
  return new URL(`../../../assets/vehicles/${imageName}`, import.meta.url).href;
};

const VehicleBattery = (props: any) => {
  const { current = 0, voltage = 0 } = props;
  const { t } = useTranslation();
  const agvType = useAgvType();

  const [pdName, setPdName] = useState(`MW_${agvType}.png`);
  const productImage = useCallback(() => {
    const url = getImage(`${pdName}`);
    return url.indexOf('undefined') > -1 ? undefined : getImage(`${pdName}`);
  }, [pdName]);

  const [showHistory, setShowHistory] = useState(false);
  // const [lowPower, setLowPower] = useState(false);
  const [chargeSetting, setChargeSetting] = useState({
    enable_low_battery_alarm: false,
    low_battery_alarm_value: 0,
  });
  const { powerStatus } = useVehicleStore(
    useShallow((state) => {
      return {
        powerStatus: state.powerStatus,
      };
    }),
  );
  const { robotChangeInfo } = useChargeStore(
    useShallow((state) => {
      return {
        robotChangeInfo: state.robotChangeInfo,
      };
    }),
  );

  const {
    run,
    loading,
    // data: serviceControlParam,
  } = useRequest(getChargingConfig, {
    manual: false,
    onSuccess: (response) => {
      setChargeSetting(response?.data);
    },
  });

  const postRun = useRequest(postChargingConfig, {
    manual: true,
  });

  // const { loading: loadingAccumulatedChargingDegrees, data: accumulatedChargingDegrees } =
  //   useRequest(getAccumulatedChargingDegrees);
  // const { loading: loadingAccumulatedChargingTimes, data: accumulatedChargingTimes } =
  //   useRequest(getAccumulatedChargingTimes);
  // const { loading: loadingLastFullChargeTime, data: lastFullChargeTime } = useRequest(getLastFullChargeTime);
  return (
    <div className='relative h-full rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm flex flex-col w-1/3 gap-4'>
      <motion.div className='w-full h-full rounded-2xl backdrop-blur-2xl p-4 flex flex-col'>
        <div className='flex-1 relative'>
          <div className='w-full'>
            <h2 className='text-lg font-bold mb-1'>{t('common.charging.vehicleBattery')}</h2>
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
          <div className='flex flex-row gap-4 mt-4 text-yellow-200'>
            <div className='rounded-md flex flex-1 items-center flex-col p-4 shadow-md shadow-yellow-400/20 bg-white/10'>
              <SvgIcon name='volt' size={48} />
              <div className=''>{voltage} V</div>
            </div>
            <div className='rounded-md flex flex-1 items-center flex-col p-4 shadow-md shadow-yellow-400/20 bg-white/10'>
              <SvgIcon name='ampere' size={48} />
              <div className=''>{current} A</div>
            </div>
            {false && (
              <div className='rounded-md flex flex-1 items-center flex-col p-4 shadow-md shadow-yellow-400/20 bg-white/10'>
                <SvgIcon name='celsius' size={48} />
                <div className=''>22.8℃</div>
              </div>
            )}
          </div>
          <div className='mt-4 flex flex-col gap-4'>
            <div className='bg-white/10 p-2 flex justify-between rounded-md'>
              <Typography.Text className='!m-0 font-bold '>{t('common.charging.lastFullChargeTime')}</Typography.Text>
              <Typography.Text className='!m-0 opacity-70'>
                {robotChangeInfo?.last_full_battery_time
                  ? dayjs(robotChangeInfo?.last_full_battery_time).format('YYYY-MM-DD HH:mm:ss')
                  : '-'}
                {/* {loadingLastFullChargeTime ? (
                  <Skeleton.Button active size='small' />
                ) : lastFullChargeTime?.data?.last_full_battery_time ? (
                  dayjs(lastFullChargeTime?.data?.last_full_battery_time).format('YYYY-MM-DD HH:mm:ss')
                ) : (
                  '-'
                )} */}
              </Typography.Text>
            </div>
            <div>
              <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                <Typography.Text className='!m-0 font-bold '>
                  {t('common.charging.accumulatedChargingTimes')}
                </Typography.Text>
                <Typography.Text className='!m-0 opacity-70'>
                  {robotChangeInfo?.charging_times || '-'}
                  {/* {loadingAccumulatedChargingTimes ? (
                    <Skeleton.Button active size='small' />
                  ) : (
                    (accumulatedChargingTimes?.data?.charging_times ?? '-')
                  )} */}
                </Typography.Text>
              </div>
              <span className='text-xs text-white/50'>{t('common.charging.accumulatedChargingTimesTip')}</span>
            </div>
            <div>
              <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                <Typography.Text className='!m-0 font-bold '>
                  {t('common.charging.accumulatedChargingDegrees')}
                </Typography.Text>
                <Typography.Text className='!m-0 opacity-70'>
                  {robotChangeInfo?.charging_degree ?? '-' + '°'}
                  {/* {loadingAccumulatedChargingDegrees ? (
                    <Skeleton.Button active size='small' />
                  ) : (
                    (accumulatedChargingDegrees?.data?.charging_degree ?? '-' + '°')
                  )} */}
                </Typography.Text>
              </div>
            </div>
            <div className='bg-white/10 rounded-md'>
              <div className=' p-2 flex justify-between '>
                <Typography.Text className='!m-0 font-bold '>{t('common.charging.lowPowerAlarm')}</Typography.Text>
                <Typography.Text className='!m-0 opacity-70'>
                  <Switch
                    value={chargeSetting?.enable_low_battery_alarm}
                    onChange={(checked) => {
                      postRun.run({
                        enable_low_battery_alarm: checked,
                        low_battery_alarm_value: chargeSetting?.low_battery_alarm_value,
                      });
                      run();
                    }}
                  />
                </Typography.Text>
              </div>
              {chargeSetting?.enable_low_battery_alarm && (
                <div className='flex flex-row px-4'>
                  <ThemeProvider
                    theme={{
                      components: {
                        Slider: {
                          handleSize: 20, // 滑块直径
                          railSize: 12, // 轨道高度
                          handleSizeHover: 24,
                        },
                      },
                    }}
                  >
                    <Slider
                      defaultValue={chargeSetting?.low_battery_alarm_value}
                      className={`swiper-no-swiping w-full m-0`}
                      min={0}
                      max={100}
                      onChangeComplete={(value) => {
                        postRun.run({
                          enable_low_battery_alarm: true,
                          low_battery_alarm_value: value,
                        });
                      }}
                    />
                  </ThemeProvider>
                </div>
              )}
            </div>
          </div>
          {/* 车辆图片与充电效果 */}
          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3'>
            {agvType && productImage() ? (
              <motion.img
                src={productImage()}
                // initial={{ filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' }}
                // animate={
                //   powerStatus.charge_status === 3
                //     ? { filter: 'drop-shadow(0 10px 10px rgba(255,0,255,0.5))' }
                //     : { filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))' }
                // }
                // transition={
                //   powerStatus.charge_status === 3
                //     ? { duration: 1.6, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }
                //     : { duration: 0 }
                // }
                className='w-full absolute bottom-4 '
              />
            ) : null}
          </div>
        </div>
        <div className='flex justify-end gap-2'>
          <Button
            type='primary'
            onClick={() => {
              setShowHistory(true);
            }}
          >
            {t('common.charging.chargingRecord')}
          </Button>
          {false && (
            <Button color='yellow' variant='solid'>
              {t('common.charging.abnormalRecord')}
            </Button>
          )}
          <ChargingHistory
            open={showHistory}
            onClose={() => {
              setShowHistory(false);
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
export default VehicleBattery;
