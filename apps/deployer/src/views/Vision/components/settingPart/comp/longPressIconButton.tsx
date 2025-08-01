import React, { memo, useRef } from "react";
import { IconButton } from "@mui/material";

import { useLongPress } from "ahooks";

interface ILongPressIconButtonProps {
  onPress: (key: string) => void;
  onLongPress: (key: string) => void;
  children?: any;
  typeKey: string;
  onLongPressEnd: () => void;
}
const LongPressIconButton = (props: ILongPressIconButtonProps) => {
  const { onPress, onLongPress, typeKey, onLongPressEnd } = props;
  const ref = useRef<any>(null);

  useLongPress(
    () => {
      onLongPress(typeKey);
    },
    ref,
    {
      moveThreshold: { x: 30 },
      onClick: () => {
        onPress(typeKey);
      },
      onLongPressEnd: () => {
        onLongPressEnd();
      },
    }
  );

  return <IconButton ref={ref}>{props?.children}</IconButton>;
};

export default memo(LongPressIconButton);
