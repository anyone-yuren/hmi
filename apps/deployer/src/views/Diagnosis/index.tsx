import { Tab, Tabs } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Current from './components/current';
import DiagnosisComp from './components/diagnosis';
import History from './components/history';

type TCompKey = 'current' | 'history' | 'diagnosis';
const Diagnosis = () => {
  const [compKey, setCompKey] = useState<TCompKey>('current');
  const { t } = useTranslation();

  const onChange = (event: React.SyntheticEvent, key: TCompKey) => {
    setCompKey(key);
  };

  const compHashMap = {
    current: <Current />,
    diagnosis: <DiagnosisComp />,
    history: <History />,
  };
  const comp = useMemo(() => {
    return compHashMap[compKey];
  }, [compKey]);
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: 'dark',
          primary: {
            main: '#00D1D1',
          },
        },
      })}
    >
      <div className='flex gap-4 flex-col h-full p-[20px]'>
        <div className='flex-1 overflow-y-auto'>
          <div className='w-full h-full p-[20px] bg-[#445260] rounded-[20px]'>{comp}</div>
        </div>
        <div>
          <Tabs variant='fullWidth' value={compKey} onChange={onChange} className='w-full'>
            <Tab value='current' label='车辆当前故障' />
            <Tab value='history' label='车辆历史故障' />
            <Tab value='diagnosis' label='常见问题诊断' />
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
};
export default Diagnosis;
