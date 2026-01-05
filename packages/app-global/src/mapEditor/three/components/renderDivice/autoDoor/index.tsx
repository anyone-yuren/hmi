import { useLoader, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { TextureLoader } from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../../../store';
import { THREE_LAYERS } from '../../../../three/constants/threeLayers';

const AutoDoor = () => {
  const { gl } = useThree();
  const texture = useLoader(TextureLoader, 'assets/three/autoDoor.png'); // 加载 PNG 图标
  const [hoveredId, setHoveredId] = useState<number | null>(null); // 存储当前悬停的电梯 ID
  const { setAutoDoorList, autoDoorList, selectSubDrawType, selectDrawType } = useMapEditorStore(
    useShallow((s) => ({
      setAutoDoorList: s.setAutoDoorList,
      autoDoorList: s.autoDoorList,
      selectSubDrawType: s.selectSubDrawType,
      selectDrawType: s.selectDrawType,
    })),
  );

  const pick = usePickOnXYPlane();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const p = pick(e);
      if (!p) return;
      setAutoDoorList([
        ...autoDoorList,
        {
          id: autoDoorList?.length + 1,
          position: p.clone(),
        },
      ]);
    };
    if (!gl) return;
    const canvas = gl.domElement;

    if (selectSubDrawType !== 'autoDoor' || selectDrawType !== 'device') return;
    canvas.addEventListener('click', onClick);
    return () => canvas.removeEventListener('click', onClick);
  }, [setAutoDoorList, autoDoorList, selectSubDrawType, selectDrawType]);

  return (
    <group>
      {autoDoorList.map((item) => (
        <sprite
          key={item.id}
          name={`autoDoor-${item.id}`}
          position={[item.position.x, item.position.y, 0]}
          onPointerOver={() => setHoveredId(item.id)} // 悬停时设置当前悬停的电梯 ID
          onPointerOut={() => setHoveredId(null)} // 鼠标移出时恢复
          onClick={() => {
            console.log('Elevator clicked:', item.id);
            // 在此处你可以修改点击后的行为，比如修改颜色
          }}
          layers={THREE_LAYERS.DRAW}
        >
          <spriteMaterial
            map={texture}
            attach='material'
            color={hoveredId === item.id ? '#00d1d1' : 'white'} // 当悬停时变色
            // 也可以使用 filter 调整颜色
            // filter={hoveredId === item.id ? 'brightness(1.5)' : 'brightness(1)'}
          />
        </sprite>
      ))}
    </group>
  );
};

export default AutoDoor;
