import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";

import { styled } from "@mui/material/styles";

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.spacing(0.5),
  flexDirection: "column",
  width: "100%",
  height: "100%",
  "& .MuiTouchRipple-root": {
    color: "yellow", 
    opacity: 1,
  },
  "& .MuiTouchRipple-rippleVisible": {
    animationDuration: "0.6s", 
  },
}));

interface Props extends ButtonBaseProps {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string | React.ReactNode;
  icon?: React.ReactNode;
}

const IconLabelButton = (props: Props) => {
  const { children, onClick, label, icon, ...rect } = props;

  return (
    <StyledButtonBase {...rect} onClick={onClick}>
      {icon}
      {label}
      {children}
    </StyledButtonBase>
  );
};
export default IconLabelButton;
