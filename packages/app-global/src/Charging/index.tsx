import { AppstoreOutlined, ColumnWidthOutlined, DotChartOutlined, SnippetsOutlined } from '@ant-design/icons';
import { useVehicleStore } from '@gbeata/store';
import { Divider, Stack } from '@mui/material';
import { Button, Modal, Result, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import AnimateBrush from './components/animateBrush';
import VehicleBattery from './components/vehicleBattery';

const Charging = () => {
  const { t } = useTranslation();
  const [modal, contextHolder] = Modal.useModal();
  console.log(11111);

  const { powerStatus } = useVehicleStore(
    useShallow((state) => {
      return {
        powerStatus: state.powerStatus,
      };
    }),
  );
  // 有无任务
  const [hasTask, setHasTask] = useState(false);
  return (
    <div className='flex flex-row gap-4 p-4 h-full'>
      {/* 小车模块 */}
      <VehicleBattery />
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
                        onOk() {
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
              <div className='flex flex-row gap-4'>
                <div className='rounded-md flex flex-1 items-center flex-col p-2 shadow-md shadow-[#22d3ee]/20 bg-white/10'>
                  <SvgIcon name='volt' size={32} />
                  <div className=''>22.8V</div>
                </div>
                <div className='rounded-md flex flex-1 items-center flex-col p-2 shadow-md shadow-[#22d3ee]/20 bg-white/10'>
                  <SvgIcon name='ampere' size={32} />
                  <div className=''>22.8A</div>
                </div>
                <div className='rounded-md flex flex-1 items-center flex-col p-2 shadow-md shadow-[#22d3ee]/20 bg-white/10'>
                  <SvgIcon name='brush' size={32} />
                  <div className=''>22.8℃</div>
                </div>
              </div>
              <div>
                <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                  <Typography.Text className='!m-0 font-bold '>{t('common.charging.ip')}</Typography.Text>
                  <Typography.Text className='!m-0 opacity-70'>192.168.1.1</Typography.Text>
                </div>
              </div>
              <div>
                <div className='bg-white/10 p-2 flex justify-between rounded-md'>
                  <Typography.Text className='!m-0 font-bold '>{t('common.charging.status')}</Typography.Text>
                  <Typography.Text className='!m-0 opacity-70'>
                    {powerStatus.charge_status === 4 ? t('common.charging.charging') : t('common.charging.stop')}
                  </Typography.Text>
                </div>
                <span className='text-xs text-white/50'>{t('common.charging.totalTimes')}</span>
              </div>
            </div>
            {/* 充电任务 */}
            <div className='flex flex-1  rounded-2xl bg-white/10 flex-col overflow-y-auto'>
              <div className='w-full'>
                <Stack
                  className='flex p-4 flex-1 items-center justify-between'
                  direction='row'
                  gap={4}
                  divider={<Divider orientation='vertical' flexItem />}
                >
                  <div className='flex flex-col items-center justify-center relative'>
                    <div className='text-sm font-bold flex gap-1 items-center '>
                      <SnippetsOutlined />
                      {t('common.charging.taskNo')}
                    </div>
                    <div className='text-sm opacity-70'>10002912</div>
                  </div>
                  <div className='flex flex-col items-center justify-center relative'>
                    <div className='text-sm font-bold flex gap-1 items-center'>
                      <ColumnWidthOutlined />
                      {t('common.charging.positionDeviation')}(mm)
                    </div>
                    <div className='text-sm opacity-70'>x:2300 y:2300 4°</div>
                  </div>
                  <div className='flex flex-col items-center justify-center relative'>
                    <div className='text-sm font-bold flex gap-1 items-center'>
                      <AppstoreOutlined />
                      {t('common.charging.chargeType')}
                    </div>
                    <div className='text-sm opacity-70'>{t('common.charging.autoCharge')}</div>
                  </div>
                  <div className='flex flex-col items-center justify-center relative'>
                    <div className='text-sm font-bold flex gap-1 items-center'>
                      <DotChartOutlined />
                      {t('common.charging.targetEnergy')}
                    </div>
                    <div className='text-sm opacity-70'>99%</div>
                  </div>
                </Stack>
              </div>
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
