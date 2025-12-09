import { useRequest } from 'ahooks';
import { useShallow } from 'zustand/react/shallow';
import { getFloorData } from '../service';
import { useHybirdStore } from '../store/hybird.store';
const useMapFloorData = () => {
  const { setFloorData, setMapLoading } = useHybirdStore(
    useShallow((state) => ({
      setFloorData: state.setFloorData,
      setMapLoading: state.setMapLoading,
    })),
  );

  const { runAsync: getFloor, loading: floorMapLoading } = useRequest<
    Result<{
      grid_map: {
        data: Record<any, string>;
        map_to_card: Record<any, string>;
        origin: Record<any, string>;
      };
    }>,
    [floor: number]
  >(getFloorData, {
    manual: true,
    onSuccess: (res) => {
      if (res) {
        setFloorData(res);
        setMapLoading(false);
      }
    },
    onFinally: () => {
      setMapLoading(false);
    },
  });

  const getFloorMapData = async (floor: number) => {
    setMapLoading(true);
    await getFloor(floor);
  };

  return { getFloorMapData, floorMapLoading };
};

export default useMapFloorData;
