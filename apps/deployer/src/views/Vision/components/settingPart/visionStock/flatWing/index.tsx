import { Tab, Tabs } from '@mui/material';
import { useRequest } from 'ahooks';
import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ChipComp from '../../comp/chip';
import LightTheme from '../../comp/lightTheme';
import PlaceMove from './placeMove';
import PoseDetect from './poseDetect';

import { getFlatPlaceMoveVehicleRead, getFlatPlacePalletPositionDetectRead } from '@/views/Vision/services/index';

// 堆叠设置
const StackSetting = () => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  // const { isTrilateral } = useVisionStore(
  //   useShallow((store: any) => ({
  //     isTrilateral: store.isTrilateral,
  //   }))
  // );

  const { data: visionPlaceResponse } = useRequest(getFlatPlacePalletPositionDetectRead);
  const { data: visionMoveResponse } = useRequest(getFlatPlaceMoveVehicleRead);
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
        {/* K车只有第二次视觉,其他车都有,堆叠场景没有K车。先把K车的注释拿掉，后面再看*/}
        {/* {!isTrilateral() ? (
          <> */}
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
          sx={{
            marginTop: '-40px',
            position: 'fixed',
            background: 'white',
            width: '88%',
            zIndex: 2,
          }}
        >
          <Tab
            label={t('第一次视觉')}
            icon={<ChipComp isOnline={vision.isPlaceOnline}></ChipComp>}
            iconPosition='end'
            {...a11yProps(0)}
          />
          <Tab
            label={t('第二次视觉')}
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

export default memo(StackSetting);
