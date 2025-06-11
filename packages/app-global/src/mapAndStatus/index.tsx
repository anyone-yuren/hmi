import { useRcsDict } from '@gbeata/hooks';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SignalR from '../components/signalR';
import Mapping from './pages/Mapping';

export default function PointCloudPage() {
  const { i18n } = useTranslation();
  const { getRcsDict } = useRcsDict();

  useEffect(() => {
    getRcsDict({});
  }, [i18n.language]);

  // return <PointCloud />;
  return (
    <>
      <SignalR
        keyMessage={[
          'VehicleStateMessage',
          'GetVehicleStateMessage',
          'StorageStateMessage',
          'MonitorMessage',
          'ChargingStationState',
        ]}
      >
        <Mapping />
      </SignalR>
    </>
  );
}
