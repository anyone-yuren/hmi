import { useDrag } from 'ahooks';
import { useRef } from 'react';

const DragItem = (props: any) => {
  const key = props.itemKey;
  const ref = useRef(null);
  useDrag(key, ref, {
    onDragStart: () => {
      console.log('onDragStart', ref);
    },
    onDragEnd: () => {
      console.log('onDragEnd');
    },
  });
  return <div ref={ref}>{props.children}</div>;
};

export default DragItem;
