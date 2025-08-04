import { memo, useEffect } from 'react';
import { useIo } from '../hooks/useIo';

const WsContainer = ({ ioWssChange }) => {
  const { ioWssResponse, disconnect } = useIo();
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
