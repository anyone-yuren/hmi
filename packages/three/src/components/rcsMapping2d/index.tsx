import { useRcs2DGlobalStore } from '@gbeata/store';
import { useRequest } from 'ahooks';
import { v1MapGetMapDataCreate } from 'apis';
import { useShallow } from 'zustand/react/shallow';

import HeaderActionBar from './components/headerActionBar';
import MapCanvas from './components/MapCanvas';

interface IProps {
  vehiclesList?: any[];
  panelSwitchCb?: (show: boolean) => void; // 点击切换面板
}
const MapVisualization = (props: IProps) => {
  const { setReferencePoints } = useRcs2DGlobalStore(
    useShallow((state) => ({
      setReferencePoints: state.setReferencePoints,
    })),
  );
  const { data: mappingData } = useRequest(v1MapGetMapDataCreate, {
    onSuccess: (res) => {
      setReferencePoints(res?.referencePoints || []);
    },
  });

  // 过滤全部所有的楼层数据
  // const filterMappingData = useMemo(() => {
  //   console.log(activeFloor, mappingData);
  //   if (!mappingData || !Object.keys(mappingData).length) return undefined;
  //   const omitKeys = ['mapOption', 'referencePoints'];
  //   const obj = {};
  //   for (let key in mappingData) {
  //     if (omitKeys.includes(key)) {
  //       obj[key] = mappingData[key];
  //     } else {
  //       obj[key] = mappingData[key].filter((item: any) => item.floor === activeFloor);
  //     }
  //   }
  //   return obj;
  // }, [activeFloor, mappingData]);

  // useEffect(() => {
  //   console.log(filterMappingData);
  // }, [filterMappingData]);

  // 如果没有数据，渲染占位符

  return mappingData ? (
    <>
      <HeaderActionBar mappingData={mappingData} panelSwitchCb={props?.panelSwitchCb}></HeaderActionBar>
      <MapCanvas mappingData={mappingData} />
    </>
  ) : (
    <>loading</>
  );
};

export default MapVisualization;
