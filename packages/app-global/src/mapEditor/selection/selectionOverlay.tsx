// SelectionOverlayBox.tsx
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox.js';
import { useSelectionStore } from '../selection/selectionStore';

function clientToCanvasPx(e: { clientX: number; clientY: number }, canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  return new THREE.Vector2((e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr);
}

function canvasPxToNDC(px: number, py: number, canvas: HTMLCanvasElement) {
  return new THREE.Vector3((px / canvas.width) * 2 - 1, -(py / canvas.height) * 2 + 1, 0.5);
}

export function SelectionOverlayBox() {
  const { camera, gl, scene, controls } = useThree();

  const { setCandidates, openFilter, startSelection } = useSelectionStore((s) => ({
    setCandidates: s.setCandidates,
    openFilter: s.openFilter,
    startSelection: s.startSelection,
  }));

  const pointerDownRef = useRef(false);
  const startCanvasPxRef = useRef(new THREE.Vector2());
  const selectionBoxRef = useRef<SelectionBox | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // 框选时禁用相机平移
  useEffect(() => {
    if (!controls) return;
    controls.enablePan = !startSelection;
  }, [startSelection, controls]);

  // 初始化 SelectionBox + overlay
  useEffect(() => {
    if (!camera || !scene || !gl) return;

    const box = new SelectionBox(camera, scene);
    selectionBoxRef.current = box;

    const container = gl.domElement.parentElement!;
    container.style.position = 'relative';

    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.border = '1px dashed #00bfff';
    overlay.style.background = 'rgba(0, 180, 255, 0.15)';
    overlay.style.pointerEvents = 'none';
    overlay.style.display = 'none';

    container.appendChild(overlay);
    overlayRef.current = overlay;

    return () => {
      container.removeChild(overlay);
      overlayRef.current = null;
      selectionBoxRef.current = null;
    };
  }, [camera, scene, gl]);

  useEffect(() => {
    if (!gl?.domElement || !selectionBoxRef.current || !overlayRef.current) return;

    const canvas = gl.domElement;
    const box = selectionBoxRef.current;
    const overlay = overlayRef.current;
    const dpr = window.devicePixelRatio || 1;

    const onPointerDown = (e: PointerEvent) => {
      if (!startSelection || e.button !== 0) return;

      pointerDownRef.current = true;

      const startPx = clientToCanvasPx(e, canvas);
      startCanvasPxRef.current.copy(startPx);

      const startNDC = canvasPxToNDC(startPx.x, startPx.y, canvas);

      box.startPoint.copy(startNDC);
      box.endPoint.copy(startNDC);

      overlay.style.display = 'block';
      overlay.style.left = `${startPx.x / dpr}px`;
      overlay.style.top = `${startPx.y / dpr}px`;
      overlay.style.width = '0px';
      overlay.style.height = '0px';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDownRef.current || !startSelection) return;

      const endPx = clientToCanvasPx(e, canvas);
      const endNDC = canvasPxToNDC(endPx.x, endPx.y, canvas);

      box.endPoint.copy(endNDC);

      const x = Math.min(startCanvasPxRef.current.x, endPx.x);
      const y = Math.min(startCanvasPxRef.current.y, endPx.y);
      const w = Math.abs(endPx.x - startCanvasPxRef.current.x);
      const h = Math.abs(endPx.y - startCanvasPxRef.current.y);

      overlay.style.left = `${x / dpr}px`;
      overlay.style.top = `${y / dpr}px`;
      overlay.style.width = `${w / dpr}px`;
      overlay.style.height = `${h / dpr}px`;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!pointerDownRef.current || !startSelection) return;

      pointerDownRef.current = false;
      overlay.style.display = 'none';

      const endPx = clientToCanvasPx(e, canvas);
      const endNDC = canvasPxToNDC(endPx.x, endPx.y, canvas);

      box.endPoint.copy(endNDC);

      const selected = box.select();
      console.log('框选结果:', selected);

      // 🔥 设置选中的对象，供 DrawPoints 使用
      setCandidates(selected);
      openFilter();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
    };
  }, [gl, startSelection, setCandidates, openFilter]);

  return null;
}
