import { useShallow } from 'zustand/react/shallow';
import { AreaMesh } from './components/AreaMesh';
import { DragDrawArea } from './components/DragDrawArea';
import { useAreaStore } from './store/areaStore';

export default function RenderMesh() {
  const { areas } = useAreaStore(useShallow((store) => ({ areas: store.areas })));
  return (
    <group name='areas'>
      <DragDrawArea />
      {areas.map((area) => (
        <AreaMesh key={area.id} area={area} />
      ))}
    </group>
  );
}
