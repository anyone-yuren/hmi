import { forwardRef, memo, useImperativeHandle } from 'react';
import { useHybrid } from '../hooks/useHybrid';

const WsContainer = forwardRef(({ children }: { children: any }, ref) => {
  const { connect } = useHybrid();

  // 暴露 connect 方法给父组件
  useImperativeHandle(ref, () => ({
    connect,
  }));

  return children;
});

export default memo(WsContainer);
