import PanelLoading from '@/components/PanelLoading';
import { RedoOutlined } from '@ant-design/icons';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularAlt1BarIcon from '@mui/icons-material/SignalCellularAlt1Bar';
import SignalCellularAlt2BarIcon from '@mui/icons-material/SignalCellularAlt2Bar';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { SvgIcon } from 'ui';
import NetworkInfo from './components/netWorkInfo';

const NetworkPage = () => {
  const [isLinked, setIsLinked] = useState('MultiwayRobot-4G');
  const signalIcon = (signal) => {
    if (signal <= 0) {
      return <WifiOffIcon />;
    }
    if (signal <= 30) {
      return <SignalCellularAlt1BarIcon />;
    }
    if (signal <= 60) {
      return <SignalCellularAlt2BarIcon />;
    }
    if (signal <= 100) {
      return <SignalCellularAltIcon />;
    }
    return <WifiOffIcon />;
  };

  const networkList = [
    {
      name: 'MultiwayRobot-4G',
      desc: 'WRA-PSK/WRAZ-PSK',
      signal: 40,
    },
    {
      name: 'MultiwayRobot-ZJ',
      desc: 'WRA-PSK/WRAZ-PSK',
      signal: 10,
    },
    {
      name: 'MultiwayRobot-Office',
      desc: 'WRA-PSK/WRAZ-PSK',
      signal: 90,
    },
  ];
  return (
    <div className='p-4 h-full flex gap-4'>
      <div className='w-1/4 p-4 bg-white/10 rounded-2xl flex flex-col'>
        <h3 className='text-lg font-bold mb-1 flex justify-between items-center'>
          网络设置 <Button type='text' icon={<RedoOutlined />}></Button>
        </h3>
        <motion.div
          className='!w-full h-px'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div
            className='w-full h-full'
            style={{
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)',
            }}
          />
        </motion.div>
        <div className='bg-white/5 flex flex-col items-center justify-center rounded-2xl p-4 mt-4 group hidden'>
          <SvgIcon name='noNetwork' size={200} className='mx-auto transition opacity-70 group-hover:scale-110' />
          <p>暂无信号</p>
        </div>
        <div className='flex-1 flex flex-col gap-4 mt-4 overflow-y-auto relative'>
          {networkList.map((network) => (
            <div
              key={network.name}
              className={`group w-full bg-white/10 rounded-md flex flex-row gap-2 justify-between items-center p-2 hover:bg-white/5 hover:shadow-lg  hover:font-bold  animation-all duration-300 cursor-pointer ${isLinked === network.name ? 'bg-teal-400/60 shadow-lg' : ''}`}
            >
              <div>
                <h4 className='text-lg font-bold'>{network.name}</h4>
                <p className='text-xs opacity-80'>{network.desc}</p>
              </div>
              <div>{signalIcon(network.signal ?? 0)}</div>
            </div>
          ))}

          {false ? <PanelLoading isDark={true} /> : null}
        </div>
      </div>
      <div
        className='relative h-full p-4 rounded-2xl bg-white/10  backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden flex flex-col flex-1 gap-4'
        style={{
          background: `
      radial-gradient(circle at 60% 90%, #3f6fa150, #0000 60%), 
      radial-gradient(circle at 20px 20px, #2e67a150, #0000 45%), 
      #182336
    `,
        }}
      >
        <NetworkInfo />
      </div>
    </div>
  );
};
export default NetworkPage;
