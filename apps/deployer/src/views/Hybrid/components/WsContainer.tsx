import { memo } from 'react';
import { useHybrid } from '../hooks/useHybrid';
const WsContainer = ({ children }: { children: any }) => {
  const {} = useHybrid();
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
