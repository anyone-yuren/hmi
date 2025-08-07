import { Tab, Tabs } from '@mui/material';
import React, { memo, Suspense, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Load = () => {
  const { t } = useTranslation();
  const [key, setKey] = useState<any>('pose');
  const [value, setValue] = React.useState(0);
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const hashMap: any = {
      0: 'pose',
      1: 'sideway',
      2: 'space',
    };
    setValue(newValue);
    setKey(hashMap[newValue]);
  };

  const Pose = React.lazy(() => import('./pose'));
  const Sideway = React.lazy(() => import('./sideway'));
  const Space = React.lazy(() => import('./space'));
  const renderTemplate: any = useMemo(() => {
    return {
      pose: <Pose />,
      sideway: <Sideway />,
      space: <Space />,
    };
  }, []);

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label='basic tabs example'
        sx={{
          marginTop: '-30px',
          position: 'fixed',
          width: '88%',
          background: 'white',
          zIndex: 2,
        }}
      >
        <Tab label={t('deployer.vision.truckPlacePoseDetect')} iconPosition='end' {...a11yProps(0)} />
        <Tab label={t('deployer.vision.truckPlaceForkMovePoseDetect')} iconPosition='end' {...a11yProps(1)} />
        <Tab label={t('deployer.vision.truckGapDetect')} iconPosition='end' {...a11yProps(2)} />
      </Tabs>
      <div className='h-[40px]'></div>
      <div className='text-black'>
        <Suspense fallback={<span>loading...</span>}>{renderTemplate?.[key] || '-'}</Suspense>
      </div>
    </>
  );
};

export default memo(Load);
