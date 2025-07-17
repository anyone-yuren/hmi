import { styled, TableCell, Table } from "@mui/material";
export const StatusCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
}));
export const InputCell = styled(TableCell)(({ theme }) => ({
  "&& p": {
    margin: "0px",
  },
  "&& span": {
    fontSize: "18px",
    opacity: 0.5,
  },
}));
export const SuccessDiv = styled("div")(({ theme }) => ({
  width: "20px",
  height: "20px",
  background: "#0FB200",
  border: "1px solid #fff",
  borderRadius: "20px",
  display: "inline-block",
}));
export const ErrDiv = styled("div")(({ theme }) => ({
  width: "20px",
  height: "20px",
  background: "#7f8c8d",
  border: "1px solid #fff",
  borderRadius: "20px",
  display: "inline-block",
}));
export const TableBox = styled(Table)(({ theme }) => ({
  "& .MuiTableCell-root": {
    fontSize: "20px",
    color: "#fff",
    borderBottomColor: "rgb(216 216 216 / 20%)",
    padding: "11px",
  },

  "& .MuiTableCell-head": {
    color: "rgb(255 255 255 / 50%)",
    backgroundColor: "#445260",
    padding: "25px 10px 20px",
    lineHeight: "inherit",
  },
}));
export const EmptyBoxDiv = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: `calc(50% - ${theme.spacing(4)})`,
}));
