import { Space } from "antd";

import Notification from "../components/notification";
import {
  // SlideTheme,
  AppStore,
  // GithubLink,
  Selectlangulage,
  Settings,
  UserDropdown,
} from "./components";

export default function LayoutFeature() {
  return (
    <Space size={"middle"}>
      <AppStore />
      <Selectlangulage />
      {/* <DocLink />
      <GithubLink /> */}
      <Notification />
      <Settings />
      <UserDropdown />
    </Space>
  );
}
