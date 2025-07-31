import { memo, useMemo, useEffect } from "react";

import { ThemeProvider, createTheme } from "@mui/material";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import TextUpdateSwitchRow from "../../comp/textUpdateSwitchRow";
import Title from "../../comp/title";
import TextChangeRow from "../../comp/textChangeRow";
import LoadingButton from "../../comp/loadingButton";
import StorageListSelect from "../../comp/storageListSelect";
import { useSetState } from "ahooks";
import { postGoodsStateDetectSave as save } from "../../../../services/index";
import Illustration from "./illustration";

const LightTheme = (props: any) => {
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: "light",
          primary: {
            main: "#00D1D1",
          },
        },
        typography: {
          fontSize: 20,
        },
      })}
    >
      {props.children}
    </ThemeProvider>
  );
};

const Setting = (props: any) => {
  const { propsState } = props;
  const { t } = useTranslation();
  const [updateHashMap, setUpdateHashMap] = useSetState<any>({
    need_detect: false,
    extra_heights: 0,
    need_goods_width_detect: false,
    expect_goods_max_width: 0,
    need_goods_height_detect: false,
    expect_goods_max_height: 0,
    is_goods_on_pallet_detect: false,
    is_sides_over: false,
    is_front_over: false,
    bounds_detect_thresh_left_right: 0,
    bounds_detect_thresh_front: 0,
    ground_transfer_points: [], // 获取库位的数组
  });

  const initState = useMemo(() => {
    return propsState;
  }, [propsState]);

  useEffect(() => {
    // 初始化数据
    if (!Object.keys(propsState).length) return;
    const omitKeys = ["extra_heights"];
    const obj: any = {};
    for (let key in updateHashMap) {
      if (omitKeys.includes(key)) {
        obj["extra_heights"] = propsState?.["extra_heights"]?.value?.[0];
      } else {
        obj[key] = propsState[key]?.value;
      }
    }
    setUpdateHashMap(obj);
  }, [propsState]);
  const changeUpdateHashMap = (key: string, value: any) => {
    setUpdateHashMap({
      [key]: value,
    });
  };

  const handleSave = async () => {
    const sendState: any = {};
    const numberAry = ["uint", "int", "float"];
    Object.keys(propsState).forEach((key) => {
      sendState[key] =
        updateHashMap[key] !== undefined
          ? {
              ...propsState[key],
              value: numberAry.includes(initState[key]?.type)
                ? Number(updateHashMap[key])
                : updateHashMap[key],
            }
          : propsState[key];
    });
    sendState["extra_heights"] = {
      ...propsState["extra_heights"],
      value: [Number(updateHashMap["extra_heights"])],
    };

    console.log(sendState, updateHashMap);
    await save(sendState);
    toast.success(t("操作成功"));
  };

  return (
    <LightTheme>
      <div className="text-black h-full flex gap-[10px]">
        <div className="w-[350px] ">
          <StorageListSelect
            title={t("库位")}
            value={updateHashMap?.["ground_transfer_points"]}
            onChange={(value: any) => {
              console.log(value);
              changeUpdateHashMap("ground_transfer_points", value);
            }}
          ></StorageListSelect>
          <TextChangeRow
            title={t("额外提升叉臂")}
            value={updateHashMap?.["extra_heights"]}
            validateRange={[
              initState?.["extra_heights"]?.min,
              initState?.["extra_heights"]?.max,
            ]}
            onChange={(value: string) => {
              changeUpdateHashMap("extra_heights", value);
            }}
          >
            <div>{updateHashMap?.["extra_heights"] || 0}</div>
          </TextChangeRow>

          {[
            {
              title: t("货物宽度检测"),
              key: "1",
              children: [
                {
                  title: t("是否启用"),
                  key: "need_goods_width_detect",
                  type: "switch",
                },
                {
                  title: t("最大允许货物宽度"),
                  key: "expect_goods_max_width",
                  type: "input",
                  hideKey: "need_goods_width_detect",
                },
              ],
            },
            {
              title: t("货物高度检测"),
              key: "2",
              children: [
                {
                  title: t("是否启用"),
                  key: "need_goods_height_detect",
                  type: "switch",
                },
                {
                  title: t("最大允许货物高度"),
                  key: "expect_goods_max_height",
                  type: "input",
                  hideKey: "need_goods_height_detect",
                },
              ],
            },
            {
              title: t("托盘货物有无检测"),
              key: "3",
              children: [
                {
                  title: t("是否启用"),
                  key: "is_goods_on_pallet_detect",
                  type: "switch",
                },
              ],
            },
            {
              title: t("货物两侧超托检测"),
              key: "4",
              children: [
                {
                  title: t("是否启用"),
                  key: "is_sides_over",
                  type: "switch",
                },
                {
                  title: t("超托阈值"),
                  key: "bounds_detect_thresh_left_right",
                  type: "input",
                  hideKey: "is_sides_over",
                },
              ],
            },
            {
              title: t("货物前方超托检测"),
              key: "5",
              children: [
                {
                  title: t("是否启用"),
                  key: "is_front_over",
                  type: "switch",
                },
                {
                  title: t("超托阈值"),
                  key: "bounds_detect_thresh_front",
                  type: "input",
                  hideKey: "is_front_over",
                },
              ],
            },
          ]?.map((row: any) => {
            return (
              <div key={row.key}>
                <Title>{row.title}</Title>
                {row?.children?.map((item: any) => {
                  return item.type === "switch" ? (
                    <TextUpdateSwitchRow
                      key={item.key}
                      title={item.title}
                      checked={updateHashMap[item.key]}
                      onChange={(checked: boolean) => {
                        changeUpdateHashMap(item.key, checked);
                      }}
                    />
                  ) : item?.hideKey === undefined ||
                    updateHashMap[item.hideKey] ? (
                    <TextChangeRow
                      key={item.key}
                      title={item.title}
                      value={updateHashMap?.[item.key]}
                      validateRange={[
                        initState?.[item.key]?.min,
                        initState?.[item.key]?.max,
                      ]}
                      onChange={(value: string) => {
                        changeUpdateHashMap(item.key, value);
                      }}
                    >
                      <div>{updateHashMap?.[item.key] || 0}</div>
                    </TextChangeRow>
                  ) : null;
                })}
              </div>
            );
          })}

          <LoadingButton
            fullWidth
            variant="contained"
            sx={{ color: "white", marginBottom: "40px" }}
            onPress={handleSave}
          >
            {t("保存")}
          </LoadingButton>
        </div>
        <div className="flex-1">
          <Illustration />
        </div>
      </div>
    </LightTheme>
  );
};

export default memo(Setting);
