import { Line, Text } from '@react-three/drei';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../store';
import { THREE_LAYERS } from '../../three/constants/threeLayers';
import { buildSelectLineData } from '../../utils/line';
import { LineData, useEndpointSystem } from './useEndpointSystem';

const ENDPOINT_RADIUS = 0.025; // Scaled down from 0.15
const ENDPOINT_COLOR_DEFAULT = '#ffffff';
const ENDPOINT_COLOR_HOVER = '#ffff00';
const ENDPOINT_COLOR_SELECTED = '#ff0000';
const LINE_WIDTH = 2;
// SNAP_DISTANCE handled in hook

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

  const { controls, camera, size, gl } = useThree();
  const pick = usePickOnXYPlane();
  const [drawing, setDrawing] = useState<{
    start: THREE.Vector3;
    end: THREE.Vector3;
    startId: string;
    endId?: string;
  } | null>(null);

  const [hoveredPoint, setHoveredPoint] = useState<{
    pos: THREE.Vector3;
    id: string;
  } | null>(null);
  const [isOrtho, setIsOrtho] = useState(false);

  // Hook for Endpoint System (Visuals, BVH, Picking)
  const { EndpointRender, findSnapPoint, getHoveredIdFromGPU, uniquePoints } =
    useEndpointSystem(lineList as unknown as LineData[]);

  // Refs for event listeners to avoid stale closures
  const drawingRef = useRef(drawing);
  drawingRef.current = drawing;
  const lineListRef = useRef(lineList);
  lineListRef.current = lineList;
  const isOrthoRef = useRef(isOrtho);
  isOrthoRef.current = isOrtho;

  // Generate new Point ID
  const generatePointId = (currentList: any[]) => {
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
    // Request 1: Right click pan enabled
    // Request 6: Disable pan when drawing
    (controls as any).enablePan = !drawing;
    // Always disable rotation as per requirement
    (controls as any).enableRotate = false;
  }, [controls, drawing]);

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

  // RAF Refs
  const mouseEventRef = useRef<MouseEvent | null>(null);
  const rafRef = useRef<number | null>(null);

  // Global event listeners for dragging with RAF Throttle (Request 3)
  useEffect(() => {
    if (!drawing) return;

    const updateLoop = () => {
      if (mouseEventRef.current) {
        const e = mouseEventRef.current;
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
          let snap: { pos: THREE.Vector3; id: string } | null = null;

          // Try GPU Picking first (if we can map mouseEvent to NDC)
          // mouseEventRef.current.clientX is relative to window
          // We need coordinates relative to the canvas?
          // Assuming the canvas covers the window or we can use event.offsetX/Y if available on MouseEvent?
          // Standard MouseEvent has clientX/Y.
          // We need to convert to NDC [-1, 1].
          // Let's assume full screen canvas for now or simple conversion.
          // Better: use the 'pick' result 'p' is world coord.
          // getHoveredIdFromGPU needs NDC.

          // Construct NDC from mouse event
          // Note: This assumes canvas is full window size or we need bounding rect
          // Since we are in a React component, getting canvas rect is hard without ref.
          // But 'size' from useThree gives us canvas width/height.
          // And we can assume the event clientX/Y matches if the canvas is full screen.
          // Let's try to be robust.

          const rect = gl.domElement.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const ndc = new THREE.Vector2(
            (x / rect.width) * 2 - 1,
            -(y / rect.height) * 2 + 1,
          );

          const gpuResult = getHoveredIdFromGPU(ndc);
          if (gpuResult) {
            snap = gpuResult;
          } else {
            // Fallback to spatial BVH
            snap = findSnapPoint(endPos);
          }

          const finalPos = snap ? snap.pos.clone() : endPos;
          const endId = snap ? snap.id : undefined;

          setDrawing((prev) => prev && { ...prev, end: finalPos, endId });
        }
        mouseEventRef.current = null;
      }
      rafRef.current = null;
    };

    const handleGlobalMove = (e: MouseEvent) => {
      mouseEventRef.current = e;
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateLoop);
      }
    };

    const handleGlobalUp = (e: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      const currentDrawing = drawingRef.current;
      if (currentDrawing) {
        const {
          start,
          end,
          startId,
          endId: preCalculatedEndId,
        } = currentDrawing;

        // Check if line is long enough
        if (start.distanceTo(end) > 0.1) {
          const currentList = lineListRef.current;

          // Determine End ID
          // Priority: Snapped ID from Drawing State > Fallback Snap > Generate New
          let endId = preCalculatedEndId;

          if (!endId) {
            const snap = findSnapPoint(end);
            endId = snap ? snap.id : undefined;
          }

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
          const newLine: any = {
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [
    drawing,
    pick,
    setLineList,
    setSelectedLineId,
    setSelectLineData,
    setParamsPanelCollapsed,
    findSnapPoint,
  ]);

  const handlePointerDown = (e: ThreeEvent<MouseEvent>) => {
    if (selectDrawType !== 'line') return;
    e.stopPropagation();

    if (e.button !== 0) return; // Only left click

    // GPU Picking for start point (High priority)
    const gpuSnap = getHoveredIdFromGPU(e.pointer);

    if (gpuSnap) {
      setDrawing({
        start: gpuSnap.pos.clone(),
        end: gpuSnap.pos.clone(),
        startId: gpuSnap.id,
      });
      return;
    }

    const p = pick(e.nativeEvent);
    if (!p) return;

    // Fallback: Check snap for start point using BVH
    let startPoint = p.clone();
    let startId = '';

    const snap = findSnapPoint(startPoint);
    if (snap) {
      startPoint = snap.pos.clone();
      startId = snap.id;
    } else {
      startId = generatePointId(lineList);
    }

    setDrawing({
      start: startPoint,
      end: startPoint.clone(),
      startId: startId,
    });
  };

  const handlePointerMove = (e: ThreeEvent<MouseEvent>) => {
    if (selectDrawType !== 'line' || drawing) return;

    // GPU Picking for hover feedback
    const gpuSnap = getHoveredIdFromGPU(e.pointer);

    if (gpuSnap) {
      setHoveredPoint(gpuSnap);
      document.body.style.cursor = 'crosshair';
    } else {
      setHoveredPoint(null);
      document.body.style.cursor = 'auto';
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
      {lineList.map((line: any) => {
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

        return (
          <group key={line.id}>
            <Line
              points={[start, end]}
              color={isSelected ? '#ff0000' : '#00ff00'}
              lineWidth={LINE_WIDTH}
              onClick={(e) => handleLineClick(e, line as unknown as LineData)}
            />
            {/* Direction Arrow (Request 2: Scaled down) */}
            <group position={mid} ref={(ref) => ref && ref.lookAt(end)}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.02, 0.05, 8]} />
                <meshBasicMaterial color={isSelected ? '#ff0000' : '#00ff00'} />
              </mesh>
            </group>
            {/* Line ID at center */}
            <Text
              position={[mid.x, mid.y, mid.z + 0.5]}
              fontSize={0.1}
              color='white'
              anchorX='center'
              anchorY='bottom'
            >
              {line.id}
            </Text>
          </group>
        );
      })}

      {/* Render Unique Points (Endpoints) via InstancedMesh (Request 5) */}
      <EndpointRender />

      {/* Point ID Text (Still needed as separate Text objects) */}
      {uniquePoints.map(([id, pos]) => (
        <group key={id} position={pos}>
          {/* Visual sphere is now in InstancedMesh */}
          {/* We just render the Text */}
          <Text
            position={[0, 0, ENDPOINT_RADIUS + 0.3]}
            fontSize={0.1}
            color='white'
            anchorX='center'
            anchorY='bottom'
            // @ts-ignore
            depthTest={false}
            renderOrder={1001}
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
          {/* Start Point: Always render sphere for feedback, text only if new */}
          <mesh position={drawing.start} renderOrder={1000}>
            <sphereGeometry args={[ENDPOINT_RADIUS, 16, 16]} />
            <meshBasicMaterial
              color={ENDPOINT_COLOR_SELECTED}
              depthTest={false}
            />
          </mesh>
          {!uniquePoints.some(([id]) => id === drawing.startId) && (
            <Text
              position={[
                drawing.start.x,
                drawing.start.y,
                drawing.start.z + 0.5,
              ]}
              fontSize={0.1}
              color='white'
              // @ts-ignore
              depthTest={false}
              renderOrder={1001}
            >
              {drawing.startId}
            </Text>
          )}

          {/* End Point: Always render sphere for feedback */}
          <mesh position={drawing.end} renderOrder={1000}>
            <sphereGeometry args={[ENDPOINT_RADIUS, 16, 16]} />
            <meshBasicMaterial
              color={ENDPOINT_COLOR_SELECTED}
              depthTest={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
