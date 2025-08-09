import { useRequest } from 'ahooks';
import { flatMap } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Group, Line, Text } from 'react-konva';
import { toast } from 'sonner';
import { requestNavigationRegion } from '../../service';

export const NavigationRegion = () => {
  const { t } = useTranslation();

  const naviMapName: any = {
    1: t('deployer.hybrid.reflectors'),
    2: 'SLAM',
    3: '3D SLAM',
    4: t('deployer.hybrid.skyNavigation'),
    5: t('deployer.hybrid.qrCode'),
    6: t('deployer.hybrid.magneticNail'),
  };
  const [naviRegion, setNaviRegion] = useState([]);

  const { run } = useRequest<any, any>(requestNavigationRegion, {
    manual: true,
    onSuccess: (res) => {
      if (res?.error_code == 10000) {
        setNaviRegion(res?.hybird_regions);
      } else {
        toast.error(t('deployer.hybrid.getNavigationFail'));
      }
    },
  });
  useEffect(() => {
    run();
  }, []);
  return (
    <Group name='navigation-region'>
      {naviRegion.map((region: any, index: number) => {
        return (
          <Group key={region.key} name='navigation-region'>
            <Line
              points={flatMap(region.corner_points, (point: any) => [point.x * 20, 0 - point.y * 20])}
              fill='green'
              closed
              opacity={0.2}
            />
            <Text
              text={naviMapName[region.navi_type]}
              fontSize={10}
              fill='green'
              x={region.corner_points[0].x * 20}
              y={0 - region.corner_points[0].y * 20}
            ></Text>
          </Group>
        );
      })}
    </Group>
  );
};
