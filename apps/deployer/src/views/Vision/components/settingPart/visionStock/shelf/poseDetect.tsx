import React, { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSetState } from "ahooks";
import { toast } from "sonner";

import Title from "../../comp/title";
import TextChangeRow from "../../comp/textChangeRow";
import TextUpdateSwitchRow from "../../comp/textUpdateSwitchRow";
import PointCloudFilter from "../../comp/pointCloudFilter";
import ModelListSelect from "../../comp/modelListSelect";
import StorageListSelect from "../../comp/storageListSelect";
import LoadingButton from "../../comp/loadingButton";
import Illustration from "./illustration";

import { postShelfPlacePalletPositionDetectSave as save } from "../../../../services/index";
interface IProps {
  initState: any;
}
// 堆叠放货 - 姿态识别
const PoseDetect = (props: IProps) => {
  const { initState } = props;
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    auto_para_tuning: false, // 自动调参
    need_detect: true, // 是否启用
    pallet_model_list: [], // 选择的模型列表
    extra_height: 0, // 额外抬升叉臂高度
    start_mid_dist: 0, // 车身回正时基准点到托盘的距离
    end_mid_dist: 0, // 停车后基准点到托盘的距离
    back_mid_dist: 0, // 退出时车身行走的直线距离
    compensation: [],
    ground_transfer_points: [], // 地面接驳位
  });
  const { t } = useTranslation();

  useEffect(() => {
    // 将参数转化为useState里面去
    if (!initState || !Object.keys(initState).length) return;
    const tempHashMap = { ...updateHashMap };
    const translateHashMap: any = {
      compensation: (originState: any) => {
        const ary = originState?.["compensation"]?.value?.[0];
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

  const changeUpdateHashMap = (key: string, value: any) => {
    setUpdateHashMap({
      [key]: value,
    });
  };

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
            title={t("是否启用")}
            checked={updateHashMap["need_detect"]}
            onChange={(checked: boolean) => {
              changeUpdateHashMap("need_detect", checked);
            }}
          />

          <StorageListSelect
            title={t("地面接驳位")}
            value={updateHashMap?.["ground_transfer_points"]}
            onChange={(value: any) => {
              changeUpdateHashMap("ground_transfer_points", value);
            }}
          ></StorageListSelect>

          {/* 点云选择 */}
          <PointCloudFilter
            type={"shelf_pallet_position_detect"}
          ></PointCloudFilter>

          <Title>{t("模型")}</Title>
          <ModelListSelect
            value={updateHashMap?.pallet_model_list}
            onChange={(value: any) => {
              changeUpdateHashMap("pallet_model_list", value);
            }}
          ></ModelListSelect>

          {/* 姿态识别没有K车,只要前后 */}
          <Title>{t("补偿参数")}</Title>
          {[
            { title: t("左右补偿"), index: 0 },
            { title: t("前后补偿"), index: 2 },
            { title: t("角度补偿"), index: 3 },
          ].map((item: any) => {
            const val = updateHashMap?.["compensation"]?.[item.index];
            return (
              <TextChangeRow
                key={item.title}
                title={item.title}
                value={val}
                validateRange={[
                  initState?.["compensation"]?.min,
                  initState?.["compensation"]?.max,
                ]}
                onChange={(value) => {
                  const front = updateHashMap?.["compensation"];
                  front[item.index] = Number(value);
                  setUpdateHashMap({
                    ...updateHashMap,
                    compensation: front,
                  });
                }}
              >
                <div>{val || 0}</div>
              </TextChangeRow>
            );
          })}

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

          <Title>{t("路径规划")}</Title>
          {[
            { title: t("退出时车身行走的直线距离"), key: "back_mid_dist" },
            { title: t("车身回正时基准点到货架的距离"), key: "start_mid_dist" },
            { title: t("停车后基准点到货架的距离"), key: "end_mid_dist" },
          ]?.map((item: any) => {
            const val = updateHashMap?.[item.key];
            return (
              <TextChangeRow
                title={item.title}
                value={val}
                key={item.key}
                validateRange={[
                  initState?.[item.key]?.min,
                  initState?.[item.key]?.max,
                ]}
                onChange={(value: string) => {
                  changeUpdateHashMap(item.key, value);
                }}
              >
                <div>{updateHashMap?.[item.key]}</div>
              </TextChangeRow>
            );
          })}

          <LoadingButton
            fullWidth
            variant="contained"
            sx={{ color: "white", marginBottom: "40px" }}
            onPress={async () => {
              let sendState: any = {};
              const translateHashMap: any = {
                compensation: (originState: any, hashMap: any) => {
                  const obj = {
                    ...originState["compensation"],
                    value: [hashMap["compensation"]],
                  };
                  return obj;
                },
              };
              const numberAry = ["uint", "int"];
              Object.keys(initState).forEach((key) => {
                sendState[key] = translateHashMap[key]
                  ? translateHashMap[key](initState, updateHashMap)
                  : updateHashMap[key] != undefined
                  ? {
                      ...initState[key],
                      value: numberAry.includes(initState[key]?.type)
                        ? Number(updateHashMap[key])
                        : updateHashMap[key],
                    }
                  : initState[key];
              });
              console.log("发送的数据", sendState);
              await save(sendState);
              toast.success(t("操作成功"));
            }}
          >
            {t("保存")}
          </LoadingButton>
        </div>
        <div className="flex-1">
          <Illustration type="detect" />
        </div>
      </div>
    </>
  );
};

export default memo(PoseDetect);
