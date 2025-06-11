import { useRcs2DGlobalStore } from '@gbeata/store';
import { Icon } from '@iconify/react';
import { Button, Tooltip } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
const InitLocation = (props: any) => {
  const { referencePoints } = props;

  const { cameraControls } = useRcs2DGlobalStore(
    useShallow((state) => ({
      cameraControls: state.cameraControls,
    })),
  );
  const { t } = useTranslation();
  // 只要一层的基准点
  const reference = useMemo(() => {
    if (referencePoints && referencePoints.length > 0) {
      return referencePoints.find((item: any) => item.layer === 1);
    }
    return null;
  }, [referencePoints]);

  const lookPosition = useMemo(() => {
    if (reference) {
      return reference.referencePoint;
    }
  }, [reference]);

  return (
    <Tooltip placement='top' title={t('初始化定位')}>
      <Button
        icon={<Icon className='text-[21px]' icon='ic:sharp-my-location'></Icon>}
        onClick={() => {
          // cameraControls?.setLookAt(
          //   lookPosition.x / 1000,
          //   100,
          //   0 - lookPosition.y / 1000,
          //   lookPosition.x / 1000,
          //   0,
          //   0 - lookPosition.y / 1000,
          //   true,
          // );
        }}
      />
    </Tooltip>
  );
};

export default InitLocation;
