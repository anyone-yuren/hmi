import { ThreeEvent, useThree } from '@react-three/fiber';
import { message } from 'antd';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorStore } from '../../../store';
import { useMapEditorMenuStore } from '../../../store/mapMenuStore';
import { useStorageLocationStore } from './store/storageLocationStore';

const LocationSprite = ({
  id,
  position,
  selected,
  name,
  type,
  onContextMenu,
  onClick,
}: {
  id: string;
  position: THREE.Vector3;
  selected: boolean;
  name: string;
  type?: string;
  onContextMenu: (e: ThreeEvent<MouseEvent>) => void;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const getColor = (t?: string) => {
      switch (t) {
        case '货架工位':
          return '#f97316'; // orange-500
        case '堆叠工位':
          return '#a855f7'; // purple-500
        case '平库工位':
        default:
          return '#14b8a6'; // teal-500
      }
    };

    const getLabel = (t?: string) => {
      switch (t) {
        case '货架工位':
          return 'R';
        case '堆叠工位':
          return 'S';
        case '平库工位':
        default:
          return 'F';
      }
    };

    // Background
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fillStyle = selected ? '#3b82f6' : getColor(type);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(getLabel(type), 64, 64);

    return new THREE.CanvasTexture(canvas);
  }, [selected, type]);

  return (
    <sprite
      position={position}
      scale={[0.5, 0.5, 1]}
      onClick={onClick}
      onContextMenu={onContextMenu}
      renderOrder={100}
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

const ParkingPointSprite = ({
  position,
  selected,
  onClick,
}: {
  position: THREE.Vector3;
  selected: boolean;
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.beginPath();
    ctx.arc(32, 32, 28, 0, Math.PI * 2);
    ctx.fillStyle = selected ? '#eab308' : '#3b82f6'; // yellow-500 (selected) or blue-500
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Text "P"
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', 32, 34);

    return new THREE.CanvasTexture(canvas);
  }, [selected]);

  return (
    <sprite
      position={position}
      scale={[0.3, 0.3, 1]}
      onClick={onClick}
      renderOrder={100}
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
  const { controls, camera } = useThree();

  const {
    mode,
    storageLocations,
    addStorageLocation,
    select,
    selectedIds,
    setContextMenuPosition,
    setEditingPoint,
    setMode,
    focusTarget,
    setFocusTarget,
  } = useStorageLocationStore(
    useShallow((state) => ({
      mode: state.mode,
      storageLocations: state.storageLocations,
      addStorageLocation: state.addStorageLocation,
      select: state.select,
      selectedIds: state.selectedIds,
      setContextMenuPosition: state.setContextMenuPosition,
      setEditingPoint: state.setEditingPoint,
      setMode: state.setMode,
      focusTarget: state.focusTarget,
      setFocusTarget: state.setFocusTarget,
    })),
  );

  const { showContextMenu, selectObject } = useMapEditorMenuStore(
    useShallow((state) => ({
      showContextMenu: state.showContextMenu,
      selectObject: state.selectObject,
    })),
  );

  const { staticPoints, selectDrawType } = useMapEditorStore(
    useShallow((state) => ({
      staticPoints: state.staticPoints,
      selectDrawType: state.selectDrawType,
    })),
  );

  useEffect(() => {
    if (selectDrawType === 'storageLocation') {
      setMode('draw-storage-location');
    } else {
      setMode('idle');
    }
  }, [selectDrawType, setMode]);

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

  // Camera Focus Effect
  useEffect(() => {
    if (focusTarget && controls) {
      const targetLoc = storageLocations.find((l) => l.id === focusTarget);
      if (targetLoc) {
        // Smoothly move camera or jump
        // For simple implementation, let's jump the target and keep camera offset
        const ctrl = controls as any;
        if (!ctrl.target) return;

        const currentTarget = ctrl.target.clone();
        const newTarget = new THREE.Vector3(
          targetLoc.position.x,
          targetLoc.position.y,
          0,
        );
        const offset = camera.position.clone().sub(currentTarget);

        ctrl.target.copy(newTarget);
        camera.position.copy(newTarget).add(offset);
        ctrl.update();

        // Clear focus target to avoid repeated jumps
        setFocusTarget(null);
      }
    }
  }, [focusTarget, storageLocations, controls, camera, setFocusTarget]);

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

            // Check overlap
            const MIN_DISTANCE = 1; // Define overlap threshold
            const hasOverlap = storageLocations.some((loc) => {
              const locPos = new THREE.Vector3(
                loc.position.x,
                loc.position.y,
                loc.position.z,
              );
              return locPos.distanceTo(point) < MIN_DISTANCE;
            });

            if (hasOverlap) {
              message.warning('该位置与现有库位重叠，请选择其他位置');
              return;
            }

            const newLocation = {
              id: `SL${Date.now()}`,
              position: { x: point.x, y: point.y, z: 0 },
              name: `库位 ${storageLocations.length + 1}`,
              type: 'storage' as const,
              storageType: '平库工位',
            };
            addStorageLocation(newLocation);
          }}
        >
          <planeGeometry args={[10000, 10000]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
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
          type={loc.storageType}
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

      {/* Visualize connection to parking points and allow editing */}
      {staticPoints.map((p) => {
        if (!p.storageLocationId) return null;
        const loc = storageLocations.find((l) => l.id === p.storageLocationId);
        if (!loc) return null;
        const isSelected = selectedIds.includes(loc.id);

        return (
          <group key={`conn-${p.id}`}>
            {/* Connection Line */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach='attributes-position'
                  count={2}
                  array={
                    new Float32Array([
                      loc.position.x,
                      loc.position.y,
                      0,
                      p.position.x,
                      p.position.y,
                      0,
                    ])
                  }
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color={isSelected ? '#ffff00' : '#cccccc'}
                opacity={0.5}
                transparent
              />
            </line>

            {/* Clickable Target on Point */}
            <ParkingPointSprite
              position={new THREE.Vector3(p.position.x, p.position.y, 0)}
              selected={isSelected}
              onClick={(e) => {
                if (isDragging.current) return;
                e.stopPropagation();
                setEditingPoint(p);
                select([loc.id]); // Also select the parent storage location
              }}
            />
          </group>
        );
      })}
    </group>
  );
}
