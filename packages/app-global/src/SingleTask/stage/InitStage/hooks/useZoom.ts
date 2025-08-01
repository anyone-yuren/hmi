/* eslint-disable no-param-reassign */
import { type ElementRef, useCallback, useEffect, useState } from 'react';
import Hammer from 'hammerjs';
import type { Stage } from 'react-konva';
import { message } from 'antd';
import _ from 'lodash';

const scaleBy = 1.7;
let lastCenter: any = null;
let lastDist = 0;
export function getCenter(p1: any, p2: any) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}
export function getDistance(p1: any, p2: any) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function useZoom(
  stageRef: React.RefObject<ElementRef<typeof Stage>>,
  options?: {
    scale?: number;
    min?: number;
    max?: number;
    handleMoveCallback?: () => void;
    handleMoveEndCallback?: () => void;
  },
) {
  const { min, max, scale = 1 } = options || {};
  const [currentScale, setCurrentScale] = useState(scale);

  const minTips = _.throttle(() => {
    // message.error('不能再缩小了');
  }, 500);
  /**
   * @description: 根据target的位置进行缩放
   * @param {*} useCallback
   * @return {*}
   */
  const handleZoom = useCallback(
    (
      newScale: number,
      // eslint-disable-next-line @typescript-eslint/no-shadow
      options?: {
        targetPosition?: { x: number; y: number };
        center?: boolean;
      },
    ) => {
      if (min && newScale < min) {
        newScale = min;
        minTips();
      }
      if (max && newScale > max) newScale = max;

      const stage = stageRef.current;
      if (!stage) return;
      const { targetPosition, center = true } = options || {};
      const oldScale = stage.scaleX();
      let position = { x: 0, y: 0 };
      if (targetPosition) {
        position = targetPosition;
      } else if (center) {
        position.x = stage.width() / 2;
        position.y = stage.height() / 2;
      }

      const mousePointTo = {
        x: (position.x - stage.x()) / oldScale,
        y: (position.y - stage.y()) / oldScale,
      };
      stage.scale({ x: newScale, y: newScale });

      const newPos = {
        x: position.x - mousePointTo.x * newScale,
        y: position.y - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      setCurrentScale(newScale);
    },
    [stageRef, min, max],
  );
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: any) => {
      // stop default scrolling
      e.evt.preventDefault();

      const pointer = stage.getPointerPosition()!;
      // how to scale? Zoom in? Or zoom out?
      let direction = e.evt.deltaY > 0 ? 1 : -1;

      // when we zoom on trackpad, e.evt.ctrlKey is true
      // in that case lets revert direction
      direction = -direction;
      if (e.evt.ctrlKey) {
        direction = -direction;
      }
      const oldScale = stage.scaleX();

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      handleZoom(newScale, {
        targetPosition: pointer,
      });
    };

    stage.on('wheel', handleWheel);
    return () => {
      stage.off('wheel', handleWheel);
    };
  }, [stageRef, handleZoom]);

  // 祖传代码 想要与zoom兼容，要改后面定义重定位中心点的位置
  const handleTouchMove = (e: any) => {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];

    if (touch1 && touch2) {
      if (stageRef.current.isDragging()) {
        stageRef.current.stopDrag();
      }

      const p1 = {
        x: touch1.clientX,
        y: touch1.clientY,
      };
      const p2 = {
        x: touch2.clientX,
        y: touch2.clientY,
      };

      if (!lastCenter) {
        lastCenter = getCenter(p1, p2);
        return;
      }
      const newCenter = getCenter(p1, p2);

      const dist = getDistance(p1, p2);

      if (!lastDist) {
        lastDist = dist;
      }

      const pointTo = {
        x: (newCenter.x - stageRef.current.x()) / stageRef.current.scaleX(),
        y: (newCenter.y - stageRef.current.y()) / stageRef.current.scaleX(),
      };

      let scale = stageRef.current.scaleX() * (dist / lastDist);

      stageRef.current.scale({ x: scale, y: scale });
      setCurrentScale(scale);

      const dx = newCenter.x - lastCenter.x;
      const dy = newCenter.y - lastCenter.y;

      const newPos = {
        x: newCenter.x - pointTo.x * scale + dx,
        y: newCenter.y - pointTo.y * scale + dy,
      };
      stageRef.current.position(newPos);

      lastDist = dist;
      lastCenter = newCenter;
    }
  };

  const handleTouchend = () => {
    lastDist = 0;
    lastCenter = null;
  };

  useEffect(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current!;
    const hammer = new Hammer(stage.container());

    hammer.get('pinch').set({ enable: true });

    let oldScale = stage.scaleX();
    let oldPos = { x: 0, y: 0 };

    hammer.on('pinchstart', () => {
      oldScale = stage.scaleX();
      oldPos = stage.position();
    });

    hammer.on('pinchmove', (e: any) => {
      let newScale = oldScale * e.scale;
      if (min && newScale < min) {
        newScale = min;
        minTips();
      }
      if (max && newScale > max) newScale = max;
      // 捏合 1 点位
      const pointer1 = {
        x: e.pointers[0].clientX,
        y: e.pointers[0].clientY,
      };
      // 捏合 2 点位
      const pointer2 = {
        x: e.pointers[1].clientX,
        y: e.pointers[1].clientY,
      };
      // 计算捏合中心点
      const newCenter = {
        x: (pointer1.x + pointer2.x) / 2,
        y: (pointer1.y + pointer2.y) / 2,
      };

      // 计算新的位置
      const newPosX = oldPos.x - (newCenter.x - oldPos.x) * (newScale / oldScale - 1);
      const newPosY = oldPos.y - (newCenter.y - oldPos.y) * (newScale / oldScale - 1);

      stage.stopDrag();
      stage.draggable(false);
      stage.scale({ x: newScale, y: newScale });
      setCurrentScale(newScale);
      stage.position({ x: newPosX, y: newPosY });
      stage.draggable(true);
      stage.batchDraw();
      options?.handleMoveCallback && options?.handleMoveCallback();
    });

    hammer.on('pinchend', () => {
      oldScale = stage.scaleX();
      oldPos = stage.position();
      options?.handleMoveEndCallback && options?.handleMoveEndCallback();
    });

    return () => {
      hammer.off('pinch');
      hammer.destroy();
    };
  }, [stageRef.current, min, max]);

  return {
    currentScale,
    zoom: handleZoom,
    setCurrentScale,
    // handleTouchMove,
    // handleTouchend,
  };
}
