import agv from '@/assets/agv.svg';
import { useHybirdStore } from '@/views/Hybrid/store/hybird.store';
import * as React from 'react';
import { Image as KonvaImage } from 'react-konva';
import { useShallow } from 'zustand/react/shallow';
import NewAgv from './newAgv';
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
    image.src = agv;
    image.onload = () => setImageObj(image);
  }, []);

  return (
    <>
      {true && (
        <NewAgv
          rotation={-(agvPosition?.angel * 180) / Math.PI - 270}
          x={agvPosition?.x / 50}
          y={-agvPosition?.y / 50}
          offsetX={10}
          offsetY={10}
          stroke='#00d1d1'
        ></NewAgv>
      )}
      {false && imageObj && (
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
