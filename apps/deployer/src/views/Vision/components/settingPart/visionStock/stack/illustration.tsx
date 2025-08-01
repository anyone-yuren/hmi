import { memo, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Tips, { ImagesWidthTips } from "../../comp/tips";
import useVehicleChassis from "../../../../hooks/vehicleChassis";
import Arrow from "@/assets/arrow.png";

interface IProps {
  type: "detect" | "move";
}
const Illustration = (props: IProps) => {
  const { type: pageType } = props;
  const { t } = useTranslation();
  const { vehicleChassis } = useVehicleChassis();
  const [type] = useState(["STACKER", "BALANCE", "FORWARD", "OMNI_FORWARD"]);
  const multiTipsProps = {
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  };

  const vehicleImages = useMemo(() => {
    const hashMap: any = {
      X20S: "X20S",
      PALLET: "X20",
      STACKER: "SL14",
      FORWARD: "R20S",
      BALANCE: "SE15",
      TRILATERAL: "K1",
      OMNI_FORWARD: "O20",
    };
    return hashMap[vehicleChassis] || "X20";
  }, [vehicleChassis]);

  const isExist = useMemo(() => {
    return type.includes(vehicleChassis);
  }, [vehicleChassis, type]);

  if (!isExist) {
    return <div className="w-full text-center">{t("该车型不支持此模式")}</div>;
  }
  if (pageType === "move") {
    return (
      <div className="flex-1 m-[12px]">
        <Tips>
          {t(
            "假设每次堆叠托盘都往一个方向偏,则可以根据实际情况调整左右或者前后补偿参数。"
          )}
          <br />
          {t(
            "以车尾到车头为正方向,左右补偿数值减小,车子最终位置向右平移,前后补偿数值减小,车子最终位置向后平移。"
          )}
          <br />
          {t("补偿之后的堆叠效果如右图。")}
        </Tips>
        <div className="flex">
          <div className="flex-1 justify-center items-center">
            <ImagesWidthTips
              containClass="my-[20px]"
              img={"vehicle/" + vehicleImages}
              imageHeight={100}
              tipsProps={multiTipsProps}
            ></ImagesWidthTips>
          </div>
          <div>
            <ImagesWidthTips
              containClass="mt-[30px]"
              img={"common/shelf_front_front"}
              imageHeight={120}
              tipsProps={{ bottom: "-20px" }}
              title={t("前后补偿")}
            >
              {t("前后补偿")}
            </ImagesWidthTips>
          </div>
          <div className="flex items-center px-2">
            <img className="w-[30px]" src={Arrow} />
          </div>
          <div>
            <ImagesWidthTips
              containClass="my-[20px]"
              img={"common/shelf"}
              imageHeight={100}
              tipsProps={{ top: "-20px" }}
            >
              {t("多层堆叠")}
            </ImagesWidthTips>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 m-[12px]">
      <Tips>
        {t("假设每次堆叠托盘在叉车上都有一个角度,则可以修改角度补偿参数。")}
        <br />
        {t("如下图偏了约1°,则在角度补偿参数内填写-1")}
        <br />
        {t("补偿规则")}:
        <br />
        {t("数值增大，则车辆逆时针旋转。")}
      </Tips>
      <div className="flex">
        <div className="flex-1 justify-center items-center">
          <ImagesWidthTips
            containClass="my-[20px]"
            img={"vehicle/" + vehicleImages}
            imageHeight={100}
            tipsProps={multiTipsProps}
          ></ImagesWidthTips>
        </div>
        <div>
          <ImagesWidthTips
            containClass=""
            img={"common/shelf_rotate_front"}
            imageHeight={150}
            tipsProps={{ top: "-20px" }}
          >
            {t("1°")}
          </ImagesWidthTips>
        </div>
        <div className="flex items-center px-2">
          <img className="w-[30px]" src={Arrow} />
        </div>
        <div>
          <ImagesWidthTips
            containClass="my-[20px]"
            img={"common/shelf"}
            imageHeight={100}
            tipsProps={{ top: "-20px" }}
          >
            {t("多层堆叠")}
          </ImagesWidthTips>
        </div>
      </div>

      <Tips>
        {t(
          "假设每次堆叠托盘都往一个方向偏,则可以根据实际情况调整左右或者前后补偿参数。"
        )}
        <br />
        {t(
          "以车尾到车头为正方向,左右补偿数值减小,车子最终位置向右平移,前后补偿数值减小,车子最终位置向后平移。"
        )}
        <br />
        {t("补偿之后的堆叠效果如右图。")}
      </Tips>

      <div className="flex">
        <div className="flex-1 justify-center items-center">
          <ImagesWidthTips
            containClass="my-[20px]"
            img={"vehicle/" + vehicleImages}
            imageHeight={100}
          ></ImagesWidthTips>
        </div>
        <div>
          <ImagesWidthTips
            containClass="mt-[30px]"
            img={"common/shelf_round_front"}
            imageHeight={120}
            tipsProps={multiTipsProps}
          >
            <div className="w-full h-full relative">
              <span className="absolute top-[-20px] left-[10%] transform -translate-x-1/2">
                {t("前后补偿")}
              </span>
              <span className="absolute bottom-[-20px] left-[6%]">
                {t("左右补偿")}
              </span>
            </div>
          </ImagesWidthTips>
        </div>
        <div className="flex items-center px-2">
          <img className="w-[30px]" src={Arrow} />
        </div>
        <div>
          <ImagesWidthTips
            containClass="my-[20px]"
            img={"common/shelf"}
            imageHeight={100}
            tipsProps={{ top: "-20px" }}
          >
            {t("多层堆叠")}
          </ImagesWidthTips>
        </div>
      </div>

      <ImagesWidthTips
        img={`${vehicleImages}_recenter`}
        imageHeight={100}
        tipsProps={{ top: "-20px" }}
        title={t("车身回正时基准点到货架前表面的距离")}
      >
        {t("车身回正时基准点到货架前表面的距离")}
      </ImagesWidthTips>

      <ImagesWidthTips
        containClass="mt-[30px]"
        img={`${vehicleImages}_stop`}
        imageHeight={100}
        tipsProps={{ top: "-20px" }}
        title={t("停车后基准点到货架表面的距离")}
      >
        {t("停车后基准点到货架表面的距离")}
      </ImagesWidthTips>
    </div>
  );
};

export default memo(Illustration);
