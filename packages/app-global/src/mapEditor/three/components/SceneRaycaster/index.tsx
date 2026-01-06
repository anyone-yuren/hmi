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
  const { selectObject, showContextMenu, hideContextMenu } = useMapEditorMenuStore(
    useShallow((s) => ({
      selectObject: s.selectObject,
      showContextMenu: s.showContextMenu,
      hideContextMenu: s.hideContextMenu,
    })),
  );

  useEffect(() => {
    // 只命中 DRAW / UI
    raycaster.current.layers.enable(THREE_LAYERS.DRAW);
    raycaster.current.layers.enable(THREE_LAYERS.UI);
  }, []);

  useEffect(() => {
    const dom = gl.domElement;
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const rect = dom.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      // const hits = raycaster.current.intersectObjects(scene.children, true);
      const hits = raycaster.current.intersectObjects(scene.children, true).filter((hit) => {
        let o: THREE.Object3D | null = hit.object;
        while (o) {
          if (o.userData.__gizmo) return false; // ❌ 忽略 gizmo
          o = o.parent;
        }
        return true;
      });
      if (hits.length === 0) {
        // ❌ 没命中：不弹
        selectObject(null);
        hideContextMenu();
        return;
      }
      // ✅ 命中：弹
      selectObject(hits[0].object);
      showContextMenu(e.clientX, e.clientY);
    };

    dom.addEventListener('contextmenu', onContextMenu);
    return () => dom.removeEventListener('contextmenu', onContextMenu);
  }, [camera, scene, gl]);

  return null;
}
