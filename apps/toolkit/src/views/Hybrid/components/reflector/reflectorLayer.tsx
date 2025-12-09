import { memo, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Circle, Group } from 'react-konva';
import { useHybirdStore } from '../../store/hybird.store';

export type IMapStatus = 'add' | 'update' | null;

const dis = 1000 / 50;

export const formatPosition = (list: any[]) => {
  return (
    list?.map((item: any) => {
      const { pose_x: x, pose_y: y, id } = item;
      return { x: x * dis, y: (0 - y) * dis, id };
    }) ?? []
  );
};

const Reflector = ({ onReflectorClick }: { onReflectorClick: (id: number) => void }) => {
  const {
    reflectorMap,
    systemStatus,
    currentReflectors,
    matchedReflectors,
    mismatchedReflectors,
    setStagePos,
    hybirdStage,
    setStageScale,
  } = useHybirdStore(
    useShallow((state) => ({
      reflectorMap: state.floorData?.reflector_map,
      systemStatus: state.robot_current_status?.system_status ?? 0,
      // 当前反光板地图
      currentReflectors: state.currentReflectors,
      // 当前匹配成功的反光板
      matchedReflectors: state.matchedReflectors,
      // 当前未匹配成功的反光板
      mismatchedReflectors: state.mismatchedReflectors,
      hybirdStage: state.hybirdStage,
      setStageScale: state.setStageScale,
    })),
  );

  useEffect(() => {
    if (!hybirdStage || !hybirdStage?.attrs) return;
    setTimeout(() => {
      const { width, height } = hybirdStage?.attrs;
      hybirdStage && hybirdStage.to && hybirdStage.to({ x: width / 2, y: height / 2 });
    }, 1000);
    setTimeout(() => {
      setStageScale(0.9); // 设置网格显示
    }, 2000);
  }, [hybirdStage?.attrs, setStageScale]);

  const isViewOnly = useMemo(() => [0].includes(systemStatus), [systemStatus]);

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
  }, [mismatchedReflectors]);

  return (
    <Group>
      <Group name='reflector'>
        {currentList.map((item: any) => (
          <Circle
            key={item.id}
            {...item}
            radius={6}
            fill='#000'
            onClick={() => isViewOnly && onReflectorClick(item.id)}
            onTap={() => isViewOnly && onReflectorClick(item.id)}
          />
        ))}
        {matchedList.map((item: any) => (
          <Circle key={item.id} {...item} radius={4} fill='#50fc2e' listening={false} />
        ))}
        {misMatchedList.map((item: any) => (
          <Circle key={item.id} {...item} radius={4} fill='#d9363e' listening={false} />
        ))}
      </Group>
    </Group>
  );
};

export default memo(Reflector);
