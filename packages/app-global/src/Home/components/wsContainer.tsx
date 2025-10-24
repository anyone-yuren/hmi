import { memo } from 'react';
import { useHome } from '../hooks/useHome';
const WsContainer = () => {
  const {} = useHome();
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
