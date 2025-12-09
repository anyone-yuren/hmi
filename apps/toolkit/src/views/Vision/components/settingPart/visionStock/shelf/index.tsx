import { useVisionStore } from '@/views/Vision/store/vision.store';
import { Tab, Tabs } from '@mui/material';
import { useRequest } from 'ahooks';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import ChipComp from '../../comp/chip';
import LightTheme from '../../comp/lightTheme';
import PlaceMove from './placeMove';
import PoseDetect from './poseDetect';

import { getShelfPlaceMoveVehicleRead, getShelfPlacePalletPositionDetectRead } from '@/views/Vision/services/index';

// 堆叠设置
const ShelfSetting = () => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  const { isTrilateral } = useVisionStore(
    useShallow((store: any) => ({
      isTrilateral: store.isTrilateral,
    })),
  );

  const { data: visionPlaceResponse, run: getPlaceResponse } = useRequest(getShelfPlacePalletPositionDetectRead);
  const { data: visionMoveResponse, run: getMoveResponse } = useRequest(getShelfPlaceMoveVehicleRead);
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
    0: <PoseDetect initState={vision.place} getResponse={getPlaceResponse}></PoseDetect>,
    1: <PlaceMove initState={vision.move} getResponse={getMoveResponse}></PlaceMove>,
  };

  return (
    <>
      <LightTheme>
        {!isTrilateral() ? (
          <>
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
          </>
        ) : (
          <PlaceMove initState={vision.move} />
        )}
      </LightTheme>
    </>
  );
};

export default memo(ShelfSetting);
