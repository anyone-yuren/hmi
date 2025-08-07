import { memo, useEffect } from 'react';
import useVision from '../../hooks/useVision';
import CargoState from './cargoState/index';
import VisionPick from './visionPick/index';
import VisionStock from './visionStock/index';

import { useRequest, useUpdateEffect } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { config_agv_info } from '../../services/index';
import { useVisionStore } from '../../store/vision.store';
import TruckLoad from './truckload/index';

const SettingPart = () => {
  const { data: agvInfo, loading }: any = useRequest(() => config_agv_info(), {});
  const { disconnect, sendMessage, readyState } = useVision();
  const { t } = useTranslation();

  const { pointCloudParams, setChassis, pointsCloudHeart, pointsCloudKey } = useVisionStore(
    useShallow((store: any) => ({
      pointsCloudKey: store.pointsCloudKey,
      pointCloudParams: store.pointCloudParams,
      setChassis: store.setChassis,
      pointsCloudHeart: store.pointsCloudHeart,
    })),
  );

  useEffect(() => {
    agvInfo?.executor && setChassis(agvInfo?.executor);
  }, [agvInfo]);

  useUpdateEffect(() => {
    readyState === 1 && sendMessage(JSON.stringify({ uri: '/cv_mwrobot/roi_dist', data: pointCloudParams }));
  }, [pointCloudParams, readyState]);

  useUpdateEffect(() => {
    readyState === 1 &&
      pointsCloudHeart > 0 &&
      sendMessage(
        JSON.stringify({
          uri: '/cv_mwrobot/heartbeat',
          data: { heart: pointsCloudHeart, key: pointsCloudKey },
        }),
      );
  }, [pointsCloudHeart, readyState, pointsCloudKey]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <>
      <div className='flex flex-wrap flex-col h-full w-full gap-[20px] pr-[20px]'>
        <VisionPick></VisionPick>
        <CargoState></CargoState>
        <VisionStock></VisionStock>
        <TruckLoad></TruckLoad>
      </div>
    </>
  );
};

export default memo(SettingPart);
