import { isEqual } from "lodash-es";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useGlobalStore } from "./globalStore";
type CHARGE_PILE_STATUS = {
  charge_status: number; //充电状态
  brush_board_status: number; //充电刷板收回状态，0:伸出，1：收回
  output_voltage: number; //输出电压
  output_current: number; //输出电流
  error_code: number; //错误码
  pe_charge_input: boolean; //充电输入光电
  pe_charge_output: boolean; //充电输出光电
};
interface State {
  powerStatus: {
    power: number;
    charge_status: number;
  };
  setPowerStatus: (powerStatus: {
    power: number;
    charge_status: number;
  }) => any;
  seniorPoints: any[];
  setSeniorPoints: (seniorPoints: any[]) => void;
  auto_manual_status: number;
  setAutoManualStatus: (auto_manual_status: number) => void;
  // 电池
  charge_pile_status: CHARGE_PILE_STATUS;
  setChargePileStatus: (charge_pile_status: CHARGE_PILE_STATUS) => void;

  // 信号强度
  signal: number;
  setSignal: (signal: number) => void;
}
export const useVehicleStore = create<State>()(
  persist(
    (set, get) => ({
      charge_pile_status: {
        charge_status: 0,
        brush_board_status: 0,
        output_voltage: 0,
        output_current: 0,
        error_code: 0,
        pe_charge_input: false,
        pe_charge_output: false,
      },
      setChargePileStatus: (charge_pile_status: CHARGE_PILE_STATUS) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave) {
          set({ charge_pile_status });
        }
      },
      powerStatus: {
        power: 0,
        charge_status: 0,
      },
      setPowerStatus: (powerStatus: {
        power: number;
        charge_status: number;
      }) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave && !isEqual(powerStatus, get().powerStatus)) {
          set({ powerStatus });
        }
      },
      seniorPoints: [],
      setSeniorPoints: (seniorPoints: any[]) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave) {
          set({ seniorPoints });
        }
      },
      auto_manual_status: 0,
      setAutoManualStatus: (auto_manual_status: number) => {
        const { cacheSave } = useGlobalStore.getState();
        if (
          cacheSave &&
          !isEqual(auto_manual_status, get().auto_manual_status)
        ) {
          set({ auto_manual_status });
        }
      },
      // 信号强度
      signal: 0,
      setSignal: (signal: number) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave) {
          set({ signal });
        }
      },
    }),
    {
      name: "vehicle-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
