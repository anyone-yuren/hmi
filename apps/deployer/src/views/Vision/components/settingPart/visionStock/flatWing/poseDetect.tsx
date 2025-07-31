import React, { memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSetState } from "ahooks";
import { toast } from "sonner";

import Title from "../../comp/title";
import TextChangeRow from "../../comp/textChangeRow";
import TextUpdateSwitchRow from "../../comp/textUpdateSwitchRow";
import PointCloudFilter from "../../comp/pointCloudFilter";
import LoadingButton from "../../comp/loadingButton";
import StorageListSelect from "../../comp/storageListSelect";
import { postFlatPlacePalletPositionDetectSave as save } from "../../../../services/index";
import Illustration from "./illustration";
interface IProps {
  initState: any;
}
// 堆叠放货 - 姿态识别
const PoseDetect = (props: IProps) => {
  const { initState } = props;
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    auto_para_tuning: true, // 自动调参
    need_detect: true, // 是否启用
    goods_width: 0, // 货物宽度
    goods_gap: [0, 0], //货物前后间距，左右间距
    extra_height: 0, // 额外抬升叉臂高度
    compensation: {
      left: [0, 0, 0, 0], // 左右补偿 高度补偿 前后补偿  角度补偿
      right: [0, 0, 0, 0], // 左右补偿 高度补偿 前后补偿  角度补偿
    },
    scene_storage: [], // 场景库位列表
  });
  const { t } = useTranslation();

  useEffect(() => {
    // 将参数转化为useState里面去
    if (!initState || !Object.keys(initState).length) return;
    const tempHashMap = { ...updateHashMap };
    const translateHashMap: any = {
      compensation: (originState: any) => {
        return {
          left: originState?.["compensation"]?.["left"]?.value?.[0],
          right: originState?.["compensation"]?.["right"]?.value?.[0],
        };
      },
    };
    Object.keys(initState).forEach((key: string) => {
      if (tempHashMap[key] != undefined) {
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
            key={"place_pose_detect"}
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

          {/* 点云选择 */}
          <PointCloudFilter
            type={"truck_pallet_position_detect"}
          ></PointCloudFilter>

          <TextChangeRow
            title={t("货物宽度")}
            value={updateHashMap?.["goods_width"]}
            onChange={(value: string) => {
              changeUpdateHashMap("goods_width", value);
            }}
          >
            <div>{updateHashMap?.["goods_width"] || 0}</div>
          </TextChangeRow>

          {[
            { title: t("货物左右间隙"), index: 1 },
            { title: t("货物前后间隙"), index: 0 },
          ].map((item: any) => {
            const val = updateHashMap?.["goods_gap"]?.[item.index];
            return (
              <TextChangeRow
                key={item.title}
                title={item.title}
                value={val}
                onChange={(value) => {
                  const val = updateHashMap?.["goods_gap"];
                  val[item.index] = Number(value);
                  setUpdateHashMap({
                    ...updateHashMap,
                    goods_gap: val,
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
              initState?.["extra_height"].min,
              initState?.["extra_height"].max,
            ]}
            onChange={(value: string) => {
              changeUpdateHashMap("extra_height", value);
            }}
          >
            <div>{updateHashMap?.["extra_height"] || 0}</div>
          </TextChangeRow>

          {/* 姿态识别没有K车,只要前后 */}
          {[
            {
              title: t("左侧补偿参数"),
              key: "left",
              children: [
                { title: t("左右补偿"), index: 0 },
                { title: t("高度补偿"), index: 1 },
                { title: t("前后补偿"), index: 2 },
                { title: t("角度补偿"), index: 3 },
              ],
            },
            {
              title: t("右侧补偿参数"),
              key: "right",
              children: [
                { title: t("左右补偿"), index: 0 },
                { title: t("高度补偿"), index: 1 },
                { title: t("前后补偿"), index: 2 },
                { title: t("角度补偿"), index: 3 },
              ],
            },
          ]?.map((row) => {
            return (
              <div key={row.key}>
                <Title>{row.title}</Title>
                {row.children.map((item: any) => {
                  const val =
                    updateHashMap?.["compensation"]?.[row.key]?.[item.index] ||
                    0;
                  return (
                    <TextChangeRow
                      key={item.title}
                      title={item.title}
                      value={val}
                      validateRange={[
                        initState?.["compensation"]?.[row.key]?.min,
                        initState?.["compensation"]?.[row.key]?.max,
                      ]}
                      onChange={(value) => {
                        const val = updateHashMap?.["compensation"]?.[row.key];
                        val[item.index] = Number(value);
                        setUpdateHashMap({
                          ...updateHashMap,
                          compensation: {
                            ...updateHashMap?.["compensation"],
                            [row.key]: val,
                          },
                        });
                      }}
                    >
                      <div>{val || 0}</div>
                    </TextChangeRow>
                  );
                })}
              </div>
            );
          })}

          <LoadingButton
            fullWidth
            variant="contained"
            sx={{ color: "white", marginBottom: "40px" }}
            onPress={async () => {
              let sendState: any = {};
              const translateHashMap: any = {
                compensation: (originState: any) => {
                  const obj = {
                    ...originState["compensation"],
                    left: {
                      ...originState["compensation"]["left"],
                      value: [updateHashMap["compensation"]["left"]],
                    },
                    right: {
                      ...originState["compensation"]["right"],
                      value: [updateHashMap["compensation"]["right"]],
                    },
                  };
                  return obj;
                },
              };
              const numberAry = ["uint", "int", "float"];
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
