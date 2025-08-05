import { forwardRef, memo, useImperativeHandle } from 'react';
// import vehicleImages from '../../../assets/vehicle/vector.svg';
import { useShallow } from 'zustand/react/shallow';
import { useSingleTaskStore } from '../../../../store/singleTask.store';
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
      <Vehicle
        key={'dream_car'}
        x={agvPosition.x * 20}
        y={-agvPosition.y * 20}
        angle={translateAngel(agvPosition.angel)}
      ></Vehicle>
    </>
  );
});

export default memo(Vehicles);
