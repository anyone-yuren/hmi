import { Tab, Tabs } from '@mui/material';
import React, { memo, Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import Points from "./points";

const Observe = () => {
  const { t } = useTranslation();
  const [key, setKey] = useState<any>('points');
  const [value, setValue] = React.useState(0);
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const hashMap: any = {
      0: 'points',
      1: 'load',
      2: 'unload',
    };
    setValue(newValue);
    setKey(hashMap[newValue]);
  };

  const Points = React.lazy(() => import('./points'));
  const Load = React.lazy(() => import('./load'));
  const UnLoad = React.lazy(() => import('./unload'));
  const renderTemplate: any = {
    points: <Points />,
    load: <Load />,
    unload: <UnLoad />,
  };

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
        <Tab label={t('deployer.vision.pointSetting')} iconPosition='end' {...a11yProps(0)} />
        <Tab label={t('deployer.vision.load')} iconPosition='end' {...a11yProps(1)} />
        <Tab label={t('deployer.vision.unload')} iconPosition='end' {...a11yProps(2)} />
      </Tabs>
      <div className='h-[40px]'></div>
      <div className='text-black'>
        <Suspense fallback={<span>loading...</span>}>{renderTemplate?.[key] || '-'}</Suspense>
      </div>
    </>
  );
};

export default memo(Observe);
