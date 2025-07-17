import { memo, useEffect } from 'react';
import { useIo } from '../hooks/useIo';

const keys = ['/sirius/topics/robot_status_isensor', '/sirius/topics/robot_status_osensor'];
const WsContainer = ({ ioWssChange }) => {
  const { ioWssResponse, disconnect } = useIo({ keys });
  useEffect(() => {
    ioWssChange && ioWssChange(ioWssResponse);
  }, [ioWssResponse]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);
  return null;
};
export default memo(WsContainer);
