import x20 from '@/assets/img/x20.png';
import { Button } from 'antd';
import BatteryInfo from './components/battery';
import ElectricInfo from './components/electric';
import SensorInfo from './components/sensor';
const Maintenance = () => {
  return (
    <div className='flex h-full flex-col gap-4 p-4'>
      <div className='flex-1 grid grid-cols-2 gap-4'>
        <div className='col-span-1 flex items-center relative'>
          <div className='absolute top-0 flex w-full justify-between gap-4'>
            <div className='flex flex-col gap-4'>
              <h2 className='text-3xl font-bold'>维保信息</h2>
              <p className='text-base'>
                运行天数：<span className='font-bold text-teal-400'>100</span> / 365 天
              </p>
              <p className='text-base'>
                运行里程：<span className='font-bold text-teal-400'>100 </span> / 1000 公里
              </p>
              <p className='text-base'>
                运行时间：<span className='font-bold text-teal-400'>100 </span> / 10000 小时
              </p>
            </div>
          </div>
          <img src={x20} alt='' />
          <div className='flex gap-4 absolute bottom-0 right-0'>
            <Button size='large' type='primary'>
              维保查询
            </Button>
            <Button size='large' type='primary'>
              维保记录
            </Button>
          </div>
        </div>
        <div className='flex gap-4 flex-col'>
          <BatteryInfo />
          <SensorInfo />
          <ElectricInfo />
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
