import { SvgIcon } from "ui";

import { useGlobalSettingActions, useGlobalSettings } from "@gbeata/store";

import useStyles from "./index.module.style";

export default function FoldTrigger() {
  const { styles, cx } = useStyles();
  const settings = useGlobalSettings();
  // 小知识，大智慧~
  const { themeLayout } = settings;
  const { setSettings } = useGlobalSettingActions();

  function toggledMenuFold() {
    setSettings({ ...settings, unfold: !settings.unfold });
  }

  return (
    <span
      className={cx(styles["compo_fold-trigger"], {
        [styles.unfold]: !settings.unfold,
      })}
      onClick={toggledMenuFold}
    >
      <SvgIcon name="unfold" size={20} />
    </span>
  );
}
