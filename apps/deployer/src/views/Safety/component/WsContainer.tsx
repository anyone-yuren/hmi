import { memo } from 'react';
import { useSafety } from '../hooks/useSafety';
const WsContainer = ({ children }: { children: any }) => {
  const {} = useSafety();
  // useEffect(() => {
  //   if (readyState === 1) {
  //     sendMessage({
  //       type: 'subscribe',
  //       data: {
  //         topic: 'topic',
  //       },
  //     });
  //   }
  // }, [readyState, sendMessage]);
  return children;
};
export default memo(WsContainer);
