import { debounce } from 'lodash';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useHomeStore } from '../store';

const useDebouncedHomeStore = () => {
  const {
    setTaskInfo,
    setControlStatus,
    setRobotCurrentStatus,
    setRobotIsensorStatus,
    setRobotGoodsStatus,
    setRobotForkarmStatus,
    setSegmentsInfo,
    setIsContentWss,
  } = useHomeStore(
    useShallow((state) => ({
      setTaskInfo: state.setTaskInfo,
      setControlStatus: state.setControlStatus,
      setRobotCurrentStatus: state.setRobotCurrentStatus,
      setRobotIsensorStatus: state.setRobotIsensorStatus,
      setRobotGoodsStatus: state.setRobotGoodsStatus,
      setRobotForkarmStatus: state.setRobotForkarmStatus,
      setSegmentsInfo: state.setSegmentsInfo,
      setIsContentWss: state.setIsContentWss,
    })),
  );

  // 用 useRef 保证函数在整个生命周期保持一致
  const debouncedRefs = useRef({
    setTaskInfo: debounce(setTaskInfo, 1000),
    setControlStatus: debounce(setControlStatus, 1000),
    setRobotCurrentStatus: debounce(setRobotCurrentStatus, 1000),
    setRobotIsensorStatus: debounce(setRobotIsensorStatus, 1000),
    setRobotGoodsStatus: debounce(setRobotGoodsStatus, 1000),
    setRobotForkarmStatus: debounce(setRobotForkarmStatus, 1000),
    setSegmentsInfo: debounce(setSegmentsInfo, 1000),
    setIsContentWss: debounce(setIsContentWss, 1000),
  });

  // 清理防抖函数
  useEffect(() => {
    return () => {
      Object.values(debouncedRefs.current).forEach((fn) => fn.cancel && fn.cancel());
    };
  }, []);

  return debouncedRefs.current;
};

export default useDebouncedHomeStore;
