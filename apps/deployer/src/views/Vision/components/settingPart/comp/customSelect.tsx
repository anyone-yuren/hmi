import { Select } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomSelect = styled(Select)(({ theme, ...props }) => {
  const { size } = props;
  return {
    minWidth: size === "small" ? 80 : 110,
    maxWidth: size === "small" ? 200 : 260,
    minHeight: size === "small" ? 35 : 45,
    background: theme?.palette.mode === "dark" ? "#6b7682" : "#e7e7e7",
    borderRadius: "7px",
    overflow: "hidden",
    paddingLeft: "10px",
    // "& .MuiSelect-select": {
    //   background: "red",
    // },
    // "& .MuiMenuItem-root.Mui-selected": {
    //   backgroundColor: "red", // 修改选中项的背景色
    // },

    "& .MuiSelect-select:focus": {
      background: "transparent",
    },
    "& .MuiTypography-root": {
      fontSize: "16px",
    },
  };
});

export default CustomSelect;
