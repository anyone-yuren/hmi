import { memo } from "react";
import { Chip } from "@mui/material";
import { useTranslation } from "react-i18next";

const ChipComp = ({ isOnline }: any) => {
  const { t } = useTranslation();
  const title = isOnline ? t("已启用") : t("未启用");
  const color = isOnline ? "success" : "warning";
  return <Chip label={title} color={color} size="small" />;
};

export default memo(ChipComp);
