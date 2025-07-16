import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import { MyLocationOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Konva from 'konva';
import { round } from 'lodash';
import { memo, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { formatPosition } from '../../reflectorLayer';

import { useTranslation } from 'react-i18next';

const CenterActions = () => {
  const { t } = useTranslation();
  const {
    reflectorMap,
    systemStatus,
    hybirdStage,

    currentReflectors,
    matchedReflectors,
    mismatchedReflectors,
    setStagePos,
  } = useHybirdStore(
    useShallow((state) => ({
      reflectorMap: state.floorData?.reflector_map,
      hybirdStage: state.hybirdStage,
      systemStatus: state.robot_current_status?.system_status ?? 0,

      // 当前反光板地图
      currentReflectors: state.currentReflectors,
      setCurrentReflectors: state.setCurrentReflectors,

      // 当前匹配成功的反光板
      matchedReflectors: state.matchedReflectors,

      // 当前未匹配成功的反光板
      mismatchedReflectors: state.mismatchedReflectors,
      setStagePos: state.setStagePos,
    })),
  );

  const [location, setLocation] = useState(false);

  const isViewOnly = useMemo(() => systemStatus === 0, [systemStatus]);

  const currentList = useMemo(() => {
    if (isViewOnly) {
      return formatPosition(reflectorMap);
    }
    return formatPosition(currentReflectors);
  }, [reflectorMap, currentReflectors, isViewOnly]);

  const matchedList = useMemo(() => {
    return formatPosition(matchedReflectors);
  }, [matchedReflectors]);

  const misMatchedList = useMemo(() => {
    return formatPosition(mismatchedReflectors);
  }, [mismatchedReflectors, isViewOnly]);

  const handleClick = useCallback(() => {
    // console.log("CenterActions handleClick = ", reflectorMap, currentReflectors)
    if (hybirdStage?.attrs && (currentList?.length || matchedList?.length || misMatchedList?.length)) {
      // console.log("Reflector currentList = ", currentList)
      setLocation(true);
      const list = [...currentList, ...matchedList, ...misMatchedList];

      const xArr = list.map((item: any) => item.x);
      const yArr = list.map((item: any) => item.y);
      const x = Math.min(...xArr);
      const y = Math.min(...yArr);
      const width = Math.max(...xArr) - Math.min(...xArr);
      const height = Math.max(...yArr) - Math.min(...yArr);

      const scale = Math.min(hybirdStage.width()! / (width * 1), (hybirdStage.height()! - 100) / (height * 1));
      const x1 = round(x * scale + (width * scale - hybirdStage.width()!) / 2, 4);
      const y1 = round(y * scale + (height * scale - hybirdStage.height()!) / 2, 4);
      console.log(-x1, -y1 - 50);
      hybirdStage.to({
        x: -x1,
        y: -y1 - 50,
        duration: 0.5,
        onFinish: () => {
          // 使用Konva.Tween进行动画
          const tween = new Konva.Tween({
            node: hybirdStage,
            duration: 0.3, // 缓慢缩放的持续时间
            scaleX: scale * 0.8, // 新的横向缩放比例
            scaleY: scale * 0.8, // 新的纵向缩放比例
            easing: Konva.Easings.EaseInOut, // 缓动效果
            onFinish: () => {
              // console.log('缩放动画完成');
              setLocation(false);

              tween.destroy();
              setStagePos({ x: 0, y: 0 });
            },
          });

          tween.play();
        },
      });
      return;
    }

    toast.warning(t('暂无反光板数据，无法定位'));
  }, [currentList, misMatchedList, hybirdStage]);

  return (
    <IconButton className='!mr-2 flex items-center' disabled={location} onClick={handleClick}>
      <MyLocationOutlined fontSize='medium' style={{ color: '#000' }} />
    </IconButton>
  );
};

export default memo(CenterActions);
