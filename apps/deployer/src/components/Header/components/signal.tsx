import { getApInfo } from '@/views/Network/services';

import FiveGIcon from '@mui/icons-material/FiveG';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularAlt1BarIcon from '@mui/icons-material/SignalCellularAlt1Bar';
import SignalCellularAlt2BarIcon from '@mui/icons-material/SignalCellularAlt2Bar';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useRequest } from 'ahooks';
import { useMemo } from 'react';
const Signal = () => {
  const { data: currentAp, loading: loadingAp, run: getCurrentAp } = useRequest(getApInfo);
  // const { signal, setSignal } = useVehicleStore(
  //   useShallow((state) => {
  //     return {
  //       signal: state.signal,
  //       setSignal: state.setSignal,
  //     };
  //   }),
  // );
  console.log(currentAp);

  const signalIcon = useMemo(() => {
    const signal = currentAp?.data?.signal || 0;
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
      <FiveGIcon fontSize='large' />
      {signalIcon}
    </div>
  );
};

export default Signal;
