import { useVehicleStore } from '@gbeata/store';
import WifiIcon from '@mui/icons-material/Wifi';
import Wifi1BarIcon from '@mui/icons-material/Wifi1Bar';
import Wifi2BarIcon from '@mui/icons-material/Wifi2Bar';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { useShallow } from 'zustand/react/shallow';
const Signal = () => {
  const { signal, setSignal } = useVehicleStore(
    useShallow((state) => {
      return {
        signal: state.signal,
        setSignal: state.setSignal,
      };
    }),
  );
  const signalIcon = () => {
    if (signal <= 0) {
      return <WifiOffIcon />;
    }
    if (signal <= 30) {
      return <Wifi1BarIcon />;
    }
    if (signal <= 60) {
      return <Wifi2BarIcon />;
    }
    if (signal <= 100) {
      return <WifiIcon />;
    }
    return <WifiOffIcon />;
  };
  return (
    <div
      onClick={() => {
        if (signal >= 100) {
          setSignal(0);
        } else {
          setSignal(signal + 10);
        }
      }}
    >
      {signalIcon()}
    </div>
  );
};

export default Signal;
