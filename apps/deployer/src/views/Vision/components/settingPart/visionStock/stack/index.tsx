import { Tab, Tabs } from '@mui/material';
import { useRequest } from 'ahooks';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ChipComp from '../../comp/chip';
import LightTheme from '../../comp/lightTheme';
import PlaceMove from './placeMove';
import PoseDetect from './poseDetect';

import { getStackPlaceMoveVehicleRead, getStackPlacePalletPositionDetectRead } from '@/views/Vision/services/index';

// 堆叠设置
const FlatWingSetting = () => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);

  const { data: visionPlaceResponse } = useRequest(getStackPlacePalletPositionDetectRead);
  const { data: visionMoveResponse } = useRequest(getStackPlaceMoveVehicleRead);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const vision = useMemo(() => {
    return {
      place: visionPlaceResponse?.data,
      isPlaceOnline: visionPlaceResponse?.data?.need_detect?.value,
      move: visionMoveResponse?.data,
      isMoveOnline: visionMoveResponse?.data?.need_detect?.value,
    };
  }, [visionPlaceResponse, visionMoveResponse]);

  const template: any = {
    0: <PoseDetect initState={vision.place}></PoseDetect>,
    1: <PlaceMove initState={vision.move}></PlaceMove>,
  };

  return (
    <>
      <LightTheme>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
          sx={{
            marginTop: '-40px',
            position: 'fixed',
            width: '88%',
            background: 'white',
            zIndex: 2,
          }}
        >
          <Tab
            label={t('deployer.vision.firstVision')}
            icon={<ChipComp isOnline={vision.isPlaceOnline}></ChipComp>}
            iconPosition='end'
            {...a11yProps(0)}
          />
          <Tab
            label={t('deployer.vision.secondVision')}
            icon={<ChipComp isOnline={vision.isMoveOnline}></ChipComp>}
            iconPosition='end'
            {...a11yProps(1)}
          />
        </Tabs>
        <div className='h-[40px]'></div>
        {template?.[value] || '-'}
      </LightTheme>
    </>
  );
};

export default memo(FlatWingSetting);
