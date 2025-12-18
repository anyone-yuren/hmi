import { memo, useEffect } from 'react';
import { useHome } from '../hooks/useHome';
const WsContainer = (props) => {
  const { readyState } = useHome();
  useEffect(() => {
    if (readyState === 1) {
      props.setRenderView && props.setRenderView(true);
    }
  }, [readyState]);
  return null;
};
export default memo(WsContainer);
