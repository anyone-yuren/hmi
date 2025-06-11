import { useRequest } from 'ahooks';
import { editor, wms } from 'apis';
import { useState } from 'react';
import pointsData from '../../data/points.json';
export const useWmsPoints = () => {
  const [points, setPoints] = useState([] ?? pointsData);
  const { runAsync: getWmsPoints } = useRequest(editor.getStoragePointList, {
    manual: true,
  });
  const { runAsync: getEditorPoints } = useRequest(wms.getSlotStatusOptions, {
    manual: true,
  });
  // 刷新方法获取数据并合并
  const refreshPoints = async () => {
    try {
      const [pointList, statusList] = await Promise.all([getWmsPoints(), getEditorPoints()]);
      // 把statusList转成Map 提高查询效率
      const statusMap = new Map(statusList.map((item) => [item.slotNo, item]));
      // 合并数据
      const mergedPoints = pointList.map((point) => {
        const status = statusMap.get(point.locationCode) || {};
        return {
          ...point,
          ...status,
        };
      });
      setPoints(mergedPoints);
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  // 根据 ws 推送的 slotStateMap，更新已有 points 的 state
  const updatePointStates = (slotStateMap: Record<string, any>) => {
    const newPoints = points.map((point) => {
      const slotState = slotStateMap[point?.locationCode];
      if (slotState) {
        return {
          ...point,
          state: slotState.state,
        };
      }
      return point;
    });
    setPoints(newPoints);

    // setPoints((prevPoints) =>
    //   prevPoints.map((point) => {
    //     const slotState = slotStateMap[point.locationCode];
    //     if (slotState) {
    //       return {
    //         ...point,
    //         state: slotState.state,
    //       };
    //     }
    //     return point;
    //   }),
    // );
  };
  return {
    points,
    refreshPoints,
    updatePointStates,
  };
};
