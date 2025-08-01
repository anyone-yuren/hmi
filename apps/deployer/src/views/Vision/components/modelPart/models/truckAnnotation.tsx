import { TextField } from "@mui/material";
import { memo, forwardRef, useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import BorderColorIcon from "@mui/icons-material/BorderColor";

import "./pallet.css";

const TruckAnnotation = forwardRef((props: any, ref) => {
  const {
    widthText,
    heightText,
    lengthText,
    realWidth,
    updateKey,
    handleSizeArea,
  } = props;
  const { t } = useTranslation();

  return (
    <>
      <div
        className="bottom-line text-center w-full absolute"
        style={{
          border: "1px solid black",
          height: "20px",
          bottom: "-20px",
          borderTop: "none",
          borderBottom: "1px solid black",
        }}
      >
        <span
          className="relative bottom-[-120%] px-[12px] bg-[white] w-[80px] mx-auto flex items-center justify-center text-[red] text-[12px]"
          onClick={() => {
            handleSizeArea && handleSizeArea(updateKey, "length", t("长"));
          }}
        >
          <BorderColorIcon style={{ fontSize: "12px" }} /> {t("长")}:{" "}
          {lengthText}
        </span>
      </div>
      <div
        className="left-line top-0 absolute"
        style={{
          border: "1px solid black",
          borderRight: "none",
          width: "20px",
          left: "-20px",
          height: "100%",
        }}
      >
        <span
          className="relative w-full flex items-center justify-center left-[-120%] text-center whitespace-nowrap text-[red] text-[12px] write-vertical-right "
          onClick={() => {
            handleSizeArea && handleSizeArea(updateKey, "height", t("高"));
          }}
        >
          <BorderColorIcon style={{ fontSize: "12px" }} />
          &nbsp;
          {t("高")}: {heightText}
        </span>
      </div>
      <div
        className="bottom-line text-center w-full absolute"
        style={{
          border: "1px solid black",
          height: "20px",
          bottom: "-20px",
          borderTop: "none",
          borderBottom: "1px solid black",
          width: `${realWidth}px`,
          right: `${-realWidth}px`,
        }}
      >
        <span
          className="relative bottom-[-120%] px-[12px] bg-[white] w-[80px] mx-auto flex items-center justify-center text-[red] text-[12px]"
          onClick={() => {
            handleSizeArea && handleSizeArea(updateKey, "width", t("宽"));
          }}
        >
          <BorderColorIcon style={{ fontSize: "12px" }} /> {t("宽")}:{" "}
          {widthText}
        </span>
      </div>
    </>
  );
});

export default memo(TruckAnnotation);
