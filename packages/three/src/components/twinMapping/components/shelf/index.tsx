import { useMemo, useState } from 'react';

import { useRequest } from 'ahooks';
import { editor } from 'apis';
import SingleShelf from './components/singleShelf';
import { shelfData } from './data';

const Shelf = () => {
  const shelfDataFilter = shelfData
    .filter((item) => item.layer !== 1)
    .map((item) => {
      const { maxX, maxY, minX, minY } = item;
      // 计算中心点
      const centerX = (maxX + minX) / 2;
      const centerY = (maxY + minY) / 2;
      const centerZ = 0; // 假设 Z 轴为 0
      return {
        floor: 1,
        position: { x: centerX, y: centerZ, z: centerY },
        layout: {
          col: item.row,
          layer: item.layer - 1,
        },
      };
    });
  const [shelfData1, setShelfData] = useState<any>(shelfDataFilter);
  console.log(shelfDataFilter, 'shelfData1');

  const { runAsync: getShelves } = useRequest(editor.getShelfData, {
    refreshDeps: [],
    manual: true,
    onSuccess: (res) => {
      if (res && res.length) {
        res
          .filter((item) => item.layer !== 1)
          .forEach((item) => {
            const { maxX, maxY, minX, minY } = item;
            // 计算中心点
            const centerX = (maxX + minX) / 2;
            const centerY = (maxY + minY) / 2;
            const centerZ = 0; // 假设 Z 轴为 0

            // setShelfData((prev) => [
            //   ...prev,
            //   {
            //     floor: 1,
            //     position: { x: centerX, y: centerZ, z: centerY },
            //     layout: {
            //       col: item.row,
            //       layer: item.layer - 1,
            //     },
            //   },
            // ]);
          });
      }
    },
  });
  // useEffect(() => {
  //   getShelves();
  // }, []);
  const shelfEl = useMemo(
    () =>
      // eslint-disable-next-line implicit-arrow-linebreak
      shelfData1?.map((item, index) => (
        <SingleShelf
          floor={item.floor}
          layout={item.layout}
          groupProps={{ position: item.position }}
          key={index}
        ></SingleShelf>
      )),
    [shelfData1],
  );
  return <>{shelfEl}</>;
};
export default Shelf;
