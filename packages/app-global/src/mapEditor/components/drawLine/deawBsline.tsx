import { Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { debounce } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { usePickOnXYPlane } from '../../hooks/usePickOnXYPanel';
import { useMapEditorStore } from '../../store';
import { buildBezierSelectLineData } from '../../utils/line';

interface BezierData {
  id: number;
  controlPoints: THREE.Vector3[];
  sampledPoints: THREE.Vector3[];
}

const CURVE_SEGMENTS = 50;
const NUM_POINTS = 5;
let nextBezierId = 1;

export default function DrawBSpline() {
  const { selectDrawType, setSelectLineData } = useMapEditorStore(
    useShallow((s) => ({
      selectDrawType: s.selectDrawType,
      setSelectLineData: s.setSelectLineData,
    })),
  );

  const debouncedSetSelectLineData = useRef(
    debounce((data: BezierData) => {
      setSelectLineData(buildBezierSelectLineData(data));
    }, 1000),
  ).current;

  const { controls } = useThree();
  const pick = usePickOnXYPlane();

  const [curves, setCurves] = useState<BezierData[]>([]);
  const [drawingPoints, setDrawingPoints] = useState<THREE.Vector3[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const dragging = useRef<{ id: number; index: number } | null>(null);
  const pressedKey = useRef<'x' | 'y' | null>(null);

  /* ------------------- 键盘 ------------------- */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'x') pressedKey.current = 'x';
      if (e.key === 'y') pressedKey.current = 'y';
      if (e.key === 'Escape') {
        setSelectedId(null);
        dragging.current = null;
        setSelectLineData(null);
        setDrawingPoints([]);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === pressedKey.current) pressedKey.current = null;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  /* ------------------- 曲线采样 ------------------- */
  const sampleCurve = (points: THREE.Vector3[]) => {
    if (points.length < 2) return points;
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    // 参数：points, closed=false, curveType='centripetal'
    return curve.getPoints(CURVE_SEGMENTS);
  };

  /* ------------------- 鼠标 ------------------- */
  const onMouseDown = (e: MouseEvent) => {
    if (selectDrawType !== 'bspline') return;
    if (selectedId !== null || dragging.current) return; // 编辑或拖拽中不绘制

    const p = pick(e);
    if (!p) return;
    const point = p.clone();

    setDrawingPoints((prev) => {
      const newPoints = [...prev, point];
      if (newPoints.length === NUM_POINTS) {
        const sampled = sampleCurve(newPoints);
        const curve: BezierData = {
          id: nextBezierId++,
          controlPoints: newPoints,
          sampledPoints: sampled,
        };
        setCurves((prev) => [...prev, curve]);
        setSelectedId(curve.id);
        setSelectLineData(buildBezierSelectLineData(curve));
        return []; // 清空绘制点
      }
      return newPoints;
    });
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;

    const p = pick(e);
    if (!p) return;
    const point = p.clone();

    setCurves((prev) =>
      prev.map((c) => {
        if (c.id !== dragging.current!.id) return c;

        const pts = [...c.controlPoints];
        if (pressedKey.current === 'x') point.y = pts[dragging.current!.index].y;
        if (pressedKey.current === 'y') point.x = pts[dragging.current!.index].x;

        pts[dragging.current!.index] = point;
        const sampled = sampleCurve(pts);

        const updated = { ...c, controlPoints: pts, sampledPoints: sampled };
        if (c.id === selectedId) debouncedSetSelectLineData(updated);
        return updated;
      }),
    );
  };

  const onMouseUp = () => {
    dragging.current = null;
  };

  useEffect(() => {
    return () => {
      debouncedSetSelectLineData.cancel();
    };
  }, []);

  /* ------------------- 监听绘制类型 ------------------- */
  useEffect(() => {
    if (selectDrawType !== 'bspline') {
      setSelectedId(null); // 清空选中曲线
      setDrawingPoints([]); // 清空正在绘制的点
      dragging.current = null; // 取消拖拽
    }
  }, [selectDrawType]);

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [selectDrawType, drawingPoints]);

  /* ------------------- 相机控制 ------------------- */
  useFrame(() => {
    if (!controls) return;
    const editing = selectedId !== null || drawingPoints.length > 0;
    controls.enablePan = !editing;
    controls.enableZoom = true;
  });

  /* ------------------- 渲染 ------------------- */
  return (
    <>
      {curves.map((c) => (
        <group key={c.id}>
          <Line
            points={c.sampledPoints}
            color={c.id === selectedId ? '#ff0000' : '#00ff00'}
            lineWidth={2}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(c.id);
              setSelectLineData(buildBezierSelectLineData(c));
            }}
          />

          {/* 控制点 */}
          {c.controlPoints.map((pt, i) => (
            <mesh
              key={i}
              position={pt}
              onPointerDown={(e) => {
                e.stopPropagation();
                if (c.id === selectedId) {
                  // 仅选中时允许拖拽
                  dragging.current = { id: c.id, index: i };
                }
              }}
            >
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color='#00aaff' />
            </mesh>
          ))}
        </group>
      ))}

      {/* 绘制中显示点 */}
      {drawingPoints.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.05, 10, 10]} />
          <meshStandardMaterial color='#ffaa00' />
        </mesh>
      ))}
    </>
  );
}
