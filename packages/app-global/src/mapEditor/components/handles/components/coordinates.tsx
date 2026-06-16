import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../store';
const Coordinates = () => {
  const { mousePosition } = useMapEditorStore(
    useShallow((s) => ({
      mousePosition: s.mousePosition,
    })),
  );
  if (!mousePosition) return null;
  return (
    <div className='flex flex-row gap-2  text-white px-2 items-end absolute -top-4 left-2'>
      <div>X: {mousePosition.x.toFixed(2)}</div>
      <div>Y: {mousePosition.y.toFixed(2)}</div>
    </div>
  );
};

export default Coordinates;
