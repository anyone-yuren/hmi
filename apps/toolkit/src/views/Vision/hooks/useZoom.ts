/* eslint-disable no-param-reassign */
import Hammer from 'hammerjs';
import _ from 'lodash';
import { type ElementRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Stage } from 'react-konva';

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
}

export function useZoom(
  stageRef: React.RefObject<ElementRef<typeof Stage>>,
  options?: {
    scale?: number;
    min?: number;
    max?: number;
    handleMoveCallback?: () => void;
    handleMoveEndCallback?: () => void;
    onScale?: (scale: number) => void;
  },
) {
  const { min, max, scale = 1, onScale } = options || {};
  const [currentScale, setCurrentScale] = useState(scale);

  const { t, i18n } = useTranslation();

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
      onScale && onScale(newScale);
    },
    [stageRef, min, max, i18n.language, onScale],
  );
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: any) => {
      e.evt.preventDefault();
      const pointer = stage.getPointerPosition()!;
      let direction = e.evt.deltaY > 0 ? 1 : -1;
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
    const handleDragMove = (e: any) => {
      // 可以在这里添加逻辑，例如限制拖拽范围
    };
    stage.on('dragmove', handleDragMove);
    stage.on('wheel', handleWheel);
    return () => {
      stage.off('wheel', handleWheel);
      stage.off('dragmove', handleDragMove);
    };
  }, [stageRef, handleZoom, i18n.language]);

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
  }, [stageRef.current, min, max, i18n.language]);

  return {
    currentScale,
    zoom: handleZoom,
    setCurrentScale,
  };
}
