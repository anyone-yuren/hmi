import { Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../store';

interface LineData {
  id: number;
  start: THREE.Vector3;
  end: THREE.Vector3;
  points: THREE.Vector3[];
}

let nextLineId = 1;
const NUM_POINTS = 5;
const HOVER_DISTANCE_PIXELS = 10; // 鼠标接近线条的选中阈值

function DrawLines() {
  const { paramsPanelCollapsed, selectDrawType } = useMapEditorStore(
    useShallow((s) => ({
      paramsPanelCollapsed: s.paramsPanelCollapsed,
      selectDrawType: s.selectDrawType,
    })),
  );

  const pick = usePickOnXYPlane();
  const { camera, controls, mouse } = useThree();

  const [lines, setLines] = useState<LineData[]>([]);
  const [drawing, setDrawing] = useState<LineData | null>(null);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

  const pressedKey = useRef<'x' | 'y' | null>(null);
  const draggingPoint = useRef<{ lineId: number; pointIndex: number } | null>(null);

  /* ------------------- 键盘监听（锁轴 + ESC退出编辑） ------------------- */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'x') pressedKey.current = 'x';
      if (e.key.toLowerCase() === 'y') pressedKey.current = 'y';
      if (e.key === 'Escape') {
        setSelectedLineId(null);
        draggingPoint.current = null;
        if (controls) controls.enabled = true; // 恢复相机
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === pressedKey.current) pressedKey.current = null;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  /* ------------------- 绘制 & 拖动线条事件 ------------------- */
  const onMouseDown = (e: MouseEvent) => {
    if (!paramsPanelCollapsed) return;

    // 绘制模式：未选中线条
    if (selectDrawType === 'line' && selectedLineId === null) {
      if (controls) controls.enabled = false;
      const p = pick(e);
      if (!p) return;
      setDrawing({ id: nextLineId++, start: p.clone(), end: p.clone(), points: [] });
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    // 绘制线条
    if (drawing) {
      const p = pick(e);
      if (!p) return;
      const newEnd = p.clone();
      if (pressedKey.current === 'x') newEnd.y = drawing.start.y;
      if (pressedKey.current === 'y') newEnd.x = drawing.start.x;
      setDrawing((prev) => prev && { ...prev, end: newEnd });
    }

    // 拖动线条端点
    if (draggingPoint.current) {
      const p = pick(e);
      if (!p) return;
      const { lineId, pointIndex } = draggingPoint.current;

      // 只允许拖动第0或最后一个点（端点）
      if (pointIndex !== 0 && pointIndex !== NUM_POINTS - 1) return;

      setLines((prev) =>
        prev.map((line) => {
          if (line.id !== lineId) return line;

          const newPoints = [...line.points];
          let newPos = p.clone();
          if (pressedKey.current === 'x') newPos.y = newPoints[pointIndex].y;
          if (pressedKey.current === 'y') newPos.x = newPoints[pointIndex].x;

          newPoints[pointIndex] = newPos;

          // 根据端点重新生成等分点
          const start = newPoints[0];
          const end = newPoints[NUM_POINTS - 1];
          const interpolated: THREE.Vector3[] = [];
          for (let i = 0; i < NUM_POINTS; i++) {
            const t = i / (NUM_POINTS - 1);
            interpolated.push(new THREE.Vector3(start.x + (end.x - start.x) * t, start.y + (end.y - start.y) * t, 0));
          }

          return {
            ...line,
            start: interpolated[0],
            end: interpolated[NUM_POINTS - 1],
            points: interpolated,
          };
        }),
      );
    }
  };

  const onMouseUp = () => {
    if (drawing) {
      if (controls) controls.enabled = true;
      const distance = drawing.start.distanceTo(drawing.end);
      if (distance < 0.01) {
        setDrawing(null);
        return;
      }

      const points: THREE.Vector3[] = [];
      for (let i = 0; i < NUM_POINTS; i++) {
        const t = i / (NUM_POINTS - 1);
        points.push(
          new THREE.Vector3(
            drawing.start.x + (drawing.end.x - drawing.start.x) * t,
            drawing.start.y + (drawing.end.y - drawing.start.y) * t,
            0,
          ),
        );
      }

      setLines((prev) => [...prev, { ...drawing, points }]);
      setDrawing(null);
    }

    draggingPoint.current = null;
  };

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [drawing, paramsPanelCollapsed, selectDrawType, selectedLineId]);

  /* ------------------- 控制相机拖动 */
  useFrame(() => {
    if (controls) controls.enabled = !drawing && selectedLineId === null;
  });

  /* ------------------- 渲染线条 & 可拖动端点 */
  return (
    <>
      {lines.map((line) => (
        <group key={line.id}>
          <Line
            points={line.points}
            color={line.id === selectedLineId ? '#ff0000' : '#00ff00'}
            lineWidth={2}
            onClick={() => setSelectedLineId(line.id)}
          />

          {line.id === selectedLineId &&
            line.points.map((pt, index) => (
              <mesh
                key={index}
                position={pt}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  // 只允许拖动端点
                  if (index === 0 || index === NUM_POINTS - 1) {
                    draggingPoint.current = { lineId: line.id, pointIndex: index };
                  }
                }}
              >
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color={index === 0 || index === NUM_POINTS - 1 ? '#ff0000' : '#ffffff'} />
              </mesh>
            ))}
        </group>
      ))}

      {drawing && <Line points={[drawing.start, drawing.end]} color='#ff0000' lineWidth={2} />}
    </>
  );
}

export default DrawLines;
