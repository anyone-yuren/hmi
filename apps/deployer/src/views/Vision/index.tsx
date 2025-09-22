import { Tab, Tabs, useTheme } from '@mui/material';
import React, { memo, useEffect, useMemo } from 'react';
import GlobalPanel from './components/GlobalPanel';
import ModelPart from './components/modelPart/index';
import CargoSpace from './components/settingPart/cargoSpace/index';
import SettingPart from './components/settingPart/index';
import useVision from './hooks/useVision';

import ErrorPage from '@/components/ErrorPage';
import { useRequest, useUpdateEffect } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { config_agv_info } from './services/index';
import { useVisionStore } from './store/vision.store';

const Vision = () => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const { data: agvInfo, loading }: any = useRequest(() => config_agv_info(), {});
  const { disconnect, sendMessage, readyState, connect } = useVision();
  const { t } = useTranslation();

  const { pointCloudParams, setChassis, pointsCloudHeart, pointsCloudKey } = useVisionStore(
    useShallow((store: any) => ({
      pointsCloudKey: store.pointsCloudKey,
      pointCloudParams: store.pointCloudParams,
      setChassis: store.setChassis,
      pointsCloudHeart: store.pointsCloudHeart,
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
    return () => {
      disconnect();
    };
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const TabPanel = (props: any) => {
    const { children, value, index, ...other } = props;
    return (
      <GlobalPanel
        role='tabpanel'
        className='h-full'
        hidden={value !== index}
        id={`full-minWidth-tabpanel-${index}`}
        aria-labelledby={`full-minWidth-tab-${index}`}
        {...other}
      >
        {value === index && <div className='h-full'>{children}</div>}
      </GlobalPanel>
    );
  };
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
    <div className='flex gap-4 flex-col h-full p-[20px]'>
      <div className='flex-1 overflow-auto'>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <SettingPart />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <ModelPart />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <CargoSpace />
        </TabPanel>
      </div>
      <Tabs variant='fullWidth' value={value} onChange={handleChange}>
        <Tab sx={{ fontSize: 20 }} label={t('deployer.vision.paramSetting')} />
        <Tab sx={{ fontSize: 20 }} label={t('deployer.vision.modelLibrary')} />
        {false && <Tab sx={{ fontSize: 20 }} label={t('deployer.vision.placeSpaceCheck')} />}
      </Tabs>
    </div>
  );
};

export default memo(Vision);
