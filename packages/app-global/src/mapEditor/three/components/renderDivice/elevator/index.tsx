import { useLoader, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { TextureLoader } from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../../../store';
import { THREE_LAYERS } from '../../../../three/constants/threeLayers';

const Elevator = () => {
  const { gl } = useThree();
  const texture = useLoader(TextureLoader, 'assets/three/elevator.png'); // 加载 PNG 图标
  const [hoveredId, setHoveredId] = useState<number | null>(null); // 存储当前悬停的电梯 ID
  const { setElevatorList, elevatorList, selectSubDrawType } = useMapEditorStore(
    useShallow((s) => ({
      setElevatorList: s.setElevatorList,
      elevatorList: s.elevatorList,
      selectSubDrawType: s.selectSubDrawType,
    })),
  );
  const pick = usePickOnXYPlane();

  // 处理点击事件，添加电梯到列表
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const p = pick(e);
      if (!p) return;
      setElevatorList([
        ...elevatorList,
        {
          id: elevatorList?.length + 1,
          position: p.clone(),
        },
      ]);
    };
    if (!gl) return;
    const canvas = gl.domElement;

    if (selectSubDrawType !== 'elevator') return;
    canvas.addEventListener('click', onClick);
    return () => canvas.removeEventListener('click', onClick);
  }, [setElevatorList, elevatorList, selectSubDrawType]);

  return (
    <group>
      {elevatorList.map((item) => (
        <sprite
          key={item.id}
          name={`elevator-${item.id}`}
          layers={THREE_LAYERS.DRAW}
          position={[item.position.x, item.position.y, 0]}
          onPointerOver={() => setHoveredId(item.id)} // 悬停时设置当前悬停的电梯 ID
          onPointerOut={() => setHoveredId(null)} // 鼠标移出时恢复
          onClick={() => {
            console.log('Elevator clicked:', item.id);
            // 在此处你可以修改点击后的行为，比如修改颜色
          }}
        >
          <spriteMaterial
            map={texture}
            attach='material'
            color={hoveredId === item.id ? 'blue' : 'white'} // 当悬停时变色
            // 也可以使用 filter 调整颜色
            // filter={hoveredId === item.id ? 'brightness(1.5)' : 'brightness(1)'}
          />
        </sprite>
      ))}
    </group>
  );
};

export default Elevator;
