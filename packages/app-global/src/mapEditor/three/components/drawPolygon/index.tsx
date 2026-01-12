import { useShallow } from 'zustand/react/shallow';
import { DragDrawPolygon } from './components/DragDrawPolygon';
import { PolygonMesh } from './components/PolygonMesh';
import { usePolygonStore } from './store/polygonStore';

export default function RenderPolygon() {
  const { polygons } = usePolygonStore(useShallow((store) => ({ polygons: store.polygons })));
  return (
    <group name='polygons'>
      <DragDrawPolygon />
      {polygons.map((polygon) => (
        <PolygonMesh key={polygon.id} polygon={polygon} />
      ))}
    </group>
  );
}
