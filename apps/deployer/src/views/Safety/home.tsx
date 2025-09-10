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
    <div className='w-full h-full flex flex-col bg-white text-black'>
      <Tabs className='pt-[20px] pl-[20px]' value={value} onChange={handleChange} textColor='inherit'>
        <Tab label={t('deployer.safety.title')} value={1} />
        <Tab label={t('deployer.vision.placeSpaceCheck')} value={2} />
      </Tabs>
      <div className='flex-1'>{template[value]}</div>
    </div>
  );
};
export default SafetyHome;
