import { useMemo } from 'react';

import SingleShelf from './components/singleShelf';
import shelfData from './data';

const Shelf = () => {
  const shelfEl = useMemo(
    () =>
      // eslint-disable-next-line implicit-arrow-linebreak
      shelfData.map((item, index) => (
        <SingleShelf
          floor={item.floor}
          layout={item.layout}
          groupProps={{ position: item.position }}
          key={index}
        ></SingleShelf>
      )),
    [],
  );
  return <>{shelfEl}</>;
};
export default Shelf;
