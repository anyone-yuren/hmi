import { Html } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import { TextureLoader } from 'three';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../../../store';

const Elevator = () => {
  const texture = useLoader(TextureLoader, 'assets/three/elevator.png');
  const { setElevatorList, elevatorList, selectSubDrawType, selectDrawType } = useMapEditorStore(
    useShallow((s) => {
      return {
        setElevatorList: s.setElevatorList,
        elevatorList: s.elevatorList,
        selectSubDrawType: s.selectSubDrawType,
        selectDrawType: s.selectDrawType,
      };
    }),
  );
  const pick = usePickOnXYPlane();

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

    if (selectSubDrawType !== 'elevator' || selectDrawType !== 'device') return;
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [setElevatorList, elevatorList, selectSubDrawType, selectDrawType]);

  return (
    <group>
      {elevatorList.map((item) => (
        <group key={item.id} position={[item.position.x, item.position.y, 0]}>
          <Html
            center
            style={{
              pointerEvents: 'none', // 确保不干扰 Three.js 事件
              display: 'inline-block',
              cursor: 'pointer',
            }}
          >
            <IconifyIcon icon='material-symbols:elevator' size={24} />
          </Html>
        </group>
      ))}
    </group>
  );
};
export default Elevator;
