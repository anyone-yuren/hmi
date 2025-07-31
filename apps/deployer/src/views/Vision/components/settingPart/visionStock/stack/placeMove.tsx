import React, { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSetState } from "ahooks";
import { toast } from "sonner";

import CustomSwitch from "../../comp/customSwitch";
import Title from "../../comp/title";
import TextUpdateRow from "../../comp/textUpdateRow";
import TextUpdateSwitchRow from "../../comp/textUpdateSwitchRow";
import TextChangeRow from "../../comp/textChangeRow";
import PointCloudFilter from "../../comp/pointCloudFilter";
import ModelListSelect from "../../comp/modelListSelect";
import LoadingButton from "../../comp/loadingButton";
import StorageListSelect from "../../comp/storageListSelect";
import Illustration from "./illustration";

import { postStackPlaceMoveVehicleSave as save } from "../../../../services/index";

interface IProps {
  initState: any;
}
// 货架设置
const PlaceMove = (props: IProps) => {
  const { initState } = props;

  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    auto_para_tuning: true, // 自动调参
    need_detect: false,
    extra_height: 0,
    compensation: [],
    pallet_model_list: [], // 选择的模型列表
    first_floor_height: 0, // 第一层货物高度
    need_detect_height: false, // 托盘高度检测
    scene_storage: [], // 场景库位列表
  });
  const { t } = useTranslation();

  const changeUpdateHashMap = (key: string, value: any) => {
    setUpdateHashMap({
      [key]: value,
    });
  };

  useEffect(() => {
    // 将参数转化为useState里面去
    if (!initState || !Object.keys(initState).length) return;
    const tempHashMap = { ...updateHashMap };
    const translateHashMap: any = {
      compensation: (originState: any) => {
        console.log("originState", originState);
        const ary = originState?.["compensation"]?.value?.[0];
        if (ary && ary.length > 3 && typeof ary[3] === "number") {
          ary[3] = ary[3] % 1 !== 0 ? Number(ary[3].toFixed(1)) : ary[3];
        }
        return ary;
      },
    };
    Object.keys(initState).forEach((key: string) => {
      if (tempHashMap[key] !== undefined) {
        tempHashMap[key] = translateHashMap[key]
          ? translateHashMap[key](initState)
          : initState[key]?.value;
      }
    });

    setUpdateHashMap(tempHashMap);
  }, [initState]);

  return (
    <>
      <div className="flex">
        <div className="w-[350px]">
          <TextUpdateSwitchRow
            title={t("自动调参")}
            checked={updateHashMap["auto_para_tuning"]}
            onChange={(checked: boolean) => {
              changeUpdateHashMap("auto_para_tuning", checked);
            }}
          />
          <TextUpdateSwitchRow
            key={"place_move_vehicle"}
            title={t("是否启用")}
            checked={updateHashMap["need_detect"]}
            onChange={(checked: boolean) => {
              changeUpdateHashMap("need_detect", checked);
            }}
          />

          <StorageListSelect
            title={t("场景库位")}
            value={updateHashMap?.["scene_storage"]}
            onChange={(value: any) => {
              changeUpdateHashMap("scene_storage", value);
            }}
          ></StorageListSelect>

          <PointCloudFilter
            type={"stack_place_move_vehicle"}
          ></PointCloudFilter>

          <Title>{t("模型")}</Title>
          <ModelListSelect
            value={updateHashMap?.pallet_model_list}
            onChange={(value: any) => {
              changeUpdateHashMap("pallet_model_list", value);
            }}
          ></ModelListSelect>

          <>
            <Title>{t("放货补偿参数")}</Title>
            {[
              { title: t("左右补偿"), index: 0 },
              { title: t("前后补偿"), index: 2 },
              { title: t("角度补偿"), index: 3 },
            ].map((item: any) => {
              return (
                <TextChangeRow
                  key={item.title}
                  title={item.title}
                  value={updateHashMap?.["compensation"]?.[item.index]}
                  validateRange={[
                    initState?.["compensation"]?.min,
                    initState?.["compensation"]?.max,
                  ]}
                  onChange={(value: string) => {
                    let val = updateHashMap?.["compensation"];
                    if (item.index === 3 && !Number.isInteger(Number(value))) {
                      val[item.index] = Number(value).toFixed(1);
                    } else {
                      val[item.index] = Number(value);
                    }
                    setUpdateHashMap({
                      ...updateHashMap,
                      compensation: val,
                    });
                  }}
                >
                  <div>
                    {updateHashMap?.["compensation"]?.[item.index] || 0}
                  </div>
                </TextChangeRow>
              );
            })}
          </>
          {/* )} */}

          <TextChangeRow
            title={t("额外提升叉臂")}
            value={updateHashMap?.["extra_height"]}
            validateRange={[
              initState?.["extra_height"]?.min,
              initState?.["extra_height"]?.max,
            ]}
            onChange={(value: string) => {
              changeUpdateHashMap("extra_height", value);
            }}
          >
            <div>{updateHashMap?.["extra_height"] || 0}</div>
          </TextChangeRow>

          <TextUpdateSwitchRow
            title={t("放货高度识别")}
            checked={updateHashMap["need_detect_height"]}
            onChange={(checked: boolean) => {
              changeUpdateHashMap("need_detect_height", checked);
            }}
          />

          {updateHashMap["need_detect_height"] && (
            <TextChangeRow
              title={t("高度补偿")}
              value={updateHashMap?.["compensation"]?.[1]}
              validateRange={[
                initState?.["compensation"]?.min,
                initState?.["compensation"]?.max,
              ]}
              onChange={(value: string) => {
                const val = updateHashMap?.["compensation"];
                val[1] = Number(value);
                setUpdateHashMap({
                  ...updateHashMap,
                  compensation: val,
                });
              }}
            >
              <div>{updateHashMap?.["compensation"]?.[1] || 0}</div>
            </TextChangeRow>
          )}

          <Title>{t("货物高度")}</Title>
          <TextChangeRow
            title={t("一层货物高度")}
            value={updateHashMap?.["first_floor_height"]}
            validateRange={[
              initState?.["first_floor_height"]?.min,
              initState?.["first_floor_height"]?.max,
            ]}
            onChange={(value: string) => {
              changeUpdateHashMap("first_floor_height", value);
            }}
          >
            <div>{updateHashMap?.["first_floor_height"]}</div>
          </TextChangeRow>

          {/* <Title>{t("防呆检测")}</Title>

          <TextUpdateRow>
            <div>{t("防呆是否启用")}</div>
            <div>
              <CustomSwitch
                checked={updateHashMap["base_pallet_model_detect"]}
                onChange={(event: any) => {
                  setUpdateHashMap({
                    base_pallet_model_detect: event.target.checked,
                  });
                }}
              />
            </div>
          </TextUpdateRow>

          {[
            { title: t("防呆左右阈值"), index: 0 },
            { title: t("防呆前后阈值"), index: 2 },
            { title: t("防呆角度阈值"), index: 4 },
          ].map((item: any) => {
            return (
              <TextUpdateRow
                key={item.title}
                onClick={() => {
                  //
                }}
              >
                <div>{item.title}</div>
                <div>{0}</div>
              </TextUpdateRow>
            );
          })} */}

          <LoadingButton
            fullWidth
            variant="contained"
            sx={{ color: "white", marginBottom: "40px" }}
            onPress={async () => {
              let sendState: any = {};
              const translateHashMap: any = {
                compensation: (originState: any, hashMap: any) => {
                  console.log(
                    `updateHashMap["compensation"]`,
                    updateHashMap["compensation"]
                  );

                  const obj = {
                    ...originState["compensation"],
                    compensation: [updateHashMap["compensation"]],
                  };

                  // obj.compensation[3] = obj.compensation[3]
                  // console.log("onb", obj);
                  return obj;
                },
              };
              const numberAry = ["uint", "int"];
              Object.keys(initState).forEach((key) => {
                sendState[key] = translateHashMap[key]
                  ? translateHashMap[key](initState, updateHashMap)
                  : {
                      ...initState[key],
                      value: numberAry.includes(initState[key]?.type)
                        ? Number(updateHashMap[key])
                        : updateHashMap[key],
                    };
              });
              await save(sendState);
              toast.success(t("操作成功"));
            }}
          >
            {t("保存")}
          </LoadingButton>
        </div>
        <div className="flex-1">
          <Illustration type="move" />
        </div>
      </div>
    </>
  );
};

export default memo(PlaceMove);
