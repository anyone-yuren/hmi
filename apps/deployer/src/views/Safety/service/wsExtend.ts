import { useShallow } from "zustand/react/shallow";
import { useSafetyStore } from "../store/safety.store";
import { isEqual } from "lodash";

export default function useHybirdWsExtend() {
  const { setObsInfo, setSeniorPoints, setGoodsInfo, setTurnRegionData } =
    useSafetyStore(
      useShallow((store) => ({
        setObsInfo: store.setObsInfo,
        setSeniorPoints: store.setSeniorPoints,
        setGoodsInfo: store.setGoodsInfo,
        setTurnRegionData: store.setTurnRegionData,
      }))
    );

  return {
    "/sirius/topics/safety_obs_info": (data: any) => {
      // 这里不做阈值处理
      setObsInfo(data);
    },
    "/sirius/topics/compose_sensor_point": (data: any) => {
      // 避障点云
      setSeniorPoints(data?.points ?? []);
    },
    "/sirius/topics/goods_info": (data: any) => {
      // 货物信息
      setGoodsInfo(data);
    },
    "/sirius/topics/safety_protect_region": (data: any) => {
      //转弯区域
      console.log("推送的数据", data)
      setTurnRegionData(data.points || []);
    },
  };
}
