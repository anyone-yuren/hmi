import { ThreeEvent, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorMenuStore } from '../../../store/mapMenuStore';
import { useStorageLocationStore } from './store/storageLocationStore';

const LocationSprite = ({
  id,
  position,
  selected,
  name,
  onContextMenu,
  onClick,
}: {
  id: string;
  position: THREE.Vector3;
  selected: boolean;
  name: string;
  onContextMenu: (e: ThreeEvent<MouseEvent>) => void;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fillStyle = selected ? '#3b82f6' : '#14b8a6'; // blue-500 or teal-500
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Text "L"
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('L', 64, 64);

    return new THREE.CanvasTexture(canvas);
  }, [selected]);

  return (
    <sprite
      position={position}
      scale={[0.5, 0.5, 1]}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <spriteMaterial
        map={texture}
        depthTest={false}
        transparent
        toneMapped={false}
      />
    </sprite>
  );
};

export default function DrawStorageLocation() {
  const { controls } = useThree();

  const {
    mode,
    storageLocations,
    addStorageLocation,
    select,
    selectedIds,
    setContextMenuPosition,
  } = useStorageLocationStore(
    useShallow((state) => ({
      mode: state.mode,
      storageLocations: state.storageLocations,
      addStorageLocation: state.addStorageLocation,
      select: state.select,
      selectedIds: state.selectedIds,
      setContextMenuPosition: state.setContextMenuPosition,
    })),
  );

  const { showContextMenu, selectObject } = useMapEditorMenuStore(
    useShallow((state) => ({
      showContextMenu: state.showContextMenu,
      selectObject: state.selectObject,
    })),
  );

  const isDragging = useRef(false);
  const hasCameraMoved = useRef(false);

  useEffect(() => {
    if (!controls) return;

    const onStart = () => {
      hasCameraMoved.current = false;
    };
    const onChange = () => {
      hasCameraMoved.current = true;
    };
    const onEnd = () => {
      isDragging.current = hasCameraMoved.current;
      // Reset after a frame to allow click events to check the flag
      requestAnimationFrame(() => {
        isDragging.current = false;
        hasCameraMoved.current = false;
      });
    };

    controls.addEventListener('start', onStart);
    controls.addEventListener('change', onChange);
    controls.addEventListener('end', onEnd);

    return () => {
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('change', onChange);
      controls.removeEventListener('end', onEnd);
    };
  }, [controls]);

  return (
    <group>
      {/* Background plane for catching clicks when in draw mode */}
      {mode === 'draw-storage-location' && (
        <mesh
          position={[0, 0, 0]}
          onClick={(e) => {
            if (isDragging.current) return;
            e.stopPropagation();
            const { point } = e;
            const newLocation = {
              id: `SL${Date.now()}`,
              position: { x: point.x, y: point.y, z: 0 },
              name: `库位 ${storageLocations.length + 1}`,
              type: 'storage' as const,
            };
            addStorageLocation(newLocation);
          }}
        >
          <planeGeometry args={[10000, 10000]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}

      {storageLocations.map((loc) => (
        <LocationSprite
          key={loc.id}
          id={loc.id}
          position={
            new THREE.Vector3(loc.position.x, loc.position.y, loc.position.z)
          }
          selected={selectedIds.includes(loc.id)}
          name={loc.name}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            if (isDragging.current) return;
            e.stopPropagation(); // Stop click from propagating to background
            select([loc.id]);
          }}
          onContextMenu={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            select([loc.id]);
            setContextMenuPosition({
              x: e.nativeEvent.clientX,
              y: e.nativeEvent.clientY,
            });
          }}
        />
      ))}
    </group>
  );
}
