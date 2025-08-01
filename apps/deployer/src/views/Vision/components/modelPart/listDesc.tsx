import { Typography } from "@mui/material";
import { memo, forwardRef, useMemo } from "react";
import { useTranslation } from "react-i18next";

const ListDesc = forwardRef((props: any, ref: any) => {
  const container = props;
  const { t } = useTranslation();
  const maxLegsHeight = useMemo(() => {
    if (!container?.legs?.length) return 0;
    return (
      Math?.max(
        ...container?.legs?.map((item: any) => {
          return item.height;
        })
      ) || 0
    );
  }, [container]);
  const maxHandlesHeight = useMemo(() => {
    if (!container?.handles?.length) return 0;
    return (
      Math?.max(
        ...container?.handles?.map((item: any) => {
          return item.height;
        })
      ) || 0
    );
  }, [container]);
  return (
    <div className="flex-1 min-h-[100px] overflow-overflow">
      <Typography variant="h6" component="div">
        {container.name}
      </Typography>
      <div className="flex flex-col">
        {container?.diameter && container?.height && (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {t("直径")}/{t("高")}: {container?.diameter}/{container?.height}
          </Typography>
        )}
        {container?.maxDiameter && container?.minDiameter && (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {t("外直径")}/{t("内直径")}: {container?.maxDiameter}/
            {container?.minDiameter}
          </Typography>
        )}
        {container?.width && container?.height && (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {t("宽")}/{t("高")}: {container?.width}/
            {container?.height + maxLegsHeight + maxHandlesHeight}
          </Typography>
        )}
        {container?.legs?.length && (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {t("支腿宽度")}:
            {container?.legs
              ?.map((leg: any) => {
                return leg?.width ?? leg?.topWidth ?? "-";
              })
              .join("/") ?? null}
          </Typography>
        )}
        {container?.legForkInWidth?.length ? (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {t("进叉宽度")}:{" "}
            {container?.legForkInWidth
              ?.map((leg: any) => {
                return leg?.width;
              })
              .join("/")}
          </Typography>
        ) : null}
        {container?.goods_nums && (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {t("货物个数")}: {container?.goods_nums}
          </Typography>
        )}
        {container?.goods_width && (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {t("货物宽度")}: {container?.goods_width}
          </Typography>
        )}
        {container?.storage_width && (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {t("货架宽度")}: {container?.storage_width}
          </Typography>
        )}
        {container?.goods_cols && (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {t("货物列数")}: {container?.goods_cols}
          </Typography>
        )}
        {container?.truck_size && (
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {t("车厢长/宽/高")}: {container?.truck_size?.length}/
            {container?.truck_size?.width}/{container?.truck_size?.height}
          </Typography>
        )}
        {/* <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          {t("额外深度补偿")}: {container?.extra_deep_compensation}
        </Typography>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          {t("目标库位号")}: {container?.storage_list?.join(",") || "-"}
        </Typography> */}
      </div>
    </div>
  );
});

export default memo(ListDesc);
