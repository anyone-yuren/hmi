import { useRcs2DGlobalStore } from '@gbeata/store';
import { Input, Select } from 'antd';
import { v1MapFindMapDataAsync } from 'apis';
import { useMemo, useState } from 'react';
import { Vector3 } from 'three';
import { useShallow } from 'zustand/react/shallow';

import { useTranslation } from 'react-i18next';
import useMapData from '../../hooks/useMapData';
import { convertToMeters } from '../../utils';

const SelectArea = () => {
  const [type, setType] = useState<'point' | 'line' | 'vehicle'>('point');
  const { getReferencePointPosition } = useMapData();
  const { activeFloor, setMoveToPosition, setActiveLines, setSelectStorage } = useRcs2DGlobalStore(
    useShallow((state) => ({
      activeFloor: state.activeFloor,
      setMoveToPosition: state.setMoveToPosition,
      setActiveLines: state.setActiveLines,
      setSelectStorage: state.setSelectStorage,
    })),
  );
  const { t } = useTranslation();
  const isTotalMap = useMemo(() => {
    return activeFloor === -1;
  }, [activeFloor]);

  // 代码有点重合,得整一个
  const handleSearch = async (value: any) => {
    const functionHashMap = {
      point: async (id) => {
        const params = {
          routeKey: Number(id),
          type: 1,
        };
        const response = await v1MapFindMapDataAsync(params);
        if (isTotalMap) {
          setMoveToPosition({ x: response.x / 1000, y: 20, z: -response.y / 1000 });
          setSelectStorage([Number(id)]);
          return;
        }
        // 分层的地图需要根据基准点获得当前楼层的坐标
        const SpacingCoordinates = getReferencePointPosition(response.floor);
        const position = new Vector3(
          convertToMeters(response.x - SpacingCoordinates.x),
          0.5,
          convertToMeters(0 - response.y - SpacingCoordinates.y),
        );
        setMoveToPosition({ x: position.x, y: 20, z: position.z });
        setSelectStorage([Number(id)]);
      },
      line: async (id) => {
        const params = {
          routeKey: Number(id),
          type: 2,
        };
        const response = await v1MapFindMapDataAsync(params);
        if (!response?.controlPoint.length) return;
        const index = Math.floor(response.controlPoint.length / 2);
        const point = response?.controlPoint?.[index];
        setActiveLines([response]);
        if (isTotalMap) {
          setMoveToPosition({ x: point.x / 1000, y: 20, z: -point.y / 1000 });
          return;
        }
        const SpacingCoordinates = getReferencePointPosition(response.floor);
        const position = new Vector3(
          convertToMeters(point.x - SpacingCoordinates.x),
          0.5,
          convertToMeters(0 - point.y - SpacingCoordinates.y),
        );
        setMoveToPosition({ x: position.x, y: 20, z: position.z });
      },
      vehicle: async (id) => {
        console.log('车辆ID', id);
      },
    };
    functionHashMap[type] && (await functionHashMap[type](value));
  };
  return (
    <Input.Search
      addonBefore={
        <Select
          value={type}
          onChange={(e) => {
            setType(e);
          }}
          style={{ width: 80 }}
        >
          <option value={'point'}>{t('点')}</option>
          <option value={'line'}>{t('线')}</option>
          <option value={'vehicle'}>{'AGV'}</option>
        </Select>
      }
      style={{ width: 250, background: 'black' }}
      onSearch={handleSearch}
    ></Input.Search>
  );
};

export default SelectArea;
