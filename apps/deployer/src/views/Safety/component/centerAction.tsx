import { MyLocationOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Konva from 'konva';
import { memo, useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useHybirdStore } from '../../Hybrid/store/hybird.store';

const CenterActions = () => {
  const { hybirdStage, setStagePos } = useHybirdStore(
    useShallow((state) => ({
      hybirdStage: state.hybirdStage,
      setStagePos: state.setStagePos,
    })),
  );

  const handleClick = useCallback(() => {
    // console.log("CenterActions handleClick = ", reflectorMap, currentReflectors)

    hybirdStage.to({
      x: 0,
      y: 0,
      duration: 0.5,
      onFinish: () => {
        // 使用Konva.Tween进行动画
        const tween = new Konva.Tween({
          node: hybirdStage,
          duration: 0.3, // 缓慢缩放的持续时间
          scaleX: 1 * 1, // 新的横向缩放比例
          scaleY: 1 * 1, // 新的纵向缩放比例
          easing: Konva.Easings.EaseInOut, // 缓动效果
          onFinish: () => {
            // console.log('缩放动画完成');
            tween.destroy();
            // 处理画线不完整问题
            setStagePos({ x: 0, y: 0 });
          },
        });

        tween.play();
      },
    });
  }, [hybirdStage]);

  return (
    <IconButton className='!mr-2 flex items-center' onClick={handleClick}>
      <MyLocationOutlined fontSize='large' style={{ color: '#000' }} />
    </IconButton>
  );
};

export default memo(CenterActions);
