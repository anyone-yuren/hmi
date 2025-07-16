import { Tab, Tabs } from '@mui/material';
import { useResponsive } from 'antd-style';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type TCompKey = 'current' | 'history' | 'diagnosis';
const Diagnosis = () => {
  const [compKey, setCompKey] = useState<TCompKey>('current');
  const { t } = useTranslation();
  const responsive = useResponsive();
  const navigate = useNavigate();
  return (
    <div className='flex gap-4 flex-col h-full'>
      <div className='flex-1 overflow-y-auto'></div>
      <div>
        <Tabs value={compKey} className='w-full'>
          <Tab value='current' label='车辆当前故障' />
          <Tab value='history' label='车辆历史故障' />
          <Tab value='diagnosis' label='常见问题诊断' />
        </Tabs>
      </div>
    </div>
  );
};
export default Diagnosis;
