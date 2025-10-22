import PanelLoading from '@/components/PanelLoading';
import { RedoOutlined } from '@ant-design/icons';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularAlt1BarIcon from '@mui/icons-material/SignalCellularAlt1Bar';
import SignalCellularAlt2BarIcon from '@mui/icons-material/SignalCellularAlt2Bar';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useRequest } from 'ahooks';
import { Button } from 'antd';
import { motion } from 'framer-motion';
import VirtualList from 'rc-virtual-list';
import { useMemo, useState } from 'react';
import { SvgIcon } from 'ui';
import NetworkInfo from './components/netWorkInfo';
import { getApList } from './services';

const CONTAINER_HEIGHT = 300; // 虚拟列表容器高度，可按需要调整

const NetworkPage = () => {
  const [isLinked, setIsLinked] = useState('MultiwayRobot-4G');
  const { data, loading } = useRequest(getApList);

  const networkList = useMemo(() => data?.data || {}, [data?.data]);

  const signalIcon = (signal: number) => {
    if (signal <= 0) return <WifiOffIcon />;
    if (signal <= 30) return <SignalCellularAlt1BarIcon />;
    if (signal <= 60) return <SignalCellularAlt2BarIcon />;
    if (signal <= 100) return <SignalCellularAltIcon />;
    return <WifiOffIcon />;
  };

  /** 渲染单个网络项 */
  const renderNetworkItem = (network: any) => (
    <div
      key={network.ssid + network.channel}
      className={`group !mb-2 w-full bg-white/10 rounded-xl flex flex-row gap-2 justify-between items-center p-2 hover:bg-white/5 hover:shadow-lg hover:font-bold animation-all duration-300 cursor-pointer ${
        isLinked === network.name ? 'bg-teal-400/60 shadow-lg' : ''
      }`}
    >
      <div>
        <h4 className='text-lg font-bold'>{network.ssid}</h4>
        <p className='text-xs opacity-80'>{network.encryption}</p>
      </div>
      <div>{signalIcon(network.quality ?? 0)}</div>
    </div>
  );

  return (
    <div className='p-4 h-full flex gap-4'>
      <div className='w-1/4 p-4 bg-white/10 rounded-2xl flex flex-col'>
        <h3 className='text-lg font-bold mb-1 flex justify-between items-center'>
          网络设置 <Button type='text' icon={<RedoOutlined />} />
        </h3>

        {/* 渐变分隔线 */}
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

        {/* 无信号提示 */}
        <div className='bg-white/5 flex flex-col items-center justify-center rounded-2xl p-4 mt-4 group hidden'>
          <SvgIcon name='noNetwork' size={200} className='mx-auto transition opacity-70 group-hover:scale-110' />
          <p>暂无信号</p>
        </div>

        {/* ✅ 5G 网络虚拟列表 */}
        <div className='mt-4 relative flex-1'>
          {networkList?.ap_list_5G?.length ? (
            <VirtualList
              data={networkList.ap_list_5G.filter((item) => item.ssid?.trim())}
              height={CONTAINER_HEIGHT}
              itemHeight={60}
              itemKey={(item) => item.ssid + item.channel}
            >
              {(item) => renderNetworkItem(item)}
            </VirtualList>
          ) : null}
          {loading && <PanelLoading isDark={true} />}
        </div>

        {/* ✅ 2.4G 网络虚拟列表 */}
        <div className='mt-4 relative flex-1'>
          {networkList?.['ap_list_2.4G']?.length ? (
            <VirtualList
              data={networkList['ap_list_2.4G'].filter((item) => item.ssid?.trim())}
              height={CONTAINER_HEIGHT}
              itemHeight={60}
              itemKey={(item) => item.ssid + item.channel}
            >
              {(item) => renderNetworkItem(item)}
            </VirtualList>
          ) : null}
          {loading && <PanelLoading isDark={true} />}
        </div>
      </div>

      {/* 右侧信息面板 */}
      <div
        className='relative h-full p-4 rounded-2xl bg-white/10 backdrop-blur-3xl shadow-sm shadow-teal-500/40 overflow-hidden flex flex-col flex-1 gap-4'
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
