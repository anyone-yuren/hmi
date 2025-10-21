import { memo } from 'react';
import { useAbout } from '../hooks/useAbout';
const WsContainer = () => {
  const {} = useAbout();
  return null;
};
export default memo(WsContainer);
