import { createStyles } from "antd-style";

const useStyles = createStyles(({ token, isDarkMode }) => {
  return {
    driwer: {
      backdropFilter: "blur(2px) !important",
      backgroundColor: !isDarkMode
        ? "rgba(255, 255, 255, 0.9) !important"
        : "rgba(0, 0, 0, 0.9) !important",
      backgroundSize: "50% 50% !important",
      backgroundRepeat: "no-repeat !important",
      backgroundImage: `url(${token.paperCyanImg}), url(${token.paperRedImg}) !important`,
      backgroundPosition: "right top, left bottom !important",
    },
    popoverBody: {
      backgroundColor: "transparent!important",
    },
    popover: {
      backdropFilter: "blur(2px) !important",
      backgroundColor: !isDarkMode
        ? "rgba(255, 255, 255, 0.9) !important"
        : "rgba(0, 0, 0, 0.9) !important",
      backgroundSize: "50% 50% !important",
      backgroundRepeat: "no-repeat !important",
      backgroundImage: `url(${token.paperCyanImg}), url(${token.paperRedImg}) !important`,
      backgroundPosition: "right top, left bottom !important",
      width: "60%!important",
    },
    imgBg: {
      backgroundColor: token.colorBgLayout,
      borderRadius: token.borderRadiusLG,
      overflow: "hidden",
      transition: "all 0.3s",
      cursor: "pointer",
      "&:hover": {
        transform: "backdrop-filter: blur(2px);",
        backgroundColor: token.colorFill,
      },
      img: {
        transition: "all 0.3s",
      },
      "&:hover img": {
        transform: "scale(1.04)",
      },
    },
    list: {
      li: {
        marginTop: token.marginXS,
      },
      a: {
        color: token.colorTextPlaceholder,
        lineHeight: token.lineHeightHeading4,
        transition: "all 0.3s",
        position: "relative",
        paddingLeft: token.paddingXS,
        fontSize: token.fontSizeIcon,
        display: "inline-block",
        "&:before": {
          content: "''",
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: "4px solid transparent",
          borderBottom: "4px solid transparent",
          borderLeft: `4px solid ${token.colorTextDisabled}`,
          transition: "all 0.3s",
          opacity: 0,
        },
        "&:hover": {
          color: token.colorPrimaryTextHover,
          transform: "translateX(2px)",
          "&:before": {
            opacity: 1,
          },
        },
      },
    },
  };
});

export default useStyles;
