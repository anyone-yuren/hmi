import { memo } from 'react';
import { useHybrid } from '../hooks/useHybrid';
const WsContainer = ({ children }: { children: any }) => {
  const {} = useHybrid();
  return children;
};
export default memo(WsContainer);
