import { createStyles } from "antd-style";

const useStyles = createStyles(({ token }) => ({
  layout_wrapper: {
    display: "flex",
    width: "100%",
    height: "100vh",
    overflowX: "hidden",
    background: token.colorBgContainer,
    ".ant-layout-content": {
      height: "calc(100vh - 48px)",
      boxSizing: "border-box",
      flex: "1",
      padding: token.paddingMD,
      overflowX: "hidden",
    },
    ".ant-layout-sider": {
      height: "calc(100vh)",
      borderInlineEnd: `1px solid ${token.colorSplit}`,
      marginInlineEnd: "-1px",
    },
    ".ant-layout": {
      background: token.colorBgContainer,
    },
  },
  footer: {
    padding: `10px ${token.paddingMD}px`,
    textAlign: "center",
  },
}));

export default useStyles;
