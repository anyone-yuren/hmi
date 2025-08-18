import { UndoOutlined } from '@ant-design/icons';
import { useGlobalStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { FloatButton } from 'antd';
import { useTheme } from 'antd-style';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Lifting from './components/lifting';
import LoadingReset from './components/resetLoading';
import Running from './components/running';
import Sensor from './components/sensor';
import { getMaintenanceData, resetMaintenance } from './services';

const Maintenance = () => {
  const {
    data,
    loading,
    run: getMaintenance,
  } = useRequest(getMaintenanceData, {
    manual: true,
  });
  const { token } = useGlobalStore(
    useShallow((state) => ({
      token: state.token,
    })),
  );
  const { run: reset, loading: resetLoading } = useRequest(resetMaintenance, {
    manual: true,
    onSuccess: () => {
      getMaintenance();
    },
  });

  useEffect(() => {
    getMaintenance();
  }, []);

  const theme = useTheme();
  return (
    <div className='flex w-full h-full items-center justify-center gap-4 p-4'>
      <div className='flex flex-1  h-full'>
        <Sensor loading={loading} data={data?.data?.electronicControlsAndSensors ?? {}} />
      </div>
      <div className='flex flex-1  h-full'>
        <Running loading={loading} data={data?.data?.runningSystem ?? {}} />
      </div>
      <div className='flex flex-1  h-full'>
        {/* 玻璃卡片 */}
        <Lifting loading={loading} data={data?.data?.liftingSystem ?? {}} />
      </div>
      {resetLoading ? <LoadingReset /> : null}
      {token === 'admin' && <FloatButton shape='circle' icon={<UndoOutlined />} onClick={() => reset()} />}
    </div>
  );
};

export default Maintenance;
