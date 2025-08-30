import { forwardRef, memo, useImperativeHandle } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSingleTaskStore } from '../../../../store/singleTask.store';
import NewAgv from './NewAgv';
import Vehicle from './Vehicle';
const translateAngel = (angel: number) => {
  return 180 - (angel || 0) * (180 / Math.PI);
};

const Vehicles = forwardRef((props: any, ref) => {
  const { agvPosition } = useSingleTaskStore(
    useShallow((state) => ({
      agvPosition: state.agvPosition,
    })),
  );
  useImperativeHandle(ref, () => ({
    getVehiclePosition: () => {
      return agvPosition;
    },
  }));

  return (
    <>
      <NewAgv
        rotation={-(agvPosition?.angel * 180) / Math.PI - 270}
        x={agvPosition.x * 20}
        y={-agvPosition.y * 20}
        offsetX={0}
        offsetY={0}
        stroke='white'
      ></NewAgv>
      {false && (
        <Vehicle
          key={'dream_car'}
          x={agvPosition.x * 20}
          y={-agvPosition.y * 20}
          angle={translateAngel(agvPosition.angel)}
        ></Vehicle>
      )}
    </>
  );
});

export default memo(Vehicles);
