import ErrorPage from '@/components/ErrorPage';
import { memo, useEffect, useMemo } from 'react';
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

const SettingPart = (props: any) => {
  const { tabVisible, setTabVisible } = props;
  const { data: agvInfo, loading }: any = useRequest(() => config_agv_info(), {});
  const { disconnect, sendMessage, readyState, connect } = useVision();
  const { t } = useTranslation();

  const { pointCloudParams, setChassis, pointsCloudHeart, pointsCloudKey, setPointsCloudHeart } = useVisionStore(
    useShallow((store: any) => ({
      pointsCloudKey: store.pointsCloudKey,
      pointCloudParams: store.pointCloudParams,
      setChassis: store.setChassis,
      pointsCloudHeart: store.pointsCloudHeart,
      setPointsCloudHeart: store.setPointsCloudHeart,
    })),
  );

  const isConnectSuccess = useMemo(() => {
    return readyState === 1;
  }, [readyState]);

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
    readyState != 1 && setPointsCloudHeart(0);
  }, [readyState]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  if (!isConnectSuccess) {
    return (
      <ErrorPage
        loading={readyState === 0}
        refresh={() => {
          connect();
        }}
      />
    );
  }

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
