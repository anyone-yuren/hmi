import { AppstoreOutlined, ColumnWidthOutlined, DotChartOutlined, SnippetsOutlined } from '@ant-design/icons';
import { useVehicleStore } from '@gbeata/store';
import { Divider, Stack } from '@mui/material';
import { Button, Modal, Result, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import AnimateBrush from './components/animateBrush';
import VehicleBattery from './components/vehicleBattery';
import WsContainer from './components/wsContainer';
import { postChargingFunction } from './services/index';

const Charging = () => {
  const { t, i18n } = useTranslation();
  const [modal, contextHolder] = Modal.useModal();
  const [hasTask, setHasTask] = useState(true);
  const { powerStatus, chargePileStatus, taskInfo } = useVehicleStore(
    useShallow((state) => {
      return {
        powerStatus: state.powerStatus,
        chargePileStatus: state.chargePileStatus,
        taskInfo: state.taskInfo,
      };
    }),
  );

  const temperatureTitle = useMemo(() => {
    if (!chargePileStatus?.temperature_value) {
      return chargePileStatus?.temperature_status === 1 ? (
        <span className='text-[#d32029]'>{t('common.abnormal')}</span>
      ) : (
        t('common.normal')
      );
    }
    return `${chargePileStatus?.temperature_value}°C`;
  }, [chargePileStatus?.temperature_value, chargePileStatus?.temperature_status, i18n.language]);

  useEffect(() => {
    if (taskInfo?.operate_identification === 3) {
      setHasTask(true);
    }
  }, [taskInfo?.operate_identification]);
  // 有无任务

  const powerStatusHashmap = useMemo(() => {
    return {
      1: t('common.charging.stop'),
      2: t('common.charging.readyCharging'),
      3: t('common.charging.charging'),
      4: t('common.charging.success'),
    };
  }, [i18n.language]);

  useEffect(() => {
    if (chargePileStatus?.charge_status === 1) {
      setHasTask(false);
    } else {
      setHasTask(true);
    }
  }, [chargePileStatus?.charge_status]);
  const isConnect = useMemo(() => {
    return chargePileStatus?.connect_status === 1;
  }, [chargePileStatus?.connect_status]);

  return (
    <div className='flex flex-row gap-4 p-4 h-full'>
      <WsContainer></WsContainer>
      {/* 小车模块 */}
      <VehicleBattery voltage={powerStatus?.voltage || 0} current={powerStatus?.current || 0} />
      {/* 电池模块 */}
      <div className='flex gap-4 items-center flex-1 '>
        {!hasTask ? (
          <div className='p-[2px] w-full h-full rounded-2xl bg-white/10 relative flex flex-col gap-2'>
            <div className='flex h-full items-center justify-between p-2  shadow-sm rounded-2xl'>
              <Result
                className='w-full flex flex-col items-center justify-center'
                status='success'
                title={t('common.charging.nodata')}
                subTitle={t('common.charging.confirm')}
                icon={<SvgIcon name='stationNodata' size={380} />}
                extra={
                  <Button
                    type='primary'
                    onClick={() => {
                      modal.confirm({
                        content: (
                          <div>
                            <div>1.{t('common.charging.confirm1')}</div>
                            <div>2.{t('common.charging.confirm2')}</div>
                            <div>3.{t('common.charging.confirm3')}</div>
                          </div>
                        ),
                        okText: t('common.confirm'),
                        cancelText: t('common.cancel'),
                        async onOk() {
                          await postChargingFunction({ cmd: 'StartCharge' });
                          setHasTask(true);
                        },
                        onCancel() {
                          console.log('Cancel');
                        },
                      });
                    }}
                  >
                    {t('common.charging.chargeNow')}
                  </Button>
                }
              />
            </div>
          </div>
        ) : (
          <div className='h-full w-full flex flex-col gap-4'>
            <div className='p-4 flex flex-col gap-4 bg-white/10 rounded-2xl'>
              <h2 className='text-lg font-bold mb-0'>{t('common.charging.stationInfo')}</h2>
              {/* {isConnect ? ( */}
              <div className='flex flex-row gap-4 relative'>
                <div className='rounded-md absolute w-full h-full top-0 left-0 bg-[#0000009e] shadow-md shadow-[#000000]/80 text-white flex items-center justify-center'>
                  {t('common.charging.notConnecting')}
                </div>
                <div className='rounded-md flex flex-1 items-center flex-col p-2 shadow-md shadow-[#22d3ee]/20 bg-white/10'>
                  <SvgIcon name='volt' size={32} />
                  <div className=''>{chargePileStatus?.output_voltage?.toFixed(2) || 0} V</div>
                </div>
                <div className='rounded-md flex flex-1 items-center flex-col p-2 shadow-md shadow-[#22d3ee]/20 bg-white/10'>
                  <SvgIcon name='ampere' size={32} />
                  <div className=''>{chargePileStatus?.output_current?.toFixed(2) || 0} A</div>
                </div>

                <div className='rounded-md flex flex-1 items-center flex-col p-2 shadow-md shadow-[#22d3ee]/20 bg-white/10'>
                  <SvgIcon name='brush' size={32} />
                  <div className=''>{temperatureTitle}</div>
                </div>
              </div>
              {/* ) : null} */}
              <div>
                <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                  <Typography.Text className='!m-0 font-bold '>{t('common.charging.ip')}</Typography.Text>
                  <Typography.Text className='!m-0 opacity-70'>{chargePileStatus?.ip || '-'}</Typography.Text>
                </div>
              </div>
              <div>
                <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                  <Typography.Text className='!m-0 font-bold '>{t('common.charging.status')}</Typography.Text>
                  <Typography.Text className='!m-0 opacity-70'>
                    {/* {powerStatus.charge_status === 3 ? t('common.charging.charging') : t('common.charging.stop')} */}
                    {powerStatusHashmap[powerStatus.charge_status]}
                  </Typography.Text>
                </div>
                <span className='text-xs text-white/50'>{t('common.charging.totalTimes')}</span>
              </div>
            </div>
            {/* 充电任务 */}
            <div className='flex flex-1  rounded-2xl bg-white/10 flex-col overflow-y-auto'>
              {/* {isConnect ? ( */}
              <div className='w-full'>
                <Stack
                  className='flex p-4 flex-1 items-center'
                  direction='row'
                  gap={4}
                  divider={<Divider orientation='vertical' flexItem />}
                >
                  <div className='flex-1 flex flex-col items-center justify-center relative'>
                    <div className='text-sm font-bold flex gap-1 items-center '>
                      <SnippetsOutlined />
                      {t('common.charging.taskNo')}
                    </div>
                    <div className='text-sm opacity-70'>{taskInfo?.task_id || '-'}</div>
                  </div>
                  <div className='flex-1 flex flex-col items-center justify-center relative'>
                    <div className='text-sm font-bold flex gap-1 items-center'>
                      <ColumnWidthOutlined />
                      {t('common.charging.positionDeviation')}(mm)
                    </div>
                    <div className='text-sm opacity-70'>
                      x:{taskInfo?.error_x?.toFixed(2) || '-'} y:{taskInfo?.error_y?.toFixed(2) || '-'}{' '}
                      {taskInfo?.error_angle?.toFixed(2) || '-'}°
                    </div>
                  </div>
                  {false && (
                    <div className='flex flex-col items-center justify-center relative'>
                      <div className='text-sm font-bold flex gap-1 items-center'>
                        <AppstoreOutlined />
                        {t('common.charging.chargeType')}
                      </div>
                      <div className='text-sm opacity-70'>{t('common.charging.autoCharge')}</div>
                    </div>
                  )}
                  <div className='flex-1 flex flex-col items-center justify-center relative'>
                    <div className='text-sm font-bold flex gap-1 items-center'>
                      <DotChartOutlined />
                      {t('common.charging.targetEnergy')}
                    </div>
                    <div className='text-sm opacity-70'>
                      {`${taskInfo.task_value2 || 100}${taskInfo.task_value1 === 3 ? 'h' : '%'}`}
                    </div>
                  </div>
                </Stack>
              </div>
              {/* ) : null} */}
              {/* 刷版动画 */}
              <AnimateBrush />
            </div>
          </div>
        )}
      </div>
      {contextHolder}
    </div>
  );
};

export default Charging;
