import { useRef } from 'react';
import Konva from 'konva';
const useStage = () => {
  const stageRef = useRef<Konva.Stage>(null);
  let newScale = 1;
  const onWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage()!;
    const oldScale = stage.scaleX()!;
    const pointer = stage.getPointerPosition()!;
    const mousePointTo = {
      x: (pointer.x - stage.x()!) / oldScale,
      y: (pointer.y - stage.y()!) / oldScale,
    };
    newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    stage?.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    stage?.position(newPos);
    stage?.batchDraw();
  };
  return { stageRef, onWheel, scale: newScale };
};
export default useStage;
