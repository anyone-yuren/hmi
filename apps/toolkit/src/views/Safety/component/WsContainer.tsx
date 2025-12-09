import { memo } from 'react';
import { useSafety } from '../hooks/useSafety';
const WsContainer = ({ children }: { children: any }) => {
  const {} = useSafety();
  return children;
};
export default memo(WsContainer);
