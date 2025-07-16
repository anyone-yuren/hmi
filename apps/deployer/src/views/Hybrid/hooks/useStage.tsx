import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { useHybirdStore } from "../store/hybird.store";
import { useShallow } from "zustand/react/shallow";

export const useStageEvents = () => {
  const {
    setVehiclePosition,
    setStartTouch,
    setShowAgv,
    setStagePos,
    showAgv,
  } = useHybirdStore(
    useShallow((store) => {
      return {
        setVehiclePosition: store.setVehiclePosition,
        setStartTouch: store.setStartTouch,
        setBeginPose: store.setBeginPose,
        showAgv: store.showAgv,
        setShowAgv: store.setShowAgv,
        setStagePos: store.setStagePos,
      };
    })
  );

  const [imageObj, setImageObj] = useState<HTMLImageElement | undefined>(
    undefined
  );

  // 加载 AGV 图片
  useEffect(() => {
    const img = new Image();
    img.src = "./assets/agv.svg";
    img.onload = () => setImageObj(img);
  }, []);

  // 用于保存起始触摸点
  const startTouch = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  // 处理触摸开始事件
  const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => {
    setShowAgv(true);
    // const touch = e.evt.touches[0];
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    const coordName = stage?.findOne(".coordinateSystem");
    const { x, y } = coordName?.getClientRect()!;

    const scalex = stage?.scaleX();

    const pos = {
      x: (pointer!.x - x) / scalex!,
      // 因为指针的长设置的100
      y: (pointer!.y - y - 100) / scalex!,
    };

    startTouch.current = pos;

    setStartTouch(pos);
  };

  // 处理触摸移动事件
  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    const scalex = stage?.scaleX();
    const currentX = (pointer!.x - stage!.x()) / scalex!;
    const currentY = (pointer!.y - stage!.y()) / scalex!;

    // 计算旋转角度
    const dx = currentX - startTouch.current.x;
    const dy = currentY - startTouch.current.y;
    const angle = parseFloat(
      (Math.atan2(-dy, dx) * (180 / Math.PI)).toFixed(2)
    );
    const showAngle = parseFloat(
      (Math.atan2(dy, dx) * (180 / Math.PI)).toFixed(2)
    );

    // const angle = Math.round(Math.atan2(dy, dx) * (180 / Math.PI) * 100) / 100;

    // 更新车辆的位置和旋转角度
    showAgv &&
      setVehiclePosition({
        ...startTouch.current,
        rotation: showAngle - 90,
        angle: angle,
      });
  };
  const handleTouchEnd = (e: Konva.KonvaEventObject<TouchEvent>) => {
    // 隐藏AGV
    // setBeginPose(false);
    // setStartTouch(null);
    setShowAgv(false);
    setVehiclePosition({});
  };

  const handleDragMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
    const { x, y } = e.currentTarget.position();

    setStagePos({ x: Math.round(x), y: Math.round(y) });
  };
  return {
    imageObj,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDragMove,
  };
};
