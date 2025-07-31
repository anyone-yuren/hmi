import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface State {
  visionPickSetting: {},
  setVisionPickSetting: (visionPickSetting: any) => void
  pointCloud: any[],
  setPointCloud: (pointCloud: any) => void,
  pointCloudParams: {},
  setPointCloudParams: (pointCloudParams: any) => void,
  chassis: number
  setChassis: (chassis: number) => void,
  isTrilateral: () => boolean
  pointsCloudHeart: number,
  setPointsCloudHeart: (pointsCloudHeart: number) => void
  pointsCloudKey: string,
  setPointsCloudKey: (pointsCloudKey: string) => void
}


const hashMap: any = {
  chassis: {
    1: "STACKER",
    2: "PALLET",
    3: "FORWARD",
    9: "BALANCE",
    13: "TRILATERAL",
    14: "OMNI_FORWARD",
  }
}

export const useVisionStore = create<State>()(
  persist(
    (set, get) => ({
      visionPickSetting: {},
      setVisionPickSetting: (visionPickSetting: any) => {
        set({ visionPickSetting })
      },
      pointCloud: [],
      setPointCloud: (pointCloud: any) => {
        set({ pointCloud })
      },
      pointCloudParams: {},
      setPointCloudParams: (pointCloudParams: any) => {
        set({ pointCloudParams })
      },
      chassis: 13,
      setChassis: (chassis: number) => {
        set({ chassis })
      },
      isTrilateral: () => { // 是否是K车
        const chassis = get().chassis;
        return hashMap.chassis[chassis] === "TRILATERAL"
      },
      pointsCloudHeart: 0,
      setPointsCloudHeart: (pointsCloudHeart: number) => {
        set({ pointsCloudHeart })
      },
      pointsCloudKey: "",
      setPointsCloudKey: (pointsCloudKey: string) => {
        set({ pointsCloudKey })
      },
    }),
    {
      name: "vision-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
