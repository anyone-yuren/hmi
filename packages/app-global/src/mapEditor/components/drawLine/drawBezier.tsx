import { Line } from '@react-three/drei';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../store';
import { buildSelectLineData } from '../../utils/line';
import { LineData, useEndpointSystem } from './useEndpointSystem';

const CURVE_SEGMENTS = 100;

// Simple N-degree Bezier Curve function
function getBezierPoint(t: number, points: THREE.Vector3[]): THREE.Vector3 {
  if (points.length === 1) return points[0].clone();

  // De Casteljau's algorithm
  let currentPoints = points.map((p) => p.clone());
  while (currentPoints.length > 1) {
    const nextPoints: THREE.Vector3[] = [];
    for (let i = 0; i < currentPoints.length - 1; i++) {
      nextPoints.push(currentPoints[i].lerp(currentPoints[i + 1], t));
    }
    currentPoints = nextPoints;
  }
  return currentPoints[0];
}

// Generate points for the Bezier curve
function getBezierPoints(
  points: THREE.Vector3[],
  segments: number,
): THREE.Vector3[] {
  if (points.length < 2) return [];
  const result: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    result.push(getBezierPoint(i / segments, points));
  }
  return result;
}

export default function DrawBezier() {
  const {
    selectDrawType,
    lineList,
    setLineList,
    setSelectedLineId,
    setSelectLineData,
    setParamsPanelCollapsed,
  } = useMapEditorStore(
    useShallow((s) => ({
      selectDrawType: s.selectDrawType,
      lineList: s.lineList,
      setLineList: s.setLineList,
      setSelectedLineId: s.setSelectedLineId,
      setSelectLineData: s.setSelectLineData,
      setParamsPanelCollapsed: s.setParamsPanelCollapsed,
    })),
  );

  const { controls } = useThree();
  const pick = usePickOnXYPlane();

  // Points for the current curve being drawn
  const [points, setPoints] = useState<{ pos: THREE.Vector3; id?: string }[]>(
    [],
  );
  // Current mouse position for preview
  const [tempPoint, setTempPoint] = useState<THREE.Vector3 | null>(null);

  // Helper for snapping
  const { findSnapPoint, getHoveredIdFromGPU } = useEndpointSystem(
    lineList as unknown as LineData[],
    0.01,
  );

  // Disable camera pan when drawing
  useEffect(() => {
    if (!controls) return;
    const isDrawing = points.length > 0;
    (controls as any).enablePan = !isDrawing;
  }, [controls, points.length]);

  const handlePointerDown = (e: ThreeEvent<MouseEvent>) => {
    if (selectDrawType !== 'bezier') return;
    e.stopPropagation();
    if (e.button !== 0) return; // Only left click

    // Check snap
    let snapPos: THREE.Vector3 | null = null;
    let snapId: string | undefined = undefined;

    // 1. GPU Picking
    const gpuSnap = getHoveredIdFromGPU(e.pointer);
    if (gpuSnap) {
      snapPos = gpuSnap.pos.clone();
      snapId = gpuSnap.id;
    } else {
      // 2. Plane Pick + BVH Snap (Restored with 0.01 threshold)
      const p = pick(e.nativeEvent);
      if (p) {
        const bvhSnap = findSnapPoint(p, 0.01);
        if (bvhSnap) {
          snapPos = bvhSnap.pos.clone();
          snapId = bvhSnap.id;
        } else {
          snapPos = p.clone();
        }
      }
    }

    if (snapPos) {
      setPoints((prev) => [...prev, { pos: snapPos!, id: snapId }]);
    }
  };

  const handlePointerMove = (e: ThreeEvent<MouseEvent>) => {
    if (selectDrawType !== 'bezier') return;
    const p = pick(e.nativeEvent);
    if (p) {
      // Optional: Snap temp point too
      const bvhSnap = findSnapPoint(p, 0.01);
      setTempPoint(bvhSnap ? bvhSnap.pos.clone() : p.clone());
    }
  };

  const finishDrawing = () => {
    const currentList = lineList;
    // Helper to get max ID
    let maxId = 0;
    const extractId = (id: string) => {
      if (id && id.startsWith('P')) {
        const num = parseInt(id.substring(1));
        if (!isNaN(num)) return num;
      }
      return 0;
    };
    currentList.forEach((line: any) => {
      maxId = Math.max(maxId, extractId(line.startPointId));
      maxId = Math.max(maxId, extractId(line.endPointId));
    });

    let startId = points[0].id;
    if (!startId) {
      maxId++;
      startId = `P${maxId}`;
    }

    let endId = points[points.length - 1].id;
    if (!endId) {
      maxId++;
      endId = `P${maxId}`;
    }

    // Generate Line ID
    const maxLineId = currentList.reduce(
      (max: number, line: any) => Math.max(max, line.id),
      0,
    );
    const newLineId = maxLineId + 1;

    // Sample Curve
    const curvePoints = points.map((p) => p.pos);
    const sampledPoints = getBezierPoints(curvePoints, CURVE_SEGMENTS);

    const newLine = {
      id: newLineId,
      start: points[0].pos.clone(),
      end: points[points.length - 1].pos.clone(),
      points: sampledPoints,
      controlPoints: curvePoints,
      startPointId: startId,
      endPointId: endId,
      type: 'bezier',
    };

    setLineList([...currentList, newLine]);

    setSelectedLineId(newLineId);
    setSelectLineData(buildSelectLineData(newLine));
    setParamsPanelCollapsed(false);

    // Reset
    setPoints([]);
    setTempPoint(null);
  };

  // Right click to finish
  useEffect(() => {
    const handleRightClick = (e: MouseEvent) => {
      if (selectDrawType !== 'bezier') return;
      if (points.length === 0) return;

      e.preventDefault(); // Prevent context menu

      // Consistent with B-spline logic (requires at least 5 points for complex curves, but for Bezier maybe 3 is min?)
      // User said: "Logic consistent with B-spline". B-spline requires >= 5.
      // I'll stick to 5 for consistency if requested, but Bezier usually needs 3 (Quadratic) or 4 (Cubic).
      // Let's set it to 3 for Bezier as it's more standard, or 5 if user strictly implies constraint.
      // "Logic consistent" might mean interaction style.
      // I'll assume >= 3 is enough for a Bezier (Start, Control, End).
      if (points.length < 3) {
        // Cancel
        setPoints([]);
        setTempPoint(null);
        return;
      }

      // Finish
      finishDrawing();
    };

    window.addEventListener('contextmenu', handleRightClick);
    return () => window.removeEventListener('contextmenu', handleRightClick);
  }, [points, selectDrawType, lineList]);

  // Preview Curve
  const previewPoints = (() => {
    if (points.length === 0) return null;
    const pts = points.map((p) => p.pos);
    if (tempPoint) pts.push(tempPoint);

    // Filter adjacent duplicates
    const uniquePts: THREE.Vector3[] = [];
    for (const p of pts) {
      if (uniquePts.length === 0) {
        uniquePts.push(p);
      } else {
        if (uniquePts[uniquePts.length - 1].distanceTo(p) > 0.001) {
          uniquePts.push(p);
        }
      }
    }

    if (uniquePts.length < 2) return null;

    return getBezierPoints(uniquePts, CURVE_SEGMENTS);
  })();

  // Hull (Control Polygon)
  const hullPoints = (() => {
    if (points.length === 0) return null;
    const pts = points.map((p) => p.pos);
    if (tempPoint) pts.push(tempPoint);
    
    // Filter adjacent duplicates for hull as well
    const uniquePts: THREE.Vector3[] = [];
    for (const p of pts) {
      if (uniquePts.length === 0) {
        uniquePts.push(p);
      } else {
        if (uniquePts[uniquePts.length - 1].distanceTo(p) > 0.001) {
          uniquePts.push(p);
        }
      }
    }
    
    return uniquePts.length >= 2 ? uniquePts : null;
  })();

  return (
    <group>
      {/* Plane for events */}
      {selectDrawType === 'bezier' && (
        <mesh
          visible={false}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
        >
          <planeGeometry args={[10000, 10000]} />
          <meshBasicMaterial />
        </mesh>
      )}

      {/* Preview Curve */}
      {selectDrawType === 'bezier' && previewPoints && (
        <Line 
          points={previewPoints} 
          color='#00ff00' 
          lineWidth={2} 
        />
      )}

      {/* Control Polygon (Hull) */}
      {selectDrawType === 'bezier' && hullPoints && (
        <Line
          points={hullPoints}
          color='#aaaaaa'
          lineWidth={1}
          dashed
          dashScale={2}
        />
      )}

      {/* Control Points (Visual feedback) */}
      {selectDrawType === 'bezier' &&
        points.map((p, i) => (
          <mesh key={i} position={p.pos} renderOrder={1002}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color='orange' depthTest={false} />
          </mesh>
        ))}
    </group>
  );
}
