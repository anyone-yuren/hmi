import { memo } from 'react';
import { useSafety } from '../hooks/useSafety';
const WsContainer = ({ children, extraTopic }: { children: any; extraTopic: any[] }) => {
  const {} = useSafety({
    extraTopic,
  });
  return children;
};
export default memo(WsContainer);
