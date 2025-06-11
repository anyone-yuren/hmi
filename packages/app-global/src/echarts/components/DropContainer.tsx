import { useDrop } from 'ahooks';
import { useRef } from 'react';
const DropContainer = (props: any) => {
  const ref = useRef<HTMLDivElement>(null);
  useDrop(ref, {
    onDom: (content: string, e) => {
      props.onDrop && props.onDrop(content);
    },
    onDragEnter: () => {
      console.log('onDragEnter');
    },
    onDragLeave: () => {
      console.log('onDragLeave');
    },
  });
  return (
    <div className='w-full h-full' ref={ref}>
      {props.children}
    </div>
  );
};

export default DropContainer;
