import { useHybrid } from '@/hooks/useHybrid';
import { memo } from 'react';
const WsContainer = () => {
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
  return null;
};
export default memo(WsContainer);
