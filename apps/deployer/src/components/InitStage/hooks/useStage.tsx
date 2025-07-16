import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import Konva from 'konva';
import { useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
interface Props {
  onWheelCallback?: (e: Konva.KonvaEventObject<WheelEvent>) => void;
  minScale?: number;
}
const useStage = (props: Props) => {
  const { setStageScale, setStagePos } = useHybirdStore(
    useShallow((store) => {
      return {
        setStageScale: store.setStageScale,
        setStagePos: store.setStagePos,
      };
    }),
  );
  const stageRef = useRef<Konva.Stage | null>(null);
  const [scale, setScale] = useState(1);
  const { onWheelCallback, minScale = 0.4 } = props;

  // 设置最大和最小缩放比例
  const MAX_SCALE = 5; // 最大缩放比例
  // const MIN_SCALE = minScale; // 最小缩放比例
  const MIN_SCALE = 0.5; // 最小缩放比例

  const onWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage()!;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition()!;

    // 计算缩放的目标比例
    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    // 限制 newScale 在 [MIN_SCALE, MAX_SCALE] 范围内
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    // 根据新的缩放比例调整画布的位置
    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // 这里改变的是 Stage 的内容缩放，而不是 Stage 的实际大小
    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    // 更新位置
    stage.position(newPos);

    setStagePos(newPos);
    setScale(newScale);

    // 通知外部 store 更新缩放比例
    setStageScale(newScale);

    // 调用回调函数（如果存在）
    onWheelCallback && onWheelCallback(e);

    // 更新渲染
    stage.batchDraw();
  };

  return { stageRef, onWheel, scale };
};

export default useStage;
