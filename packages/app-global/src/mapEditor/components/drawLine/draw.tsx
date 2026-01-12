import { Line } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../store';
import { THREE_LAYERS } from '../../three/constants/threeLayers';
import { buildSelectLineData } from '../../utils/line';

interface LineData {
  id: number;
  start: THREE.Vector3;
  end: THREE.Vector3;
  points: THREE.Vector3[];
}

const ARROW_LENGTH = 0.2;
const ARROW_WIDTH = 0.125;

let nextLineId = 1;
const NUM_POINTS = 5;

function DrawLines() {
  const { paramsPanelCollapsed, selectDrawType, selectLineData, setSelectLineData, lineList, setLineList } =
    useMapEditorStore(
      useShallow((s) => ({
        paramsPanelCollapsed: s.paramsPanelCollapsed,
        selectDrawType: s.selectDrawType,
        selectLineData: s.selectLineData,
        setSelectLineData: s.setSelectLineData,
        lineList: s.lineList,
        setLineList: s.setLineList,
      })),
    );
  const pick = usePickOnXYPlane();
  const { controls, camera, gl } = useThree();
  useEffect(() => {
    camera.layers.enable(THREE_LAYERS.DRAW);
  }, []);

  const [lines, setLines] = useState<LineData[]>([]);
  const [drawing, setDrawing] = useState<LineData | null>(null);
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

  const pressedKey = useRef<'x' | 'y' | null>(null);
  const draggingPoint = useRef<{ lineId: number; pointIndex: number } | null>(null);

  /* ------------------- 键盘监听 ------------------- */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'x') pressedKey.current = 'x';
      if (e.key === 'y') pressedKey.current = 'y';
      if (e.key === 'Escape') {
        setSelectedLineId(null);
        draggingPoint.current = null;
        setSelectLineData(null);
        if (controls) controls.enablePan = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === pressedKey.current) pressedKey.current = null;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!controls) return;

    // ❗禁止 controls 吃掉右键
    controls.mouseButtons.RIGHT = null;
  }, [controls]);

  /* ------------------- 鼠标事件 ------------------- */
  const onMouseDown = (e: MouseEvent) => {
    if (!paramsPanelCollapsed && selectDrawType !== 'line') return;
    if (selectDrawType === 'line' && !selectedLineId) {
      if (controls) controls.enablePan = false;
      const p = pick(e);
      if (!p) return;
      setDrawing({ id: nextLineId++, start: p.clone(), end: p.clone(), points: [] });
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (drawing) {
      const p = pick(e);
      if (!p) return;

      const newEnd = p.clone();
      if (pressedKey.current === 'x') newEnd.y = drawing.start.y;
      if (pressedKey.current === 'y') newEnd.x = drawing.start.x;

      setDrawing((prev) => prev && { ...prev, end: newEnd });
    }

    if (draggingPoint.current) {
      const p = pick(e);
      if (!p) return;

      const { lineId, pointIndex } = draggingPoint.current;
      if (pointIndex !== 0 && pointIndex !== NUM_POINTS - 1) return;

      setLines((prev) =>
        prev.map((line) => {
          if (line.id !== lineId) return line;

          const newPoints = [...line.points];
          let newPos = p.clone();
          if (pressedKey.current === 'x') newPos.y = newPoints[pointIndex].y;
          if (pressedKey.current === 'y') newPos.x = newPoints[pointIndex].x;

          newPoints[pointIndex] = newPos;

          const start = newPoints[0];
          const end = newPoints[NUM_POINTS - 1];

          const interpolated: THREE.Vector3[] = [];
          for (let i = 0; i < NUM_POINTS; i++) {
            const t = i / (NUM_POINTS - 1);
            interpolated.push(new THREE.Vector3(start.x + (end.x - start.x) * t, start.y + (end.y - start.y) * t, 0));
          }

          const updatedLine = {
            ...line,
            start,
            end,
            points: interpolated,
          };
          // ✅ 如果正在编辑的是选中线，同步 Zustand
          if (line.id === selectedLineId) {
            setSelectLineData(buildSelectLineData(updatedLine));
          }

          return updatedLine;
        }),
      );
    }
  };

  const onMouseUp = () => {
    if (drawing) {
      // 控制不可平移 但是可缩放
      if (controls) controls.enablePan = true;

      if (drawing.start.distanceTo(drawing.end) < 0.01) {
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

      const newLine: LineData = { ...drawing, points };

      setLines((prev) => [...prev, newLine]);
      // ✅ 更新 Zustand 中的线列表
      setLineList([...lines, newLine]);

      // ✅ 选中刚画的线
      setSelectedLineId(newLine.id);

      // ✅ 写入 Zustand
      setSelectLineData(buildSelectLineData(newLine));

      setDrawing(null);
    }

    draggingPoint.current = null;
  };

  useEffect(() => {
    if (!gl) return;
    const canvas = gl.domElement;

    const handleDown = (e: MouseEvent) => onMouseDown(e);
    const handleMove = (e: MouseEvent) => onMouseMove(e);
    const handleUp = (e: MouseEvent) => onMouseUp();

    canvas.addEventListener('mousedown', handleDown);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleUp);

    return () => {
      canvas.removeEventListener('mousedown', handleDown);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleUp);
    };
  }, [gl, drawing, selectedLineId, paramsPanelCollapsed, selectDrawType, controls, lines]);

  /* ------------------- 相机控制 ------------------- */
  // useFrame(() => {
  //   if (controls) controls.enablePan = !drawing && selectedLineId === null;
  // });
  useEffect(() => {
    if (!controls) return;
    controls.enablePan = !drawing && selectedLineId === null;
  }, [drawing, selectedLineId, controls]);

  /* ------------------- 箭头组件 ------------------- */
  const Arrow = ({ start, end, selected }: { start: THREE.Vector3; end: THREE.Vector3; selected: boolean }) => {
    // 2D 方向（XY 平面）
    const dir = end.clone().sub(start);
    const angle = Math.atan2(dir.y, dir.x); // Z 轴旋转角

    // 三角形（局部坐标，指向 +X）
    const vertices = new Float32Array([
      ARROW_LENGTH / 2,
      0,
      0, // 尖端
      -ARROW_LENGTH / 2,
      ARROW_WIDTH / 2,
      0, // 左
      -ARROW_LENGTH / 2,
      -ARROW_WIDTH / 2,
      0, // 右
    ]);

    return (
      <mesh position={end} rotation={[0, 0, angle]}>
        <bufferGeometry>
          <bufferAttribute attach='attributes-position' array={vertices} count={3} itemSize={3} />
        </bufferGeometry>

        <meshBasicMaterial color={selected ? '#ff0000' : '#00ff00'} side={THREE.DoubleSide} wireframe />
      </mesh>
    );
  };
  /* ------------------- 渲染 ------------------- */
  return (
    <group>
      {lines.map((line) => (
        <group key={line.id}>
          {line.points.length >= 2 && (
            <Line
              points={line.points}
              color={line.id === selectedLineId ? '#ff0000' : '#00ff00'}
              lineWidth={4}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedLineId(line.id);
                setSelectLineData(buildSelectLineData(line));
              }}
            />
          )}
          <mesh
            ref={(obj) => {
              if (obj) obj.layers.set(THREE_LAYERS.DRAW);
            }}
            position={[0, 0, -0.01]}
            onPointerDown={(e) => {
              e.stopPropagation();

              if (e.button === 0 || e.button === 2) {
                setSelectedLineId(line.id);
                setSelectLineData(buildSelectLineData(line));
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <tubeGeometry args={[new THREE.CatmullRomCurve3(line.points), 8, 0.05, 6, false]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>

          {/* 箭头 */}
          <Arrow start={line.start} end={line.end} selected={line.id === selectedLineId} />

          {/* 端点控制 */}
          {line.id === selectedLineId &&
            line.points.map((pt, index) => (
              <mesh
                key={index}
                position={pt}
                onPointerDown={(e) => {
                  e.stopPropagation();
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

      {drawing && drawing.start && drawing.end && (
        <Line points={[drawing.start, drawing.end]} color='#ff0000' lineWidth={2} />
      )}
    </group>
  );
}

export default DrawLines;
