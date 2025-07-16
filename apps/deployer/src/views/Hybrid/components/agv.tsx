import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import * as React from 'react';
import { Image as KonvaImage } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';

const Agv = (props: any) => {
  const { floor } = props;

  const [imageObj, setImageObj] = React.useState<HTMLImageElement | undefined>(undefined);

  const { agvPosition } = useHybirdStore(
    useShallow((store) => ({
      agvPosition: store.agvPosition,
    })),
  );

  const carRef = React.useRef(null);

  React.useEffect(() => {
    const image = new Image();
    image.src = './assets/agv.svg';
    image.onload = () => setImageObj(image);
  }, []);

  return (
    <>
      {imageObj && (
        <KonvaImage
          ref={carRef}
          image={imageObj}
          rotation={-(agvPosition?.angel * 180) / Math.PI - 90}
          x={agvPosition?.x / 50}
          y={-agvPosition?.y / 50}
          offsetX={46 / 2}
          offsetY={25}
        ></KonvaImage>
      )}
    </>
  );
};

export default React.memo(Agv);
