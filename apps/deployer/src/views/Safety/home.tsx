// import { ThemeProvider as ConfigProvider } from "antd-style";\
import { Tab, Tabs } from '@mui/material';
import React from 'react';

import CargoSpace from '@/views/Vision/components/settingPart/cargoSpace/index';
import { useTranslation } from 'react-i18next';
import Safety from './index';
const SafetyHome = () => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const template: any = {
    1: <Safety />,
    2: <CargoSpace />,
  };
  return (
    <div className='w-full h-full flex flex-col bg-white text-black !absolute left-0 top-0'>
      <Tabs value={value} onChange={handleChange} textColor='inherit'>
        <Tab label={t('deployer.safety.title')} value={1} />
        <Tab label={t('放货空间检测')} value={2} />
      </Tabs>
      <div className='flex-1 relative h-full'>{template[value]}</div>
    </div>
  );
};
export default SafetyHome;
