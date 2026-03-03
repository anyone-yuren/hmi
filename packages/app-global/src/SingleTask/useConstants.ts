import { useTranslation } from "react-i18next";
import { ISubTaskItem } from "./index.d";
const useConstants = () => {
  const { t } = useTranslation();
  const TaskStatusHashMap: Record<
    ISubTaskItem["task_state"] | 0 | 1,
    { text: string; color: string }
  > = {
    0: {
      text: t("common.taskStatus.unexecuted"),
      color: "#aeaeae",
    },
    1: {
      text: t("common.taskStatus.running"),
      color: "#00D1D1",
    },
    Init: {
      text: t("common.taskStatus.unexecuted"),
      color: "#aeaeae",
    },
    Running: {
      text: t("common.taskStatus.running"),
      color: "#00D1D1",
    },
    Completed: {
      text: t("common.taskStatus.success"),
      color: "#009688",
    },
    Error: {
      text: t("common.taskStatus.error"),
      color: "#f44336",
    },
    Cancel: {
      text: t("common.taskStatus.cancel"),
      color: "#ff9800",
    },
    Stop: {
      text: t("common.taskStatus.stop"),
      color: "#FFEB3B",
    },
  };

  const TaskTypeHashMap: Record<ISubTaskItem["task_type"], string> = {
    Pick: t("common.taskState.pickUp"),
    Null: t("common.taskState.moving"),
    Charge: t("common.taskState.charging"),
    Place: t("common.taskState.pickDown"),
  };

  const vertexTypeHashMap: any = {
    0: t("deployer.singleTask.commonPoint"),
    1: t("deployer.singleTask.warehousePoint"),
    2: t("deployer.singleTask.homePoint"),
    3: t("deployer.singleTask.turnRoundPoint"),
    4: t("deployer.singleTask.stereoWarehousePoint"),
    5: t("deployer.singleTask.visionPoint"),
    6: t("deployer.singleTask.chargePoint"),
    7: t("deployer.singleTask.devicePoint"),
  };
  return { TaskStatusHashMap, TaskTypeHashMap, vertexTypeHashMap };
};

export default useConstants;
