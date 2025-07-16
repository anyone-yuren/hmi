import { requestNavigationRegion } from "../../service";
import { useRequest } from "ahooks";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Group, Line, Text } from "react-konva";
import { flatMap } from "lodash";
import { toast } from "sonner";

export const NavigationRegion = () => {
  const { t } = useTranslation();

  const naviMapName: any = {
    1: t("反光板"),
    2: t("SLAM"),
    3: t("3D SLAM"),
    4: t("天空导航"),
    5: t("二维码"),
    6: t("磁钉"),
  };
  const [naviRegion, setNaviRegion] = useState([]);

  const { run } = useRequest<any, any>(requestNavigationRegion, {
    manual: true,
    onSuccess: (res) => {
      if (res?.error_code == 10000) {
        setNaviRegion(res?.hybird_regions);
      } else {
        toast.error(t("获取导航区域失败"));
      }
    },
  });
  useEffect(() => {
    run();
  }, []);
  return (
    <Group name="navigation-region">
      {naviRegion.map((region: any, index: number) => {
        return (
          <Group key={region.key} name="navigation-region">
            <Line
              points={flatMap(region.corner_points, (point: any) => [
                point.x * 20,
                0 - point.y * 20,
              ])}
              fill="green"
              closed
              opacity={0.2}
            />
            <Text
              text={naviMapName[region.navi_type]}
              fontSize={10}
              fill="green"
              x={region.corner_points[0].x * 20}
              y={0 - region.corner_points[0].y * 20}
            ></Text>
          </Group>
        );
      })}
    </Group>
  );
};
