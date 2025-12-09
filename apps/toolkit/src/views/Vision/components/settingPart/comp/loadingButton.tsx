import { memo, useState } from "react";
import { Button } from "@mui/material";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";
const l23 = keyframes`
  100% {
    transform: rotate(1turn);
  }
`;

export const Loading = styled("div")(({ theme }) => ({
  width: "35px",
  aspectRatio: 1,
  display: "grid",
  borderRadius: "50%",
  background: `linear-gradient(0deg, ${theme.palette.primary.dark} 30%, #0000 0 70%, ${theme.palette.primary.main} 0) 50%/8% 100%, linear-gradient(90deg, ${theme.palette.primary.light} 30%, #0000 0 70%, ${theme.palette.primary.dark} 0) 50%/100% 8%`,
  backgroundRepeat: "no-repeat",
  animation: `${l23} 1s infinite steps(8)`,
  "&::after": {
    content: "''",
    gridArea: "1/1",
    borderRadius: "50%",
    background: "inherit",
    opacity: "0.915",
    transform: "rotate(45deg)",
  },
}));

const LoadingButton = (props: any) => {
  const { onPress, ...rest } = props;
  const [loading, setLoading] = useState(false);
  return (
    <Button
      {...rest}
      onClick={async () => {
        if (!onPress || loading) return;
        try {
          setLoading(true);
          await onPress();
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      }}
    >
      {loading ? <Loading /> : props.children}
    </Button>
  );
};

export default memo(LoadingButton);
