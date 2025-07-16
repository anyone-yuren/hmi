import SettleActions from "./settleActions";
import CenterAction from "./centerAction";
import { memo } from "react";

const Actions = ({ isReflector }: { isReflector: boolean }) => {
  if (!isReflector) {
    return null
  }

  return (
    <div className="flex justify-between items-center">
      <SettleActions />
      <CenterAction />
    </div>
  )
}

export default memo(Actions);
