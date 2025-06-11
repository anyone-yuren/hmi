import { GlobalOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";
import { useTranslation } from "react-i18next";

import type { MenuProps } from "antd";
import { setLanguage } from "gbeata";

const Selectlangulage = () => {
  const { i18n } = useTranslation();
  const languages: MenuProps["items"] = [
    {
      key: "zh_CN",
      label: "中文",
    },
    {
      key: "en_US",
      label: "English",
    },
    {
      key: "ja_JP",
      label: "日本語",
    },
    {
      key: "ko_KR",
      label: "한국어",
    },
    {
      key: "fr_FR",
      label: "Français",
    },
  ];
  return (
    <Dropdown
      menu={{
        items: languages,
        onClick: ({ key }) => {
          i18n.changeLanguage(key);
          setLanguage(key);
        },
      }}
      trigger={["click"]}
    >
      <Button
        shape="circle"
        size="small"
        icon={
          <span className="anticon">
            <GlobalOutlined />
          </span>
        }
      />
    </Dropdown>
  );
};

export default Selectlangulage;
