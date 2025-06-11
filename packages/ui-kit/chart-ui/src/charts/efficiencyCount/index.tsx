import { Icon } from '@iconify/react';
import React, { memo } from 'react';
import './index.css';
// import { useSignalRStore } from '@/views/dashboard/store/signalR';
import { useTranslation } from 'react-i18next';
import myImage from './circle.png';

interface IProps {
  data: any;
}
const EfficiencyCount = (props: IProps) => {
  const { t } = useTranslation();
  const statistics = React.useMemo(() => {
    return {
      useRatio: props?.data?.useRatio || 0, // 车辆利用率
      exceptionRatio: props?.data?.exceptionRatio || 0, // 故障占比
      trafficControl: props?.data?.trafficControl || 0, // 交管占比
      idleRatio: props?.data?.idleRatio || 0, // 空闲占比
      workRatio: props?.data?.workRatio || 0, // 运行占比
      chargeRatio: props?.data?.chargeRatio || 0, // 充电占比
    };
  }, [props]);

  const keys = [
    {
      key: 'useRatio',
      label: t('车辆利用率'),
      color: '#64e4ac',
      icon: <Icon className='text-[20px]' icon='hugeicons:lift-truck'></Icon>,
    },
    {
      key: 'workRatio',
      label: t('运行占比'),
      color: '#15c2bf',
      icon: <Icon className='text-[20px]' icon='mingcute:wheel-fill'></Icon>,
    },
    {
      key: 'idleRatio',
      label: t('空闲占比'),
      color: '#17a6f3',
      icon: <Icon className='text-[20px]' icon='ph:coffee-light'></Icon>,
    },
    {
      key: 'trafficControl',
      label: t('交管占比'),
      color: '#FFEB3B',
      icon: <Icon className='text-[20px]' icon='ph:traffic-cone-fill'></Icon>,
    },
    {
      key: 'chargeRatio',
      label: t('充电占比'),
      color: '#8BC34A',
      icon: <Icon className='text-[20px]' icon='fluent:battery-charge-32-regular'></Icon>,
    },
    {
      key: 'exceptionRatio',
      label: t('故障占比'),
      color: '#b54440',
      icon: <Icon className='text-[20px]' icon='bx:error'></Icon>,
    },
  ];
  return (
    <div className='h-full w-full px-[10px] gap-[5px] py-[5px] flex flex-wrap justify-center '>
      {keys?.map((obj: any) => {
        return (
          <div className='flex w-[135px] items-center justify-center flex-shrink-0' key={obj.key}>
            <div className='icon1 bg-[#00adff17] flex h-[100%] w-full items-center justify-center text-white pr-[5px]'>
              <div className='flex-1 pl-[10px]'>
                <div className='text-[12px] font-bold'>{obj.label}</div>
                <div className={`text-[18px] font-black`} style={{ color: obj.color }}>
                  {statistics[obj.key]}
                </div>
              </div>
              <div className='w-[40px] h-[40px] rounded-[30px] relative'>
                <img src={myImage} alt='' />
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>{obj.icon}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(EfficiencyCount);
