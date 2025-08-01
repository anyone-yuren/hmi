import React, { memo } from "react";
import { ThemeProvider, createTheme } from "@mui/material";

const LightTheme = (props: any) => {
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: "light",
          primary: {
            main: "#00D1D1",
          },
        },
        typography: {
          fontSize: 20,
        },
      })}
    >
      <div className="text-black h-full">{props.children}</div>
    </ThemeProvider>
  );
};

export default memo(LightTheme);
