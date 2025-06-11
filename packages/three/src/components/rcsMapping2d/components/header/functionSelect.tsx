import { useRcs2DGlobalStore } from '@gbeata/store';
import { Select, Tooltip } from 'antd';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
const FunctionSelect = (props: any) => {
  const { mapFunctionKeys, setMapFunctionKeys } = useRcs2DGlobalStore(
    useShallow((state) => ({
      mapFunctionKeys: state.mapFunctionKeys,
      setMapFunctionKeys: state.setMapFunctionKeys,
    })),
  );
  const { t, i18n } = useTranslation();
  const mapFunctionOptions = useMemo(() => {
    return [
      { label: t('库位'), value: 'storage_points', key: 'storage_points' },
      { label: t('点位'), value: 'common_points', key: 'common_points' },
      { label: t('线'), value: 'lines', key: 'line' },
    ];
  }, [i18n.language]);
  return (
    <Select
      allowClear
      showSearch
      mode='multiple'
      options={mapFunctionOptions}
      className='w-[200px]'
      maxTagCount='responsive'
      value={mapFunctionKeys}
      onChange={(value) => {
        setMapFunctionKeys(value);
      }}
      maxTagPlaceholder={(omittedValues) => (
        <Tooltip
          styles={{ root: { pointerEvents: 'none' } }}
          title={omittedValues.map(({ label }) => label).join(', ')}
        >
          <span>{t('查看更多')}</span>
        </Tooltip>
      )}
    ></Select>
  );
};

export default memo(FunctionSelect);
