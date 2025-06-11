import { AppstoreOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { useTranslation } from "react-i18next";
import dashboardImg from "../../assets/image/illustration-dashboard.webp";
import useStyles from "./styles";
const AppStore = () => {
  const { styles } = useStyles();
  const { t } = useTranslation();
  return (
    <div>
      <Popover
        classNames={{
          root: styles.popover,
          body: styles.popoverBody,
        }}
        getPopupContainer={(node) => node?.parentNode}
        placement="bottom"
        content={
          <div className="flex flex-row justify-between p-2">
            <div className="flex-1 flex text-left ">
              <div className="flex-1">
                <h4 className="text-sm font-bold">
                  {t("global.appstore.system")}
                </h4>
                <ul className={styles.list}>
                  <li>
                    <a href="/rcs-web/" target="_blank">
                      {t("global.appstore.rcs")}
                    </a>
                  </li>
                  <li>
                    <a href="/wcs-web/" target="_blank">
                      {t("global.appstore.wcs")}
                    </a>
                  </li>
                  <li>
                    <a href="/wms-pc/" target="_blank">
                      {t("global.appstore.wms")}
                    </a>
                  </li>
                  {/* <li>
                    <a href="/wms-pc/" target="_blank">
                      3D可视化大屏
                    </a>
                  </li> */}
                  <li>
                    <a href="/wms-pad/" target="_blank">
                      {t("global.appstore.wmsPad")}
                    </a>
                  </li>
                  <li>
                    <a href="/wms-pda/" target="_blank">
                      {t("global.appstore.wmsPda")}
                    </a>
                  </li>
                  <li>
                    <a href="/#/device" target="_blank">
                      {t("global.appstore.device")}
                    </a>
                  </li>
                  <li>
                    <a href="/#/logs/service" target="_blank">
                      {t("global.appstore.logs")}
                    </a>
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">
                  {t("global.appstore.entry")}
                </p>
                <ul className={styles.list}>
                  <li>
                    <a href="/rcs-web/#/home" target="_blank">
                      {t("global.appstore.rcsDataEntry")}
                    </a>
                  </li>
                  <li>
                    <a href="/wms-pad/#/home" target="_blank">
                      {t("global.appstore.wmsTaskEntry")}
                    </a>
                  </li>
                  <li>
                    <a
                      href="/rcs-web/#/configuration/slotBinder"
                      target="_blank"
                    >
                      {t("global.appstore.slotBinder")}
                    </a>
                  </li>
                  <li>
                    <a href="/rcs-web/#/vehicle/configuration" target="_blank">
                      {t("global.appstore.vehicle")}
                    </a>
                  </li>
                  <li>
                    <a href="/wms-pc/#/task" target="_blank">
                      {t("global.appstore.wmsTask")}
                    </a>
                  </li>
                  <li>
                    <a href="/rcs-web/#/task" target="_blank">
                      {t("global.appstore.rcsTask")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <h4 className="text-sm font-bold">
                  {t("global.appstore.dashboard")}
                </h4>
              </div>
              <div
                className={styles.imgBg}
                onClick={() => window.open("/", "_blank")}
              >
                <img src={dashboardImg} alt="" className="h-[360px]" />
              </div>
            </div>
          </div>
        }
        trigger="click"
        overlayInnerStyle={{ width: "100%" }}
      >
        <Button shape="circle" size="small" icon={<AppstoreOutlined />} />
      </Popover>
    </div>
  );
};
export default AppStore;
