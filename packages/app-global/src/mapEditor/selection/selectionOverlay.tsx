import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox.js';
import { useSelectionStore } from '../selection/selectionStore';

/**
 * client 坐标 → canvas 像素坐标
 * 自动处理 Canvas 容器偏移 + DPR
 */
function clientToCanvas(e: { clientX: number; clientY: number }, dom: HTMLCanvasElement) {
  const rect = dom.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  return new THREE.Vector2((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
}

export function SelectionOverlayBox() {
  const { camera, gl, scene, controls } = useThree();
  const { setCandidates, openFilter, startSelection } = useSelectionStore((s) => ({
    setCandidates: s.setCandidates,
    openFilter: s.openFilter,
    startSelection: s.startSelection,
  }));

  const pointerDownRef = useRef(false);
  const startCanvasPosRef = useRef(new THREE.Vector2());
  const selectionBoxRef = useRef<SelectionBox | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  /** 框选时禁用相机平移 */
  useEffect(() => {
    if (!controls) return;
    controls.enablePan = !startSelection;
  }, [startSelection, controls]);

  /** 初始化 SelectionBox + overlay div */
  useEffect(() => {
    if (!camera || !scene || !gl) return;

    selectionBoxRef.current = new SelectionBox(camera, scene);

    const container = gl.domElement.parentElement!;
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.border = '1px dashed #ffffff';
    overlay.style.background = 'rgba(0,150,255,0.15)';
    overlay.style.pointerEvents = 'none';
    overlay.style.display = 'none';
    container.appendChild(overlay);
    overlayRef.current = overlay;

    return () => {
      container.removeChild(overlay);
      overlayRef.current = null;
    };
  }, [camera, scene, gl]);

  /** pointer 事件 */
  useEffect(() => {
    if (!gl?.domElement || !selectionBoxRef.current || !overlayRef.current) return;

    const dom = gl.domElement;
    const box = selectionBoxRef.current;
    const overlay = overlayRef.current;
    const dpr = window.devicePixelRatio || 1;

    const onPointerDown = (e: PointerEvent) => {
      if (!startSelection) return;

      pointerDownRef.current = true;

      const start = clientToCanvas(e, dom);
      startCanvasPosRef.current.copy(start);

      box.startPoint.set(start.x, start.y, 0);
      box.endPoint.set(start.x, start.y, 0);

      overlay.style.display = 'block';
      overlay.style.left = `${start.x / dpr}px`;
      overlay.style.top = `${start.y / dpr}px`;
      overlay.style.width = '0px';
      overlay.style.height = '0px';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDownRef.current || !startSelection) return;

      const end = clientToCanvas(e, dom);

      box.endPoint.set(end.x, end.y, 0);

      const x = Math.min(startCanvasPosRef.current.x, end.x);
      const y = Math.min(startCanvasPosRef.current.y, end.y);
      const w = Math.abs(end.x - startCanvasPosRef.current.x);
      const h = Math.abs(end.y - startCanvasPosRef.current.y);

      overlay.style.left = `${x / dpr}px`;
      overlay.style.top = `${y / dpr}px`;
      overlay.style.width = `${w / dpr}px`;
      overlay.style.height = `${h / dpr}px`;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDownRef.current || !startSelection) return;

      pointerDownRef.current = false;
      overlay.style.display = 'none';

      const end = clientToCanvas(e, dom);
      box.endPoint.set(end.x, end.y, 0);

      const selectedObjects = box.select();
      setCandidates(selectedObjects);
      openFilter();
    };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl, startSelection, setCandidates, openFilter]);

  return null;
}
