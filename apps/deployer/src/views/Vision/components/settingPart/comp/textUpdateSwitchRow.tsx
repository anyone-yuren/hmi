import { memo } from "react";
import CustomSwitch from "./customSwitch";

interface IProps {
  title: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}
const TextUpdateSwitchRow = (props: IProps) => {
  const { title, checked, onChange, className = "" } = props;
  return (
    <div
      className={`my-3 p-4 bg-[#d8d8d866] bg-opacity-20 rounded-lg flex items-center justify-between text-lg ${className}`}
    >
      <div>{title}</div>
      <div>
        <CustomSwitch
          checked={checked}
          onChange={(event: any) => {
            onChange && onChange(event.target.checked);
          }}
        />
      </div>
    </div>
  );
};

export default memo(TextUpdateSwitchRow);
