import { memo } from "react";
// import CustomSwitch from "./customSwitch";
import { Switch } from "antd";

interface IProps {
  title: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}
const textUpdateAntdSwitch = (props: IProps) => {
  const { title, checked, onChange, className = "" } = props;
  return (
    <div
      className={`my-3 p-4 bg-[#d8d8d866] bg-opacity-20 rounded-lg flex items-center justify-between text-lg ${className}`}
    >
      <div>{title}</div>
      <div>
        <Switch
          checked={checked}
          onChange={(checked: boolean) => {
            onChange && onChange(checked);
          }}
        />
      </div>
    </div>
  );
};

export default memo(textUpdateAntdSwitch);
