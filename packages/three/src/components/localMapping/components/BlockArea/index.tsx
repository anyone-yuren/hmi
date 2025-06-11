import { useMemo } from 'react';

import Area from './components/area';
import DrawPillars from './components/pillars';
import DrawRoadWay from './components/roadway';
import DrawWall from './components/wall';
// 绘制区域
const BlockArea = ({ mapDrawBlocks }) => {
  // 绘制区域
  const drawWallData = useMemo(() => {
    if (!mapDrawBlocks?.length) {
      return [];
    }
    return mapDrawBlocks.filter((item, index) => item.type === 4);
  }, [mapDrawBlocks]);
  // 绘制暂存区
  const drawStoreData = useMemo(() => {
    if (!mapDrawBlocks?.length) {
      return [];
    }
    return mapDrawBlocks.filter((item, index) => item.type === 5);
  }, [mapDrawBlocks]);

  // 绘制柱子
  const drawPillarsData = useMemo(() => {
    if (!mapDrawBlocks?.length) {
      return [];
    }
    return mapDrawBlocks.filter((item, index) => item.type === 3);
  }, [mapDrawBlocks]);

  // 绘制巷道
  const drawRoadWayData = useMemo(() => {
    if (!mapDrawBlocks?.length) {
      return [];
    }
    return mapDrawBlocks.filter((item, index) => item.type === 1);
  }, [mapDrawBlocks]);

  // 绘制暂存区
  const drawTemporaryData = useMemo(() => {
    if (!mapDrawBlocks?.length) {
      return [];
    }
    return mapDrawBlocks.filter((item, index) => item.type === 6);
  }, [mapDrawBlocks]);

  return (
    <>
      {drawWallData.length ? <DrawWall mapDrawBlocks={drawWallData} /> : null}
      {drawStoreData.length ? <Area mapDrawBlocks={drawStoreData} /> : null}
      {drawTemporaryData.length ? <Area mapDrawBlocks={drawTemporaryData} /> : null}
      {drawPillarsData.length ? <DrawPillars mapDrawBlocks={drawPillarsData} /> : null}
      {drawRoadWayData.length ? <DrawRoadWay mapDrawBlocks={drawRoadWayData} /> : null}
    </>
  );
};

export default BlockArea;
