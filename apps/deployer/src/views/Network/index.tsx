import PanelLoading from '@/components/PanelLoading';
import { RedoOutlined } from '@ant-design/icons';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularAlt1BarIcon from '@mui/icons-material/SignalCellularAlt1Bar';
import SignalCellularAlt2BarIcon from '@mui/icons-material/SignalCellularAlt2Bar';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useRequest } from 'ahooks';
import { Button, Skeleton } from 'antd';
import { motion } from 'framer-motion';
import VirtualList from 'rc-virtual-list';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from 'ui';
import NetworkInfo from './components/netWorkInfo';
import { getApInfo, getApList } from './services';

const CONTAINER_HEIGHT = 250; // 虚拟列表容器高度，可按需要调整

const NetworkPage = () => {
  const { t } = useTranslation();
  const [isLinked, setIsLinked] = useState('');
  const genKey = (ssid, channel, hwmode, address) => `${ssid}-${channel}-${hwmode}-${address}`;

  const [selectNetwork, setSelectNetwork] = useState(null);
  const {
    data,
    loading,
    run: reloadApList,
  } = useRequest(getApList, {
    onBefore: () => {
      setSelectNetwork(null);
      setIsLinked('');
    },
  });
  const { data: currentAp, loading: loadingAp, run: getCurrentAp } = useRequest(getApInfo);

  const networkList = useMemo(() => data?.data || {}, [data?.data]);

  const signalIcon = (signal: number) => {
    if (signal <= 0) return <WifiOffIcon />;
    if (signal <= 30) return <SignalCellularAlt1BarIcon />;
    if (signal <= 60) return <SignalCellularAlt2BarIcon />;
    if (signal <= 100) return <SignalCellularAltIcon />;
    return <WifiOffIcon />;
  };

  /** 渲染单个网络项 */
  const renderNetworkItem = (network: any, index) => {
    const { ssid, channel, encryption, quality, hwmode, address } = network;
    const puuid = genKey(ssid.trim(), channel, hwmode, address);
    return (
      <div
        // key={puuid}
        className={`group !mb-2 w-full bg-white/10 rounded-xl flex flex-row gap-2 justify-between items-center p-2 hover:bg-white/5 hover:shadow-lg hover:font-bold animation-all duration-300 cursor-pointer ${
          isLinked === puuid ? '!bg-teal-400/60 shadow-lg' : ''
        }`}
        onClick={() => {
          setSelectNetwork(network);
          setIsLinked(puuid);
        }}
      >
        <div>
          <h4 className='text-xs font-bold'>{ssid}</h4>
          <p className='text-xs opacity-80'>{encryption}</p>
        </div>
        <div>{signalIcon(quality ?? 0)}</div>
      </div>
    );
  };

  return (
    <div className='p-4 h-full flex gap-4'>
      <div className='w-1/4 p-4 bg-white/10 rounded-2xl flex flex-col gap-2'>
        <div>
          <h3 className='text-lg font-bold flex justify-between items-center'>
            {t('deployer.network.networkSetting')}{' '}
            <Button type='text' icon={<RedoOutlined />} disabled={loading} onClick={reloadApList} />
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
        </div>
        <div
          className='bg-teal-500/10 p-2 rounded-lg flex items-center justify-between shadow-sm shadow-teal-300 font-bold cursor-pointer'
          onClick={() => {
            const { ssid, channel, hwmode, address } = currentAp?.data || {};
            setSelectNetwork(currentAp?.data);
            setIsLinked(genKey(ssid, channel, hwmode, address));
          }}
        >
          <p>{t('deployer.network.currentConnected')}</p>
          <p>{loadingAp ? <Skeleton.Button size='small' active /> : (currentAp?.data?.ssid ?? '-')}</p>
        </div>

        {/* ✅ 5G 网络虚拟列表 */}
        <div className='relative flex-1'>
          <h3 className='mb-2 font-bold text-lg'>5G</h3>
          {networkList?.ap_list_5G?.length ? (
            <VirtualList
              data={networkList.ap_list_5G.filter((item, index) => item.ssid?.trim())}
              height={CONTAINER_HEIGHT}
              // itemHeight={60}
              itemKey={(item) => `${item.ssid}-${item.channel}-${item.hwmode}`}
            >
              {(item, index) => renderNetworkItem(item, index)}
            </VirtualList>
          ) : (
            <div className='bg-white/5 flex flex-col items-center justify-center rounded-2xl p-4 mt-4 group'>
              <SvgIcon name='noNetwork' size={140} className='mx-auto transition opacity-70 group-hover:scale-110' />
              <p>{t('deployer.network.noSignal')}</p>
            </div>
          )}
          {loading && <PanelLoading isDark={true} />}
        </div>

        {/* ✅ 2.4G 网络虚拟列表 */}
        <div className='relative flex-1'>
          <h3 className='mb-2 font-bold text-lg'>2.4G</h3>
          {networkList?.['ap_list_2.4G']?.length ? (
            <VirtualList
              data={networkList['ap_list_2.4G'].filter((item) => item.ssid?.trim())}
              height={CONTAINER_HEIGHT}
              // itemHeight={60}
              itemKey={(item) => `${item.ssid}-${item.channel}-${item.hwmode}`}
            >
              {(item, index) => renderNetworkItem(item, index)}
            </VirtualList>
          ) : (
            <div className='bg-white/5 flex flex-col items-center justify-center rounded-2xl p-4 mt-4 group'>
              <SvgIcon name='noNetwork' size={140} className='mx-auto transition opacity-70 group-hover:scale-110' />
              <p>{t('deployer.network.noSignal')}</p>
            </div>
          )}
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
        <NetworkInfo currentAp={currentAp?.data} selectNetwork={selectNetwork} />
      </div>
    </div>
  );
};

export default NetworkPage;
