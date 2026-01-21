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

  const {
    runAsync: getFloor,
    loading: floorMapLoading,
    cancel,
  } = useRequest<
    Result<{
      grid_map: {
        data: Record<any, string>;
        map_to_card: Record<any, string>;
        origin: Record<any, string>;
      };
    }>,
    [floor: number]
  >(getFloorData, {
    // pollingInterval: 1000,
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
    // cancel();
  };

  return { getFloorMapData, floorMapLoading };
};

export default useMapFloorData;
