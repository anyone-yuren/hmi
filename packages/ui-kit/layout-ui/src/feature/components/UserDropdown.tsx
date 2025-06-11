import {
  PoweroffOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Button, Dropdown, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// import { useMessage } from '@/hooks/web/useMessage';

import { redirectToLogin } from "@gbeata/utils";
import type { MenuProps } from "antd";
export default function UserDropdown({ extraItems = [], onItemClick }: { extraItems?: MenuProps["items"], onItemClick?: (key: string) => void }) {
  // const { createConfirm, contextHolder, createMessage } = useMessage();
  const { t } = useTranslation();

  const items: MenuProps["items"] = [
    // {
    //   key: "lock",
    //   label: (
    //     <Space size={4}>
    //       <LockOutlined rev={undefined} />
    //       <span>{t("锁定屏幕")}</span>
    //     </Space>
    //   ),
    // },
    ...extraItems,
    {
      key: "logout",
      label: (
        <Space size={4}>
          <PoweroffOutlined rev={undefined} />
          <span>{t("common.logout")}</span>
        </Space>
      ),
    },
  ];

  const onClick: MenuProps["onClick"] = ({ key }) => {
    switch (key) {
      case "lock":
        handleLock();
        break;
      case "logout":
        // 如果退出登录，则跳转到登录页,清除token
        handleLayout();
        break;
      default:
        onItemClick?.(key);
        break;
    }
  };

  const navigate = useNavigate();

  const handleLock = () => {};

  const handleLayout = () => {
    redirectToLogin();
  };

  return (
    <>
      <Dropdown menu={{ items, onClick }} placement="bottomRight" arrow>
        <span className="flex-center" style={{ cursor: "pointer" }}>
          {/* <img
            src={""}
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
            }}
            alt=""
          /> */}
          <Button
            shape="circle"
            size="small"
            icon={
              <span className="anticon">
                <UserOutlined />
              </span>
            }
          />
        </span>
      </Dropdown>
    </>
  );
}
