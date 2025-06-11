import { Icon } from '@iconify/react';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';

// import { useSignalRStore } from '@/views/dashboard/store/signalR';
import abnormalImage from './abnormal.png';
import chargeImage from './charge.png';
import offlineImage from './offline.png';
import onlineImage from './online.png';
import runningImage from './running.png';

interface IProps {
  data: any;
}
const VehicleState = (props: IProps) => {
  console.log('[VehicleState]:props', props);
  const { t } = useTranslation();
  const statistics = React.useMemo(() => {
    return {
      onlineCount: props?.data?.onlineCount || 0,
      offlineCount: props?.data?.offlineCount || 0,
      abnormalCount: props?.data?.abnormalCount || 0,
      freeCount: props?.data?.freeCount || 0,
      carryCount: props?.data?.carryCount || 0,
      chargeCount: props?.data?.chargeCount || 0,
    };
  }, [props]);

  const keys = [
    {
      key: 'onlineCount',
      label: t('在线'),
      image: onlineImage,
      color: '#64e4ac',
      icon: <Icon className='text-[20px] text-[#64e4ac]' icon='hugeicons:lift-truck'></Icon>,
    },
    {
      key: 'offlineCount',
      label: t('离线'),
      color: '#ccc',
      image: offlineImage,
      icon: <Icon className='text-[20px] text-[#ccc]' icon='hugeicons:lift-truck'></Icon>,
    },
    {
      key: 'carryCount',
      label: t('搬运'),
      color: '#15c2bf',
      image: runningImage,
      icon: <Icon className='text-[20px] text-[#15c2bf]' icon='mingcute:wheel-fill'></Icon>,
    },
    {
      key: 'freeCount',
      label: t('空闲'),
      color: '#17a6f3',
      icon: <Icon className='text-[20px] text-[#17a6f3]' icon='ph:coffee-light'></Icon>,
    },
    {
      key: 'chargeCount',
      label: t('充电'),
      image: chargeImage,
      color: '#8BC34A',
      icon: <Icon className='text-[20px] text-[#8BC34A]' icon='fluent:battery-charge-32-regular'></Icon>,
    },
    {
      key: 'abnormalCount',
      label: t('异常'),
      color: '#b54440',
      image: abnormalImage,
      icon: <Icon className='text-[20px]  text-[#b54440]' icon='bx:error'></Icon>,
    },
  ];
  return (
    <div className='h-full w-full px-[10px] py-5 flex flex-wrap justify-center'>
      {keys?.map((obj: any) => {
        return (
          <div className='flex w-[135px] items-center justify-center flex-shrink-0' key={obj.key}>
            <div className=' flex  w-full items-center justify-center text-white py-[3px] pr-[5px]'>
              <div className='flex'>
                <div className='w-[40px] h-[40px] rounded-[30px] relative'>
                  <img src={obj.image || onlineImage} alt='' />
                  <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                    {obj.icon}
                  </div>
                </div>
                <div className='flex-1 pl-[10px]'>
                  <div className='text-[12px] w-[50px] font-bold'>{obj.label}</div>
                  <div className={`text-[18px] font-black`} style={{ color: obj.color }}>
                    {statistics[obj.key]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(VehicleState);
