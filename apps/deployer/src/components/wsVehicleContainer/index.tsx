import { useVehicle } from '@/hooks/useVehicle';
import { memo } from 'react';
const WsVehicleContainer = () => {
  useVehicle();
  return null;
};
export default memo(WsVehicleContainer);
