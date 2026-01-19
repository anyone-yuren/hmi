import { useRef } from 'react';
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

  // 使用 useRef 确保函数引用在整个生命周期内保持一致
  // 只在第一次渲染时创建对象，之后始终返回相同的引用
  const stableActions = useRef({
    setTaskInfo,
    setControlStatus,
    setRobotCurrentStatus,
    setRobotIsensorStatus,
    setRobotGoodsStatus,
    setRobotForkarmStatus,
    setSegmentsInfo,
    setIsContentWss,
  }).current;

  return stableActions;
};

export default useDebouncedHomeStore;
