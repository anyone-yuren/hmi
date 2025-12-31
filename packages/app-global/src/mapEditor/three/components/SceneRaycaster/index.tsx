import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';
import { useMapEditorMenuStore } from '../../../store/mapMenuStore';
import { THREE_LAYERS } from '../../constants/threeLayers';

export function SceneRaycaster() {
  const { camera, scene, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const { selectObject, showContextMenu, hideContextMenu, selected } = useMapEditorMenuStore(
    useShallow((s) => ({
      selectObject: s.selectObject,
      showContextMenu: s.showContextMenu,
      hideContextMenu: s.hideContextMenu,
      selected: s.selected,
    })),
  );

  useEffect(() => {
    raycaster.current.layers.set(THREE_LAYERS.DRAW);
  }, []);

  useEffect(() => {
    const dom = gl.domElement;
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const rect = dom.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const hits = raycaster.current.intersectObjects(scene.children, true);
      if (hits.length === 0) {
        // ❌ 没命中：不弹
        selectObject(null);
        hideContextMenu();
        return;
      }
      // ✅ 命中
      selectObject(hits[0].object);
      showContextMenu(e.clientX, e.clientY);
    };

    dom.addEventListener('contextmenu', onContextMenu);
    return () => dom.removeEventListener('contextmenu', onContextMenu);
  }, [camera, scene, gl]);

  return null;
}
