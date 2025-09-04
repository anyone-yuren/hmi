import { useGlobalStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { Button } from 'antd';
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
    <div className='relative flex w-full h-full items-center justify-center gap-4 p-4'>
      <div className='flex flex-1  h-full'>
        <Sensor loading={loading} data={data?.ElectronicControlsAndSensors ?? {}} reload={getMaintenance} />
      </div>
      <div className='flex flex-1  h-full'>
        <Running loading={loading} data={data?.RunningSystem ?? {}} reload={getMaintenance} />
      </div>
      <div className='flex flex-1  h-full'>
        {/* 玻璃卡片 */}
        <Lifting loading={loading} data={data?.LiftingSystem ?? {}} reload={getMaintenance} />
      </div>
      {resetLoading ? <LoadingReset /> : null}
      {(token === 'admin' || true) && (
        <div className='absolute bottom-8 left-8 z-10'>
          <Button type={'primary'} onClick={() => reset()}>
            {'重置全部'}
          </Button>
        </div>
        // <FloatButton
        //   shape='square'
        //   // style={{
        //   //   insetBlockEnd: 24,
        //   //   insetInlineEnd: 24,
        //   // }}
        //   icon={<Button>重置全部</Button>}
        //   // type={'primary'}
        //   // description={'重置全部'}
        //   onClick={() => reset()}
        // />
      )}
    </div>
  );
};

export default Maintenance;
