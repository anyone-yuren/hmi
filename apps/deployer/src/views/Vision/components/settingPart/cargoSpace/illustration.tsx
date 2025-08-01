import { memo, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Tips, { ImagesWidthTips } from "../comp/tips";

const Illustration = (props: any) => {
  const { t } = useTranslation();
  const multiTipsProps = {
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  };

  return (
    <div className="flex-1 mt-[12px]">
      <Tips>
        {t("参数说明")}:
        <br />
        {t(
          "针对单一货物尺寸,可以在该界面设置货物宽度与高度,以及库位左右间隙来调整放货空间检测参数。"
        )}
      </Tips>
      <ImagesWidthTips
        containClass="my-[30px]"
        img={"space/goods_status"}
        imageHeight={180}
        tipsProps={multiTipsProps}
      >
        <div className="w-full h-full relative">
          <span className="absolute top-[-20px] left-1/2 transform -translate-x-1/2">
            {t("货物宽度")}
          </span>
          <span className="absolute top-1/2 right-[-60px] transform -translate-y-1/2">
            {t("货物高度")}
          </span>
        </div>
      </ImagesWidthTips>

      <ImagesWidthTips
        containClass="my-[50px]"
        img={"space/shelf_status"}
        imageHeight={250}
        tipsProps={multiTipsProps}
      >
        <div className="w-full h-full relative">
          <span className="absolute bottom-[-30px] w-[80px] right-[60px]">
            {t("库位左右间隙")}
          </span>
          <span className="absolute bottom-[-30px] right-[-40px] w-[80px]">
            {t("库位左右间隙")}
          </span>
        </div>
      </ImagesWidthTips>
    </div>
  );
};

export default memo(Illustration);
