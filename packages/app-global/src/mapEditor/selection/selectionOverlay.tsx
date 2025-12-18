// SelectionOverlayBox.tsx
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox.js';
import { SelectionHelper } from 'three/examples/jsm/interactive/SelectionHelper.js';
import { useSelectionStore } from '../selection/selectionStore';
const LEFT_PANEL_WIDTH = 50;
const TOP_PANEL_HEIGHT = 88;
function getCanvasPoint(e: PointerEvent, dom: HTMLCanvasElement): THREE.Vector2 {
  const rect = dom.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  return new THREE.Vector2((e.clientX - rect.left) * dpr, (e.clientY - rect.top - 50) * dpr);
}

export function SelectionOverlayBox() {
  const { camera, gl, scene, controls } = useThree();
  const { setCandidates, openFilter, startSelection } = useSelectionStore((s) => ({
    setCandidates: s.setCandidates,
    openFilter: s.openFilter,
    startSelection: s.startSelection,
  }));

  // 框选时禁用相机平移
  useEffect(() => {
    if (!controls) return;
    controls.enablePan = !startSelection;
  }, [startSelection, controls]);

  const pointerDownRef = useRef(false);
  const startCanvasPosRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const selectionBoxRef = useRef<SelectionBox>();
  const helperRef = useRef<SelectionHelper>();

  // 初始化
  useEffect(() => {
    if (!camera || !scene || !gl) return;

    selectionBoxRef.current = new SelectionBox(camera, scene);
    helperRef.current = new SelectionHelper(gl, 'selectBox');

    // 样式
    const style = document.createElement('style');
    style.innerHTML = `
      .selectBox {
        border: 1px dashed #ffffff;
        background-color: rgba(0, 150, 255, 0.15);
        position: absolute;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }, [camera, scene, gl]);

  // 事件监听
  useEffect(() => {
    if (!gl?.domElement || !selectionBoxRef.current || !helperRef.current) return;

    const dom = gl.domElement;
    debugger;

    const onPointerDown = (e: PointerEvent) => {
      if (!startSelection) return;

      pointerDownRef.current = true;

      // 记录 canvas 像素坐标
      const p = getCanvasPoint(e, dom);
      startCanvasPosRef.current.copy(p);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDownRef.current) return;

      const box = selectionBoxRef.current!;
      const start = startCanvasPosRef.current;
      const end = getCanvasPoint(e, dom);

      box.startPoint.set(start.x, start.y, 0);
      box.endPoint.set(end.x, end.y, 0);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDownRef.current) return;
      pointerDownRef.current = false;

      const box = selectionBoxRef.current!;
      const helper = helperRef.current!;

      // ⚠️ SelectionHelper 维护的是 client 坐标
      // 必须再转换一次
      const start = getCanvasPoint(
        {
          clientX: helper.startPoint.x,
          clientY: helper.startPoint.y,
        } as PointerEvent,
        dom,
      );

      const end = getCanvasPoint(
        {
          clientX: helper.pointBottomRight.x,
          clientY: helper.pointBottomRight.y,
        } as PointerEvent,
        dom,
      );

      box.startPoint.set(start.x, start.y, 0);
      box.endPoint.set(end.x, end.y, 0);

      const selected = box.select();
      setCandidates(selected);
      openFilter();

      helper.onSelectOver(e);
    };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl, setCandidates, openFilter, startSelection]);

  return null;
}
