import { getApInfo } from '@/views/Network/services';

import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularAlt1BarIcon from '@mui/icons-material/SignalCellularAlt1Bar';
import SignalCellularAlt2BarIcon from '@mui/icons-material/SignalCellularAlt2Bar';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useRequest } from 'ahooks';
import { Skeleton } from 'antd';
import { useEffect, useMemo } from 'react';
const Signal = (props) => {
  const { canLinkWifi } = props;
  const {
    data: currentAp,
    loading: loadingAp,
    run: getCurrentAp,
  } = useRequest(getApInfo, {
    manual: true,
  });
  console.log(currentAp);
  useEffect(() => {
    if (canLinkWifi) {
      getCurrentAp();
    }
  }, [canLinkWifi]);
  // const { signal, setSignal } = useVehicleStore(
  //   useShallow((state) => {
  //     return {
  //       signal: state.signal,
  //       setSignal: state.setSignal,
  //     };
  //   }),
  // );

  const signalIcon = useMemo(() => {
    const signal = currentAp?.data?.quality || 0;
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
  }, [currentAp?.data]);
  return (
    <div
      className='flex items-center  text-lg'
      onClick={() => {
        // if (signal >= 100) {
        //   setSignal(0);
        // } else {
        //   setSignal(signal + 10);
        // }
      }}
    >
      {/* <FiveGIcon fontSize='large' /> */}
      {loadingAp ? <Skeleton.Button active size='small' /> : signalIcon}
    </div>
  );
};

export default Signal;
