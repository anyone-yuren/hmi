import { memo, useMemo } from "react";
import { toast } from "sonner";

import { useTranslation } from "react-i18next";
import "./pallet.css";
import BorderColorIcon from "@mui/icons-material/BorderColor";

const PalletAnnotation = (props: any) => {
  const { t } = useTranslation();
  console.log("props", props);
  const isPallet = useMemo(() => {
    return props.type === "pallet";
  }, [props]);
  return (
    <>
      <div className="text-[red]">
        <div
          className="line absolute left-[0] text-center text-[13px] z-10"
          style={{
            top: -20,
            width: props?.width * props.scale,
            height: 20,
            border: "1px solid black",
            borderBottom: "none",
          }}
        >
          <span
            className="relative bg-[white] text-[black]"
            style={{
              top: "-35%",
              paddingInline: 20,
            }}
            onClick={() => {
              toast.error("托盘宽度不可手动改变,是支腿宽度和进叉宽度的累加");
            }}
          >
            {t("托盘宽度")}: {props?.width}
          </span>
        </div>
        {props?.legs?.map((leg: any, index: number) => {
          return (
            <div
              key={"leg" + index}
              className="bottom-line absolute text-[13px] text-center"
              style={{
                width: leg?.width * props.scale,
                height: "10px",
                top:
                  props.handlesMaxHeight * props.scale +
                  leg?.height * props.scale +
                  props.height * props.scale,
                left: leg?.leftPosition * props.scale,
                border: "1px solid black",
                borderTop: "none",
              }}
              onClick={() => {
                props.handleSizeArea &&
                  props.handleSizeArea("legs", index, "width");
              }}
            >
              <span className="relative top-[120%] h-[30px] whitespace-nowrap text-center flex items-center justify-center">
                <BorderColorIcon style={{ fontSize: "12px" }} />
                {t("支腿宽度")}:{leg?.width}
              </span>
            </div>
          );
        })}

        {!isPallet &&
          props?.handles?.map((handle: any, index: number) => {
            return (
              <div
                key={"leg" + index}
                className="line absolute text-[13px] text-center"
                style={{
                  width: handle?.width * props.scale,
                  height: "30px",
                  top: props.handlesMaxHeight * props.scale - 30,
                  left: handle?.leftPosition * props.scale,
                  border: "1px solid black",
                  borderBottom: "none",
                  position: "absolute",
                }}
                onClick={() => {
                  props.handleSizeArea &&
                    props.handleSizeArea("handles", index, "width");
                }}
              >
                <span
                  className={`
                      absolute top-[-30px] whitespace-nowrap text-center flex items-center justify-end 
                      ${index === 0 ? "left-[0px]" : "right-[0px]"}
                  `}
                >
                  <BorderColorIcon style={{ fontSize: "12px" }} />
                  {t("支架宽度")}:{handle?.width}
                </span>
              </div>
            );
          })}

        {props?.handlesForkInWidth?.map((handle: any, index: number) => {
          console.log("handle", handle);
          return (
            <div
              key={"handlesForkInWidth" + index}
              className="line absolute text-[13px] text-center"
              style={{
                width: handle?.width * props.scale,
                height: "30px",
                top: props.handlesMaxHeight * props.scale,
                left: handle?.leftPosition * props.scale,
                border: "1px solid black",
                borderBottom: "none",
              }}
              onClick={() => {
                props.handleSizeArea &&
                  props.handleSizeArea("handlesForkInWidth", index, "width");
              }}
            >
              <div className="relative whitespace-nowrap h-[30px] text-center flex items-center justify-center">
                <BorderColorIcon style={{ fontSize: "12px" }} />
                {t("进叉宽度")}:{handle?.width}
              </div>
            </div>
          );
        })}

        {props?.legForkInWidth?.map((leg: any, index: number) => {
          console.log("leg", leg);
          return (
            <div
              key={"legForkInWidth" + index}
              className="line absolute text-[13px] text-center"
              style={{
                width: leg?.width * props.scale,
                height: "30px",
                top:
                  props.handlesMaxHeight * props.scale +
                  props?.height * props.scale,
                left: leg?.leftPosition * props.scale,
                border: "1px solid black",
                borderBottom: "none",
              }}
              onClick={() => {
                props.handleSizeArea &&
                  props.handleSizeArea("legForkInWidth", index, "width");
              }}
            >
              <div className="relative whitespace-nowrap h-[30px] text-center flex items-center justify-center">
                <BorderColorIcon style={{ fontSize: "12px" }} />
                {t("进叉宽度")}:{leg?.width}
              </div>
            </div>
          );
        })}

        <div
          className="left-line absolute text-[13px]"
          style={{
            width: "30px",
            height: props?.legsMaxHeight * props.scale,
            top:
              props?.handlesMaxHeight * props.scale +
              props?.height * props.scale,
            left: "-30px",
            border: "1px solid black",
            borderRight: "none",
          }}
          onClick={() => {
            props.handleSizeArea && props.handleSizeArea("legsMaxHeight");
          }}
        >
          <span className="relative w-full flex items-center justify-center left-[-100%] text-center whitespace-nowrap write-vertical-right ">
            <BorderColorIcon
              style={{
                fontSize: "12px",
              }}
            />
            &nbsp;
            {t("支腿高度")}: {props?.legsMaxHeight}
          </span>
        </div>

        {!isPallet && (
          <>
            <div
              className="left-line absolute text-[13px]"
              style={{
                width: "30px",
                height: props?.handlesMaxHeight * props.scale,
                top: "0px",
                border: "1px solid black",
                borderRight: "none",
                left: "-30px",
              }}
              onClick={() => {
                props.handleSizeArea &&
                  props.handleSizeArea("handlesMaxHeight");
              }}
            >
              <span className="relative flex items-center justify-center left-[-100%] whitespace-nowrap write-vertical-right">
                <BorderColorIcon
                  style={{
                    fontSize: "12px",
                  }}
                />
                &nbsp;
                {t("支架高度")}: {props?.handlesMaxHeight}
              </span>
            </div>
          </>
        )}

        <div
          className="right-line absolute top-[0] text-[13px]"
          style={{
            width: "30px",
            height: props?.totalHeight * props?.scale,
            right: "-30px",
            border: "1px solid black",
            borderLeft: "none",
          }}
          onClick={() => {
            props.handleSizeArea && props.handleSizeArea("totalHeight");
          }}
        >
          <span className="relative flex items-center justify-center right-[-120%] whitespace-nowrap write-vertical-right">
            <BorderColorIcon
              style={{
                fontSize: "12px",
              }}
            />
            &nbsp;
            {t("托盘高度")}: {props?.totalHeight}
          </span>
        </div>
      </div>
    </>
  );
};

export default memo(PalletAnnotation);
