import { animated, useSpring } from '@react-spring/three';
import { Image } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorViewStore } from '../../../store/view';
const deg2rad = (deg?: number) => ((deg ?? 0) * Math.PI) / 180;

const mapData = [
  {
    img: '/static/floor/map-1.png',
    width: 2571,
    height: 2431,
    name: 'map-1',
    key: 'map-1',
  },
  {
    img: '/static/floor/map-2.png',
    width: 7956,
    height: 5287,
    name: 'map-2',
    key: 'map-2',
  },
];

export function SlamMapFloor({ mapIndex = 0 }: { mapIndex?: number }) {
  const map = mapData[mapIndex];

  const { floorOffset, floorRotation, floorColor } = useMapEditorViewStore(
    useShallow((s) => ({
      floorOffset: s.floorOffset,
      floorRotation: s.floorRotation,
      floorColor: s.floorColor,
    })),
  );
  const size = useMemo<[number, number]>(() => {
    return [map.width / 100, map.height / 100];
  }, [map]);
  /** 位姿动画（完全复用你原来的） */
  const spring = useSpring({
    position: floorOffset ? [floorOffset[0] / 1000, floorOffset[1] / 1000, 0.02] : [0, 0, 0],
    rotationZ: deg2rad(floorRotation),
    config: {
      mass: 1,
      tension: 170,
      friction: 26,
    },
  });
  return (
    <animated.group rotation={spring.rotationZ.to((z) => [0, 0, z])} position={spring.position} name='mapFloor'>
      <Suspense>
        <Image
          url={map.img}
          transparent
          scale={[size[0], size[1]]} // ✅ 用 scale，不是 args
          position={[0, 0, 0.1]} // ✅ 略抬高，避免被 Grid 吃深度
          toneMapped={false} // ✅ 编辑器里非常重要
          color={floorColor}
        />
      </Suspense>
      {/* 辅助元素（可留） */}
      <axesHelper args={[5]} />
    </animated.group>
  );
}
