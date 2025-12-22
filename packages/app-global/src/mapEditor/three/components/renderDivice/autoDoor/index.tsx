import { Html } from '@react-three/drei'; // 使用 Html 来渲染 SVG
import { useEffect } from 'react';
import { IconifyIcon } from 'ui';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../../../store';

const AutoDoor = () => {
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

    if (selectSubDrawType !== 'autoDoor' || selectDrawType !== 'device') return;
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, [setAutoDoorList, autoDoorList, selectSubDrawType, selectDrawType]);

  return (
    <group>
      {autoDoorList.map((item) => (
        <group key={item.id} position={[item.position.x, item.position.y, 0]}>
          <Html
            center
            style={{
              pointerEvents: 'none', // 确保不干扰 Three.js 事件
              display: 'inline-block',
              cursor: 'pointer',
            }}
          >
            <IconifyIcon icon='material-symbols:doorbell-chime-outline' size={24} />
          </Html>
        </group>
      ))}
    </group>
  );
};

export default AutoDoor;
