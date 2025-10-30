import { isEqual } from "lodash-es";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useGlobalStore } from "./globalStore";
type CHARGE_PILE_STATUS = {
  ip: string;
  port: number;
  charge_status: number; //充电状态
  brush_board_status: number; //充电刷板收回状态，0:伸出，1：收回
  output_voltage: number; //输出电压
  output_current: number; //输出电流
  temperature_value: number; //温度值
  temperature_status: number; //温度状态 0正常 1异常
  error_code: number; //错误码
  pe_charge_input: boolean; //充电输入光电
  pe_charge_output: boolean; //充电输出光电
  connect_status: number; // 充电桩连接状态 0:未连接 1:已连接 自动下发的充电桩才会连接,手动下发的充电桩不会连接
};
interface IPowerStatus {
  power: number;
  charge_status: number;
  current: number;
  voltage: number;
}

interface ITaskInfo {
  operate_identification: number; //任务类型：0移动 1取货 2放货 3充电
  task_id: number; //任务号
  task_point_id: number; //任务点
  task_state: number; //任务状态 1执行中 2完成
  task_value1: number; //任务参数1，充电任务：1按电量  3按时间
  task_value2: number; //任务参数2，充电目标值
  error_x: number; //x误差，单位:mm
  error_y: number; //y误差，单位:mm
  error_angle: number; //角度误差，单位:度
  agv_id: string;
}
interface State {
  powerStatus: IPowerStatus;
  setPowerStatus: (powerStatus: IPowerStatus) => any;
  systemDateTime?: string;
  setSystemDateTime: (systemDateTime: string) => void;
  // 高级点位
  seniorPoints: any[];
  setSeniorPoints: (seniorPoints: any[]) => void;
  auto_manual_status: number;
  setAutoManualStatus: (auto_manual_status: number) => void;
  // 充电桩
  chargePileStatus: CHARGE_PILE_STATUS;
  setChargePileStatus: (chargePileStatus: CHARGE_PILE_STATUS) => void;
  rcsIsOnline: boolean;
  setRcsIsOnline: (rcsIsOnline: boolean) => void;

  // 信号强度
  signal: number;
  setSignal: (signal: number) => void;

  taskInfo: ITaskInfo;
  setTaskInfo: (taskInfo: ITaskInfo) => void;
}
export const useVehicleStore = create<State>()(
  persist(
    (set, get) => ({
      chargePileStatus: {
        ip: "-",
        port: 0,
        charge_status: 0,
        brush_board_status: 0,
        output_voltage: 0,
        output_current: 0,
        temperature_value: 0,
        temperature_status: 0,
        error_code: 0,
        pe_charge_input: false,
        pe_charge_output: false,
        connect_status: 0,
      },
      setChargePileStatus: (chargePileStatus: CHARGE_PILE_STATUS) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave) {
          set({ chargePileStatus });
        }
      },
      powerStatus: {
        power: 0,
        charge_status: 0,
        current: 0,
        voltage: 0,
      },
      setPowerStatus: (powerStatus: IPowerStatus) => {
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
      systemDateTime: "",
      setSystemDateTime: (systemDateTime: string) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave && !isEqual(systemDateTime, get().systemDateTime)) {
          set({ systemDateTime });
        }
      },
      rcsIsOnline: false,
      setRcsIsOnline: (rcsIsOnline: boolean) => {
        set({ rcsIsOnline });
      },
      taskInfo: {
        operate_identification: 0,
        task_id: 0,
        task_point_id: 0,
        task_state: 2,
        task_value1: 1,
        task_value2: 100,
        error_x: 10,
        error_y: 3,
        error_angle: 0.4,
        agv_id: "",
      },
      setTaskInfo: (taskInfo: any) => {
        const { cacheSave } = useGlobalStore.getState();
        if (cacheSave && !isEqual(taskInfo, get().taskInfo)) {
          set({ taskInfo });
        }
      },
    }),
    {
      name: "vehicle-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
