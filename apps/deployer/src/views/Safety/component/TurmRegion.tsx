import { useEffect, useMemo } from 'react';
import { Line } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import { useSafetyStore } from '../store/safety.store';
import { meterToPixel } from '../utils';

const TurmRegion = () => {
  const { turnRegionData, setTurnRegionData } = useSafetyStore(
    useShallow((store) => ({
      turnRegionData: store.turnRegionData,
      setTurnRegionData: store.setTurnRegionData,
    })),
  );
  useEffect(() => {
    setTurnRegionData([]);
  }, []);
  const RenderTurnRegionLine = useMemo(() => {
    if (!turnRegionData || !turnRegionData.length) return null;

    // 使用meterToPixel将turnRegionData转换成一维数组转换米为像素
    const points = turnRegionData
      .map(({ x, y }) => {
        return [meterToPixel(0 - y), meterToPixel(0 - x)];
      })
      .flat();

    return (
      <>
        <Line
          name='turn-region-line'
          points={points}
          closed={true}
          stroke='green'
          fill='green'
          opacity={0.2}
          strokeWidth={1}
        ></Line>
      </>
    );
  }, [turnRegionData]);
  return <>{RenderTurnRegionLine}</>;
};

export default TurmRegion;
