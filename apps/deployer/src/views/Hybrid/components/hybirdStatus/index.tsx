import {
  Card,
  Divider,
  ListItemText,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import { useHybirdStore } from "../../store/hybird.store";
import { Icon } from "@iconify/react";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
const HybirdStatus = () => {
  const { t } = useTranslation();
  const navigationTypes = {
    1: t("反光板"),
    2: t("SLAM"),
    5: t("二维码"),
  };
  const naviStatus = {
    0: t("正常"),
    1: t("定位丢失"),
  };
  const systemStatus = {
    0: t("空闲"),
    1: t("slam建图"),
    2: t("slam 扩展地图"),
    3: t("slam 修改地图"),
    4: t("slam 校正地图"),
    5: t("反光板 建图"),
    6: t("反光板 扩展地图"),
    7: t("反光板 修改地图"),
  };
  const { robot_current_status } = useHybirdStore(
    useShallow((state) => ({
      robot_current_status: state.robot_current_status,
    }))
  );

  const {
    navigation_type,
    navi_status,
    system_status,
    floor_number,
  }: {
    navigation_type: number;
    navi_status: number;
    system_status: number;
    floor_number: number;
  } = robot_current_status || {};
  return (
    // <div className="flex w-full flex-col text-sm gap-2">
    //   <div>
    //     类型：
    //     {navigationTypes[navigation_type] || "未知"}
    //   </div>
    //   <Divider orientation="horizontal" color="#00B9B9" />
    //   <div className="flex items-center gap-2">
    //     状态:
    //     <Typography
    //       variant="body2"
    //       className="!m-0"
    //       gutterBottom
    //       color={navi_status === 0 ? "primary" : "error"}
    //     >
    //       {naviStatus[navi_status] || ""}
    //     </Typography>
    //   </div>
    //   <Divider orientation="horizontal" color="rgba(0, 0, 0, 0.12)" />
    //   <div
    //     className="flex items-center gap-1"
    //     onClick={() => setShowFloor(true)}
    //   >
    //     <span>定位楼层: {floor_number || ""}</span>
    //   </div>
    //   <Divider orientation="horizontal" color="rgba(0, 0, 0, 0.12)" />
    //   <div>操作状态：{systemStatus[system_status]}</div>
    //   <Divider orientation="horizontal" color="rgba(0, 0, 0, 0.12)" />
    // </div>
    <MenuList className="w-full">
      <MenuItem sx={{ padding: "4px" }}>
        <ListItemText
          disableTypography
          sx={{ color: "text.primary", fontSize: "14px", fontWeight: "bold" }}
        >
          {t("导航模式")}
        </ListItemText>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: "bold" }}
        >
          {navigationTypes[navigation_type] || t("未知")}
        </Typography>
      </MenuItem>
      <MenuItem sx={{ padding: "8px" }}>
        <ListItemText
          disableTypography
          sx={{ color: "text.primary", fontSize: "14px", fontWeight: "bold" }}
        >
          {t("状态")}
        </ListItemText>
        <Typography
          variant="body2"
          color={navi_status === 0 ? "primary" : "error"}
          sx={{ fontWeight: "bold" }}
        >
          {system_status !== 0 ? t("建图中") : naviStatus[navi_status]}
        </Typography>
      </MenuItem>
      <MenuItem sx={{ padding: "8px" }}>
        <ListItemText
          disableTypography
          sx={{ color: "text.primary", fontSize: "14px", fontWeight: "bold" }}
        >
          {t("当前楼层")}
        </ListItemText>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: "bold" }}
        >
          {floor_number || ""}
        </Typography>
      </MenuItem>
      {/* <MenuItem sx={{ padding: "8px" }}>
        <ListItemText
          disableTypography
          sx={{ color: "text.primary", fontSize: "14px" }}
        >
          操作状态
        </ListItemText>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {systemStatus[system_status]}
        </Typography>
      </MenuItem> */}
      <Divider />
    </MenuList>
  );
};
export default HybirdStatus;
