import { memo } from "react";

const TextUpdateRow = (props: any) => {
  return (
    <div
      onClick={props?.onClick}
      className={`my-3 p-4 bg-[#d8d8d866] bg-opacity-20 rounded-lg flex items-center justify-between text-lg ${props?.className}`}
    >
      {props.children}
    </div>
  );
};

export default memo(TextUpdateRow);
