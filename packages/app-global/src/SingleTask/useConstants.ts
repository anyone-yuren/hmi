
import { ISubTaskItem } from "./index.d"
import { useTranslation } from "react-i18next";
const useConstants = () => {
  const { t } = useTranslation();
  const TaskStatusHashMap: Record<
    ISubTaskItem["task_state"],
    { text: string; color: string }
  > = {
    Init: {
      text: t("未执行"),
      color: "#aeaeae",
    },
    Running: {
      text: t("执行中"),
      color: "#00D1D1",
    },
    Completed: {
      text: t("完成"),
      color: "#009688",
    },
    Error: {
      text: t("错误"),
      color: "#f44336",
    },
    Cancel: {
      text: t("取消"),
      color: "#ff9800",
    },
  };

  const TaskTypeHashMap: Record<ISubTaskItem["task_type"], string> = {
    Pick: t("取货"),
    Null: t("移动"),
    Charge: t("充电"),
    Place: t("放货"),
  };
  return { TaskStatusHashMap, TaskTypeHashMap }
}

export default useConstants;
