import { Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useState } from 'react';
import { Vector3 } from 'three';

import { FLOOR_HEIGHT } from '../utils';

const TextLabel = ({
  edgeId,
  midPoint,
  directionType,
  floor = 0,
  fontSize = 0.1,
  ...rest
}: {
  edgeId: number;
  midPoint?: number[];
  directionType?: number;
  position?: number[];
  rotation?: Vector3;
  fontSize?: number;
  color?: string;
  floor?: number;
}) => {
  const { camera } = useThree();
  // const [visible, setVisible] = useState(camera.position.y < 50);
  const [visible, setVisible] = useState(true);

  // 使用 useMemo 缓存位置
  const position = useMemo(() => {
    return midPoint ? new Vector3(midPoint[0], floor * FLOOR_HEIGHT + 0.01, midPoint[2]) : rest.position;
    // return midPoint ? new Vector3(midPoint[0], 0.01, midPoint[2]) : rest.position;
  }, [midPoint, floor, rest.position]);

  // 使用 useRef 来避免每帧都重新设置 visible
  const prevVisibleRef = useRef(visible);

  // useFrame(() => {
  //   const isVisible = camera.position.y < 50;
  //   if (isVisible !== prevVisibleRef.current) {
  //     setVisible(isVisible);
  //     prevVisibleRef.current = isVisible;
  //   }
  // });

  // useFont.preload('/helvetiker_regular.typeface.json');
  // const font = useFont('/helvetiker_regular.typeface.json');
  // 按需渲染
  console.log('为什么我一开始就加载字体了');
  return visible ? (
    <Suspense fallback={null}>
      {/* <Text3D
        position={new Vector3(100000, 1, 0)}
        material-toneMapped={false}
        fontSize={fontSize}
        color={directionType === 1 ? '#00ff00' : '#a8a8a8'}
        anchorX='center'
        anchorY='middle'
        children={`${edgeId}`}
        size={0.2}
        height={0}
        rotation={[-Math.PI / 2, 0, 0]}
        strokeColor='#000000'
        font='/helvetiker_regular.typeface.json'
        {...rest}
      /> */}
      {/* <Text2 position={position as any} fontSize={100} text={'text'}></Text2> */}
      {true && (
        <Text
          position={position as any}
          material-toneMapped={false}
          fontSize={fontSize}
          color={directionType === 1 ? '#00ff00' : '#a8a8a8'}
          anchorX='center'
          anchorY='middle'
          children={`${edgeId}`}
          size={0.2}
          height={0}
          rotation={[-Math.PI / 2, 0, 0]}
          strokeWidth={0.001}
          strokeColor='#000000'
          // font={font}
          font='./1Ptrg8zYS_SKggPNwK4vaqI.woff'
          // font={'./helvetiker_regular.typeface.json'}
          {...rest}
        />
      )}
    </Suspense>
  ) : null;
};

export default TextLabel;
