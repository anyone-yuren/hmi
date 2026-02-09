import { Line, Text } from '@react-three/drei';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from 'three-mesh-bvh';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../store';
import { THREE_LAYERS } from '../../three/constants/threeLayers';
import { buildSelectLineData } from '../../utils/line';

// Extend BufferGeometry with three-mesh-bvh methods
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

interface LineData {
  id: number;
  start: THREE.Vector3;
  end: THREE.Vector3;
  points: THREE.Vector3[];
  startPointId: string;
  endPointId: string;
}

const ENDPOINT_RADIUS = 0.15;
const ENDPOINT_COLOR_DEFAULT = '#ffffff';
const ENDPOINT_COLOR_HOVER = '#ffff00';
const ENDPOINT_COLOR_SELECTED = '#ff0000';
const LINE_WIDTH = 4;
const SNAP_DISTANCE = 0.5;

export default function DrawLines() {
  const {
    selectDrawType,
    lineList,
    setLineList,
    selectedLineId,
    setSelectedLineId,
    setSelectLineData,
    setParamsPanelCollapsed,
    setSelectDrawType,
  } = useMapEditorStore(
    useShallow((s) => ({
      selectDrawType: s.selectDrawType,
      lineList: s.lineList,
      setLineList: s.setLineList,
      selectedLineId: s.selectedLineId,
      setSelectedLineId: s.setSelectedLineId,
      setSelectLineData: s.setSelectLineData,
      setParamsPanelCollapsed: s.setParamsPanelCollapsed,
      setSelectDrawType: s.setSelectDrawType,
    })),
  );

  const { controls, camera } = useThree();
  const pick = usePickOnXYPlane();
  const [drawing, setDrawing] = useState<{
    start: THREE.Vector3;
    end: THREE.Vector3;
    startId: string;
  } | null>(null);

  const [hoveredPoint, setHoveredPoint] = useState<{
    pos: THREE.Vector3;
    id: string;
  } | null>(null);
  const [isOrtho, setIsOrtho] = useState(false);

  // Refs for event listeners to avoid stale closures
  const drawingRef = useRef(drawing);
  drawingRef.current = drawing;
  const lineListRef = useRef(lineList);
  lineListRef.current = lineList;
  const isOrthoRef = useRef(isOrtho);
  isOrthoRef.current = isOrtho;

  // BVH Geometry and ID Map
  const { bvhGeometry, faceIdMap } = useMemo(() => {
    const pointMap = new Map<string, THREE.Vector3>();
    lineList.forEach((line) => {
      const start =
        line.start instanceof THREE.Vector3
          ? line.start
          : new THREE.Vector3(
              (line.start as any).x,
              (line.start as any).y,
              (line.start as any).z || 0,
            );
      const end =
        line.end instanceof THREE.Vector3
          ? line.end
          : new THREE.Vector3(
              (line.end as any).x,
              (line.end as any).y,
              (line.end as any).z || 0,
            );
      pointMap.set(line.startPointId, start);
      pointMap.set(line.endPointId, end);
    });

    const points = Array.from(pointMap.entries());
    if (points.length === 0) return { bvhGeometry: null, faceIdMap: [] };

    const positions: number[] = [];
    const pointIndices: number[] = [];
    const ids: string[] = [];
    const size = 0.05; // Tiny triangle size

    points.forEach(([id, pos], index) => {
      // Create a tiny triangle centered at pos
      // v1
      positions.push(pos.x, pos.y + size, pos.z);
      // v2
      positions.push(pos.x - size, pos.y - size, pos.z);
      // v3
      positions.push(pos.x + size, pos.y - size, pos.z);

      pointIndices.push(index, index, index);
      ids.push(id);
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setAttribute(
      'pointIndex',
      new THREE.Float32BufferAttribute(pointIndices, 1),
    );
    geometry.computeBoundsTree();

    return { bvhGeometry: geometry, faceIdMap: ids };
  }, [lineList]);

  // Generate new Point ID
  const generatePointId = (currentList: LineData[]) => {
    let maxId = 0;
    const extractId = (id: string) => {
      if (id && id.startsWith('P')) {
        const num = parseInt(id.substring(1));
        if (!isNaN(num)) return num;
      }
      return 0;
    };

    currentList.forEach((line) => {
      maxId = Math.max(maxId, extractId(line.startPointId));
      maxId = Math.max(maxId, extractId(line.endPointId));
    });

    // Also consider currently drawing start point if applicable
    if (drawingRef.current) {
      maxId = Math.max(maxId, extractId(drawingRef.current.startId));
    }

    return `P${maxId + 1}`;
  };

  // Enable layers
  useEffect(() => {
    camera.layers.enable(THREE_LAYERS.DRAW);
  }, [camera]);

  // Handle controls enablement and rotation
  useEffect(() => {
    if (!controls) return;
    (controls as any).enablePan = !drawing;
    // Always disable rotation as per requirement
    (controls as any).enableRotate = false;

    // If drawing, also ensure we don't accidentally rotate if logic changes
    if (drawing) {
      (controls as any).enableRotate = false;
    }
  }, [drawing, controls]);

  // Ortho Mode Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsOrtho(true);
      }
      if (e.key === 'Escape') {
        setDrawing(null);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsOrtho(false);
      }
    };
    const handleContextMenu = (e: MouseEvent) => {
      if (drawingRef.current) {
        e.preventDefault();
        setDrawing(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Snap logic using BVH
  const findSnapPoint = (pos: THREE.Vector3) => {
    if (!bvhGeometry || !bvhGeometry.boundsTree) return null;

    const target: any = {};
    const result = bvhGeometry.boundsTree.closestPointToPoint(
      pos,
      target,
      SNAP_DISTANCE,
    );

    if (result && result.distance < SNAP_DISTANCE) {
      if (result.faceIndex !== undefined) {
        // Robust lookup using pointIndex attribute
        const faceIndex = result.faceIndex;
        // Check if indexed
        const indexAttr = bvhGeometry.index;
        const vertIndex = indexAttr
          ? indexAttr.getX(faceIndex * 3)
          : faceIndex * 3;

        const pointIndexAttr = bvhGeometry.getAttribute('pointIndex');
        if (pointIndexAttr) {
          const idIndex = pointIndexAttr.getX(vertIndex);
          const id = faceIdMap[idIndex];

          // Find precise position from lineList
          let foundPos: THREE.Vector3 | null = null;
          for (const line of lineListRef.current) {
            if (line.startPointId === id) {
              foundPos =
                line.start instanceof THREE.Vector3
                  ? line.start
                  : new THREE.Vector3(
                      (line.start as any).x,
                      (line.start as any).y,
                      (line.start as any).z || 0,
                    );
              break;
            }
            if (line.endPointId === id) {
              foundPos =
                line.end instanceof THREE.Vector3
                  ? line.end
                  : new THREE.Vector3(
                      (line.end as any).x,
                      (line.end as any).y,
                      (line.end as any).z || 0,
                    );
              break;
            }
          }
          if (foundPos) return { pos: foundPos, id };
        }
      }
    }
    return null;
  };

  // Global event listeners for dragging
  useEffect(() => {
    if (!drawing) return;

    const handleGlobalMove = (e: MouseEvent) => {
      const p = pick(e);
      if (p) {
        // Apply Ortho Mode
        let endPos = p.clone();
        if (isOrthoRef.current && drawingRef.current) {
          const start = drawingRef.current.start;
          const dx = Math.abs(endPos.x - start.x);
          const dy = Math.abs(endPos.y - start.y);
          if (dx > dy) {
            endPos.y = start.y;
          } else {
            endPos.x = start.x;
          }
        }

        // Check snap for end point
        const snap = findSnapPoint(endPos);
        const finalPos = snap ? snap.pos.clone() : endPos;

        setDrawing((prev) => prev && { ...prev, end: finalPos });
      }
    };

    const handleGlobalUp = (e: MouseEvent) => {
      const currentDrawing = drawingRef.current;
      if (currentDrawing) {
        const { start, end, startId } = currentDrawing;

        // Check if line is long enough
        if (start.distanceTo(end) > 0.1) {
          const currentList = lineListRef.current;

          // Determine End ID
          const snap = findSnapPoint(end);

          let endId = snap ? snap.id : null;
          if (!endId) {
            endId = generatePointId(currentList);
            const startNum = parseInt(startId.substring(1));
            const endNum = parseInt(endId.substring(1));
            if (endNum <= startNum) {
              endId = `P${startNum + 1}`;
            }
          }

          const maxId = currentList.reduce(
            (max, line) => Math.max(max, line.id),
            0,
          );
          const newId = maxId + 1;

          const points = [start.clone(), end.clone()];
          const newLine: LineData = {
            id: newId,
            start: start.clone(),
            end: end.clone(),
            points: points,
            startPointId: startId,
            endPointId: endId,
          };

          setLineList([...currentList, newLine]);

          setSelectedLineId(newLine.id);
          setSelectLineData(buildSelectLineData(newLine));
          setParamsPanelCollapsed(false);
        }
      }
      setDrawing(null);
    };

    window.addEventListener('pointermove', handleGlobalMove);
    window.addEventListener('pointerup', handleGlobalUp);

    return () => {
      window.removeEventListener('pointermove', handleGlobalMove);
      window.removeEventListener('pointerup', handleGlobalUp);
    };
  }, [
    drawing,
    pick,
    setLineList,
    setSelectedLineId,
    setSelectLineData,
    setParamsPanelCollapsed,
    bvhGeometry,
    faceIdMap,
  ]); // Added bvh deps

  const handlePointerDown = (e: ThreeEvent<MouseEvent>) => {
    if (selectDrawType !== 'line') return;
    e.stopPropagation();

    if (e.button !== 0) return; // Only left click

    const p = pick(e.nativeEvent);
    if (!p) return;

    // Start point: prioritized hovered point (snap), else picked point
    const snap = findSnapPoint(p);

    const startPoint = snap ? snap.pos.clone() : p.clone();
    const startId = snap ? snap.id : generatePointId(lineList);

    setDrawing({
      start: startPoint,
      end: startPoint.clone(),
      startId: startId,
    });
  };

  const handlePointerMove = (e: ThreeEvent<MouseEvent>) => {
    if (selectDrawType !== 'line' || drawing) return;
    const p = pick(e.nativeEvent);
    if (p) {
      const snap = findSnapPoint(p);
      setHoveredPoint(snap);
      document.body.style.cursor = snap ? 'crosshair' : 'auto';
    }
  };

  // Interaction for existing lines
  const handleLineClick = (e: ThreeEvent<MouseEvent>, line: LineData) => {
    if (drawing) return;
    e.stopPropagation();
    setSelectedLineId(line.id);
    setSelectLineData(buildSelectLineData(line));
    setParamsPanelCollapsed(false);
    setSelectDrawType('line');
  };

  // Helper to get unique points for rendering text/spheres
  const getAllPoints = () => {
    const pointMap = new Map<string, THREE.Vector3>();
    lineList.forEach((line: LineData) => {
      const start =
        line.start instanceof THREE.Vector3
          ? line.start
          : new THREE.Vector3(
              (line.start as any).x,
              (line.start as any).y,
              (line.start as any).z || 0,
            );
      const end =
        line.end instanceof THREE.Vector3
          ? line.end
          : new THREE.Vector3(
              (line.end as any).x,
              (line.end as any).y,
              (line.end as any).z || 0,
            );
      pointMap.set(line.startPointId, start);
      pointMap.set(line.endPointId, end);
    });
    return Array.from(pointMap.entries());
  };

  return (
    <group>
      {/* Background Plane for starting drawing */}
      {selectDrawType === 'line' && (
        <mesh
          visible={false}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <planeGeometry args={[10000, 10000]} />
          <meshBasicMaterial />
        </mesh>
      )}

      {/* Existing Lines */}
      {lineList.map((line: LineData) => {
        // Ensure start/end are Vector3s
        const start =
          line.start instanceof THREE.Vector3
            ? line.start
            : new THREE.Vector3(
                (line.start as any).x,
                (line.start as any).y,
                (line.start as any).z || 0,
              );
        const end =
          line.end instanceof THREE.Vector3
            ? line.end
            : new THREE.Vector3(
                (line.end as any).x,
                (line.end as any).y,
                (line.end as any).z || 0,
              );
        const isSelected = line.id === selectedLineId;

        // Direction Arrow
        const mid = start.clone().add(end).multiplyScalar(0.5);
        const dir = end.clone().sub(start).normalize();
        const length = start.distanceTo(end);

        return (
          <group key={line.id}>
            <Line
              points={[start, end]}
              color={isSelected ? '#ff0000' : '#00ff00'}
              lineWidth={LINE_WIDTH}
              onClick={(e) => handleLineClick(e, line)}
            />
            {/* Direction Arrow */}
            <group position={mid} ref={(ref) => ref && ref.lookAt(end)}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.2, 0.5, 8]} />
                <meshBasicMaterial color={isSelected ? '#ff0000' : '#00ff00'} />
              </mesh>
            </group>
            {/* Line ID at center */}
            <Text
              position={[mid.x, mid.y, mid.z + 0.5]}
              fontSize={0.5}
              color='white'
              anchorX='center'
              anchorY='bottom'
            >
              {line.id}
            </Text>
          </group>
        );
      })}

      {/* Render Unique Points (Endpoints) */}
      {getAllPoints().map(([id, pos]) => (
        <group key={id} position={pos}>
          <mesh>
            <sphereGeometry args={[ENDPOINT_RADIUS, 16, 16]} />
            <meshBasicMaterial
              color={
                hoveredPoint?.id === id
                  ? ENDPOINT_COLOR_HOVER
                  : ENDPOINT_COLOR_DEFAULT
              }
            />
          </mesh>
          {/* Point ID at top */}
          <Text
            position={[0, 0, ENDPOINT_RADIUS + 0.3]}
            fontSize={0.4}
            color='white'
            anchorX='center'
            anchorY='bottom'
          >
            {id}
          </Text>
        </group>
      ))}

      {/* Currently Drawing Line */}
      {drawing && (
        <group>
          <Line
            points={[drawing.start, drawing.end]}
            color='#0000ff'
            lineWidth={LINE_WIDTH}
          />
          <mesh position={drawing.start}>
            <sphereGeometry args={[ENDPOINT_RADIUS, 16, 16]} />
            <meshBasicMaterial color={ENDPOINT_COLOR_SELECTED} />
          </mesh>
          <mesh position={drawing.end}>
            <sphereGeometry args={[ENDPOINT_RADIUS, 16, 16]} />
            <meshBasicMaterial color={ENDPOINT_COLOR_SELECTED} />
          </mesh>
          {/* Current Start ID */}
          <Text
            position={[drawing.start.x, drawing.start.y, drawing.start.z + 0.5]}
            fontSize={0.5}
            color='white'
          >
            {drawing.startId}
          </Text>
        </group>
      )}
    </group>
  );
}
