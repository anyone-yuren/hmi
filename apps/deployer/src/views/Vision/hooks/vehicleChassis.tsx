import { useLocalStorageState, useRequest } from 'ahooks';
import { useMemo } from 'react';
import { config_agv_info } from '../services/index';

const useVehicleChassis = () => {
  const { data: agvInfo, loading }: any = useRequest(() => config_agv_info(), {});
  const [localVehicleChassis, setLocalVehicleChassis] = useLocalStorageState('localVehicleChassis', {
    defaultValue: 'STACKER',
  });
  const vehicleChassis = useMemo(() => {
    /*
      STACKER,      // 堆高 SL14
      PALLET ,       // 托盘车 X20
      FORWARD,      // R车前移 R20s
      BALANCE ,     // 平衡重 SE15
      TRILATERAL,  // K车三向叉 K1
      OMNI_FORWARD, // 全向车 O20
      X20S: X20S
    */
    if (agvInfo?.is_x20s) {
      return 'X20S';
    }
    const chassisHashMap: any = {
      1: 'STACKER',
      2: 'PALLET',
      3: 'FORWARD',
      9: 'BALANCE',
      13: 'TRILATERAL',
      14: 'OMNI_FORWARD',
    };
    // return localVehicleChassis;
    const chassis = agvInfo ? agvInfo?.executor : 2;
    return chassisHashMap?.[chassis] || chassisHashMap?.[2];
  }, [agvInfo, localVehicleChassis]);

  const isTrilateral = useMemo(() => {
    return vehicleChassis === 'TRILATERAL';
  }, [vehicleChassis]);

  return { vehicleChassis, isTrilateral, loading };
};

export default useVehicleChassis;
