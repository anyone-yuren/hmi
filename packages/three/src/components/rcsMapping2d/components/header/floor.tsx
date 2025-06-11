import { useRcs2DGlobalStore } from '@gbeata/store';
import { Select } from 'antd';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
const Floor = (props: any) => {
  const { referencePoints } = props;
  const { setActiveFloor, activeFloor } = useRcs2DGlobalStore(
    useShallow((state) => ({
      setActiveFloor: state.setActiveFloor,
      activeFloor: state.activeFloor,
    })),
  );
  const { t, i18n } = useTranslation();
  const floorOptions = useMemo(() => {
    const ary = referencePoints?.map((item: any) => {
      return {
        label: `${item.layer}${t('层')}`,
        value: item.layer,
      };
    });
    const reset = [{ label: t('总览'), value: -1 }];
    return [...reset, ...ary];
  }, [referencePoints, i18n.language]);

  return (
    <Select
      className='w-[100px]'
      placeholder={t('选择楼层')}
      value={activeFloor}
      options={floorOptions}
      onChange={(value: any) => {
        console.log(value);
        setActiveFloor(value);
      }}
    />
  );
};

export default memo(Floor);
