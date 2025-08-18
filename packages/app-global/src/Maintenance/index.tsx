import { useRequest } from 'ahooks';
import { useTheme } from 'antd-style';
import Lifting from './components/lifting';
import Running from './components/running';
import Sensor from './components/sensor';
import { getMaintenanceData } from './services';

const Maintenance = () => {
  const { data, loading } = useRequest(getMaintenanceData);
  const theme = useTheme();
  return (
    <div className='flex w-full h-full items-center justify-center gap-4 p-4'>
      <div className='flex flex-1  h-full'>
        <Sensor loading={loading} />
      </div>
      <div className='flex flex-1  h-full'>
        <Running loading={loading} />
      </div>
      <div className='flex flex-1  h-full'>
        {/* 玻璃卡片 */}
        <Lifting loading={loading} />
      </div>
    </div>
  );
};

export default Maintenance;
