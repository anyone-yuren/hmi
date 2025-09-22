import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { useSingleTaskStore } from '../../../../store/singleTask.store';

import { Circle } from 'react-konva';

const RealTimePoints = (props: any) => {
  const { t } = useTranslation();

  const { realTimePoints } = useSingleTaskStore(
    useShallow((state) => ({
      realTimePoints: state.realTimePoints,
    })),
  );

  return (
    <>
      {/* <FastLayer gpuAcceleration hitGraphEnabled={false} draggable={false}> */}
      {realTimePoints?.map((point, index) => {
        return <Circle key={index} x={point.x / 50} y={0 - point.y / 50} radius={1.8} fill={'red'}></Circle>;
      })}
      {/* </FastLayer> */}
    </>
  );
};

export default memo(RealTimePoints);
